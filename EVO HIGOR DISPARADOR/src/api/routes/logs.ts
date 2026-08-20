import { Router } from 'express';
import type { PrismaClient } from '@prisma/client';
import { HttpError } from '../../utils/http-error';

export interface LogsRoutesDependencies {
  prisma: PrismaClient;
}

export function createLogsRouter({ prisma }: LogsRoutesDependencies) {
  const router = Router();

  router.get('/', async (req, res, next) => {
    try {
      const organizationId = req.organizationId;
      if (!organizationId) {
        throw new HttpError(401, 'Unauthorized');
      }

      const [messageLogs, webhookLogs] = await prisma.$transaction([
        prisma.messageLog.findMany({
          where: {
            messageQueue: {
              organizationId,
            },
          },
          orderBy: { timestamp: 'desc' },
          take: 100,
          include: {
            messageQueue: true,
          },
        }),
        prisma.webhookLog.findMany({
          where: { organizationId },
          orderBy: { receivedAt: 'desc' },
          take: 100,
        }),
      ]);

      res.json({
        messageLogs,
        webhookLogs,
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
