import { Router } from 'express';
import type { PrismaClient } from '@prisma/client';
import { HttpError } from '../../utils/http-error';
import { MessageQueueService } from '../../services/queue';

export interface MessagesRoutesDependencies {
  prisma: PrismaClient;
  queueService: MessageQueueService;
}

function parsePositiveInt(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function createMessagesRouter({ prisma, queueService }: MessagesRoutesDependencies) {
  const router = Router();

  router.post('/', async (req, res, next) => {
    try {
      const organizationId = req.organizationId;
      if (!organizationId) {
        throw new HttpError(401, 'Unauthorized');
      }

      const body = req.body ?? {};
      const instanceName = String(body.instanceName ?? body.instance_name ?? '').trim();
      const recipientPhone = String(body.recipientPhone ?? body.recipient_phone ?? '').trim();
      const messageText = String(body.messageText ?? body.message_text ?? '').trim();

      if (!instanceName || !recipientPhone || !messageText) {
        throw new HttpError(400, 'instanceName, recipientPhone and messageText are required');
      }

      const instance = await prisma.instance.findFirst({
        where: {
          organizationId,
          OR: [
            { instanceName },
            { name: instanceName },
          ],
        },
      });

      if (!instance) {
        throw new HttpError(404, 'Instance not found');
      }

      const scheduledAt = body.scheduledAt ?? body.scheduled_at;
      const parsedScheduledAt = scheduledAt ? new Date(scheduledAt) : undefined;

      if (parsedScheduledAt && Number.isNaN(parsedScheduledAt.getTime())) {
        throw new HttpError(400, 'scheduledAt must be a valid date');
      }

      const message = await queueService.enqueue({
        organizationId,
        instanceId: instance.id,
        recipientPhone,
        messageText,
        scheduledAt: parsedScheduledAt,
        metadata: body.metadata,
      });

      res.status(201).json({
        id: message.id,
        status: message.status,
        scheduled_at: message.scheduledAt,
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/', async (req, res, next) => {
    try {
      const organizationId = req.organizationId;
      if (!organizationId) {
        throw new HttpError(401, 'Unauthorized');
      }

      const status = req.query.status ? String(req.query.status) : undefined;
      const page = parsePositiveInt(req.query.page, 1);
      const limit = parsePositiveInt(req.query.limit, 20);

      const result = await queueService.listMessages(organizationId, {
        status,
        page,
        limit,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const organizationId = req.organizationId;
      if (!organizationId) {
        throw new HttpError(401, 'Unauthorized');
      }

      const message = await queueService.getMessage(organizationId, req.params.id);
      if (!message) {
        throw new HttpError(404, 'Message not found');
      }

      res.json(message);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      const organizationId = req.organizationId;
      if (!organizationId) {
        throw new HttpError(401, 'Unauthorized');
      }

      const message = await queueService.cancelMessage(organizationId, req.params.id);
      res.json({
        id: message.id,
        status: message.status,
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
