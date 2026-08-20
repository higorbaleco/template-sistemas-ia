import type { PrismaClient, MessageQueue, Instance } from '@prisma/client';
import type { AxiosError } from 'axios';
import { HttpError } from '../utils/http-error';
import { EvolutionClient } from './evolution';

export interface QueueServiceDependencies {
  prisma: PrismaClient;
  evolutionClient: EvolutionClient;
  now?: () => Date;
}

export interface EnqueueInput {
  organizationId: string;
  instanceId: string;
  recipientPhone: string;
  messageText: string;
  scheduledAt?: Date;
  metadata?: unknown;
}

export interface ProcessPendingOptions {
  organizationId?: string;
  limit?: number;
}

type MessageWithInstance = MessageQueue & {
  instance: Pick<Instance, 'id' | 'instanceName' | 'organizationId' | 'status'>;
};

export class MessageQueueService {
  private readonly prisma: PrismaClient;
  private readonly evolutionClient: EvolutionClient;
  private readonly now: () => Date;

  constructor(deps: QueueServiceDependencies) {
    this.prisma = deps.prisma;
    this.evolutionClient = deps.evolutionClient;
    this.now = deps.now ?? (() => new Date());
  }

  async enqueue(input: EnqueueInput): Promise<MessageQueue> {
    const message = await this.prisma.messageQueue.create({
      data: {
        organizationId: input.organizationId,
        instanceId: input.instanceId,
        recipientPhone: input.recipientPhone,
        messageText: input.messageText,
        scheduledAt: input.scheduledAt ?? this.now(),
        metadata: input.metadata ?? undefined,
      },
    });

    await this.prisma.messageLog.create({
      data: {
        messageQueueId: message.id,
        event: 'queued',
        meta: {
          scheduledAt: message.scheduledAt.toISOString(),
        },
      },
    });

    return message;
  }

  async listMessages(organizationId: string, options: { status?: string; page?: number; limit?: number } = {}) {
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(100, Math.max(1, options.limit ?? 20));
    const skip = (page - 1) * limit;

    const where = {
      organizationId,
      ...(options.status ? { status: options.status } : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.messageQueue.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          instance: true,
        },
      }),
      this.prisma.messageQueue.count({ where }),
    ]);

    return {
      items,
      page,
      limit,
      total,
    };
  }

  async getMessage(organizationId: string, messageId: string) {
    return this.prisma.messageQueue.findFirst({
      where: {
        id: messageId,
        organizationId,
      },
      include: {
        instance: true,
        messageLogs: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });
  }

  async cancelMessage(organizationId: string, messageId: string): Promise<MessageQueue> {
    const message = await this.prisma.messageQueue.findFirst({
      where: {
        id: messageId,
        organizationId,
      },
    });

    if (!message) {
      throw new HttpError(404, 'Message not found');
    }

    if (message.status !== 'pending') {
      throw new HttpError(409, 'Only pending messages can be cancelled');
    }

    const updated = await this.prisma.messageQueue.update({
      where: { id: messageId },
      data: {
        status: 'cancelled',
        errorMessage: 'Cancelled by user',
      },
    });

    await this.prisma.messageLog.create({
      data: {
        messageQueueId: messageId,
        event: 'cancelled',
        meta: {
          cancelledAt: this.now().toISOString(),
        },
      },
    });

    return updated;
  }

  async processPending(options: ProcessPendingOptions = {}) {
    const now = this.now();
    const where = {
      status: 'pending',
      scheduledAt: { lte: now },
      OR: [{ retryUntil: null }, { retryUntil: { lte: now } }],
      ...(options.organizationId ? { organizationId: options.organizationId } : {}),
    };

    const pending = await this.prisma.messageQueue.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
      take: options.limit ?? 50,
      include: {
        instance: true,
      },
    });

    const results: Array<{ messageId: string; status: string; error?: string }> = [];

    for (const message of pending) {
      const outcome = await this.processSingleMessage(message);
      results.push(outcome);
    }

    return {
      processed: pending.length,
      results,
    };
  }

  private async processSingleMessage(message: MessageWithInstance) {
    try {
      if (message.instance.status !== 'connected' && message.instance.status !== 'connecting') {
        throw new HttpError(409, 'Instance is not connected');
      }

      await this.evolutionClient.sendMessage(message.instance.instanceName, {
        number: message.recipientPhone,
        text: message.messageText,
      });

      await this.prisma.messageQueue.update({
        where: { id: message.id },
        data: {
          status: 'sent',
          sentAt: this.now(),
          errorMessage: null,
          retryUntil: null,
        },
      });

      await this.prisma.messageLog.create({
        data: {
          messageQueueId: message.id,
          event: 'sent',
          meta: {
            sentAt: this.now().toISOString(),
          },
        },
      });

      return { messageId: message.id, status: 'sent' };
    } catch (error) {
      if (this.shouldRetry(error)) {
        return this.scheduleRetry(message, error);
      }

      const errorMessage = this.describeError(error);
      await this.prisma.messageQueue.update({
        where: { id: message.id },
        data: {
          status: 'failed',
          errorMessage,
          retryUntil: null,
        },
      });

      await this.prisma.messageLog.create({
        data: {
          messageQueueId: message.id,
          event: 'failed',
          meta: {
            error: errorMessage,
          },
        },
      });

      return { messageId: message.id, status: 'failed', error: errorMessage };
    }
  }

  private async scheduleRetry(message: MessageWithInstance, error: unknown) {
    const nextRetryCount = message.retryCount + 1;

    if (nextRetryCount > 5) {
      const errorMessage = this.describeError(error);
      await this.prisma.messageQueue.update({
        where: { id: message.id },
        data: {
          status: 'failed',
          errorMessage,
          retryUntil: null,
        },
      });

      await this.prisma.messageLog.create({
        data: {
          messageQueueId: message.id,
          event: 'failed',
          meta: {
            error: errorMessage,
            reason: 'max_retries_exceeded',
          },
        },
      });

      return { messageId: message.id, status: 'failed', error: errorMessage };
    }

    const delayMinutes = Math.min(5 * 2 ** (nextRetryCount - 1), 24 * 60);
    const retryUntil = new Date(this.now().getTime() + delayMinutes * 60_000);
    const errorMessage = this.describeError(error);

    await this.prisma.messageQueue.update({
      where: { id: message.id },
      data: {
        retryCount: nextRetryCount,
        retryUntil,
        errorMessage,
      },
    });

    await this.prisma.messageLog.create({
      data: {
        messageQueueId: message.id,
        event: 'retry_scheduled',
        meta: {
          error: errorMessage,
          retryCount: nextRetryCount,
          retryUntil: retryUntil.toISOString(),
        },
      },
    });

    return {
      messageId: message.id,
      status: 'retry_scheduled',
      error: errorMessage,
    };
  }

  private shouldRetry(error: unknown): boolean {
    if (error instanceof HttpError) {
      return false;
    }

    const axiosError = error as AxiosError<{ message?: string }>;
    const status = axiosError?.response?.status;
    const message = String(axiosError?.message ?? '').toLowerCase();

    if (status === 429 || (typeof status === 'number' && status >= 500)) {
      return true;
    }

    if (message.includes('timeout') || message.includes('econnreset') || message.includes('etimedout')) {
      return true;
    }

    return false;
  }

  private describeError(error: unknown): string {
    if (error instanceof HttpError) {
      return error.message;
    }

    const axiosError = error as AxiosError<{ message?: string }>;
    const responseMessage = axiosError?.response?.data?.message;

    if (responseMessage) {
      return responseMessage;
    }

    if (axiosError?.message) {
      return axiosError.message;
    }

    return 'Unknown error';
  }
}
