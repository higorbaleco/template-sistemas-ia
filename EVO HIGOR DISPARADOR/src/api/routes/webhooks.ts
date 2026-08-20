import { Router } from 'express';
import type { PrismaClient } from '@prisma/client';
import { HttpError } from '../../utils/http-error';

export interface WebhooksRoutesDependencies {
  prisma: PrismaClient;
  webhookSecret: string;
}

export function createWebhooksRouter({ prisma, webhookSecret }: WebhooksRoutesDependencies) {
  const router = Router();

  router.post('/evolution', async (req, res, next) => {
    try {
      const headerSecret = req.header('x-api-key') ?? req.header('x-webhook-secret');
      if (headerSecret !== webhookSecret) {
        throw new HttpError(401, 'Unauthorized');
      }

      const eventType = String(req.body?.event ?? req.body?.eventType ?? 'unknown');
      const instanceName = String(req.body?.data?.instanceName ?? req.body?.instanceName ?? '').trim();
      if (!instanceName) {
        throw new HttpError(400, 'instanceName is required');
      }

      const instance = await prisma.instance.findUnique({
        where: { instanceName },
      });

      if (!instance) {
        throw new HttpError(404, 'Instance not found');
      }

      await prisma.webhookLog.create({
        data: {
          organizationId: instance.organizationId,
          instanceId: instance.id,
          eventType,
          payload: req.body,
        },
      });

      res.status(202).json({ ok: true });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
