import { Router } from 'express';
import type { PrismaClient } from '@prisma/client';
import { HttpError } from '../../utils/http-error';
import { slugify } from '../../utils/slug';
import { EvolutionClient } from '../../services/evolution';

export interface InstancesRoutesDependencies {
  prisma: PrismaClient;
  evolutionClient: EvolutionClient;
}

function buildInstanceName(name: string) {
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${slugify(name)}-${suffix}`;
}

export function createInstancesRouter({ prisma, evolutionClient }: InstancesRoutesDependencies) {
  const router = Router();

  router.get('/', async (req, res, next) => {
    try {
      const organizationId = req.organizationId;
      if (!organizationId) {
        throw new HttpError(401, 'Unauthorized');
      }

      const instances = await prisma.instance.findMany({
        where: { organizationId },
        orderBy: { createdAt: 'desc' },
      });

      res.json({ items: instances });
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      const organizationId = req.organizationId;
      if (!organizationId) {
        throw new HttpError(401, 'Unauthorized');
      }

      const body = req.body ?? {};
      const name = String(body.name ?? '').trim();
      if (!name) {
        throw new HttpError(400, 'name is required');
      }

      const instanceName = String(body.instanceName ?? body.instance_name ?? '').trim() || buildInstanceName(name);
      const evolutionApiToken = String(body.evolutionApiToken ?? body.evolution_api_token ?? process.env.EVOLUTION_API_KEY ?? '').trim();

      if (!evolutionApiToken) {
        throw new HttpError(400, 'evolutionApiToken is required');
      }

      const created = await prisma.instance.create({
        data: {
          organizationId,
          name,
          instanceName,
          evolutionApiToken,
          phoneNumber: body.phoneNumber ?? body.phone_number ?? null,
          status: 'connecting',
        },
      });

      try {
        const qr = await evolutionClient.connectInstance(instanceName);

        const updated = await prisma.instance.update({
          where: { id: created.id },
          data: {
            qrCodeUrl: qr.base64,
            status: 'connecting',
          },
        });

        res.status(201).json({
          id: updated.id,
          name: updated.name,
          instance_name: updated.instanceName,
          status: updated.status,
          qr_code_url: updated.qrCodeUrl,
        });
      } catch (error) {
        await prisma.instance.update({
          where: { id: created.id },
          data: { status: 'error' },
        });
        throw error;
      }
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id/qr', async (req, res, next) => {
    try {
      const organizationId = req.organizationId;
      if (!organizationId) {
        throw new HttpError(401, 'Unauthorized');
      }

      const instance = await prisma.instance.findFirst({
        where: {
          id: req.params.id,
          organizationId,
        },
      });

      if (!instance) {
        throw new HttpError(404, 'Instance not found');
      }

      res.json({
        id: instance.id,
        instance_name: instance.instanceName,
        qr_code_url: instance.qrCodeUrl,
        status: instance.status,
      });
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

      const instance = await prisma.instance.findFirst({
        where: {
          id: req.params.id,
          organizationId,
        },
      });

      if (!instance) {
        throw new HttpError(404, 'Instance not found');
      }

      await evolutionClient.logoutInstance(instance.instanceName);

      const updated = await prisma.instance.update({
        where: { id: instance.id },
        data: { status: 'disconnected' },
      });

      res.json({
        id: updated.id,
        status: updated.status,
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
