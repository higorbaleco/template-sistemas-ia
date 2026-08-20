import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { getPrisma } from '../db';

interface AuthMiddlewareOptions {
  prisma?: ReturnType<typeof getPrisma>;
}

export function createAuthMiddleware(options: AuthMiddlewareOptions = {}): RequestHandler {
  const prisma = options.prisma ?? getPrisma();

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const header = req.header('authorization');
      const [scheme, token] = header?.split(' ') ?? [];

      if (scheme !== 'Bearer' || !token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const organization = await prisma.organization.findUnique({
        where: { apiKey: token },
      });

      if (!organization || organization.isActive === false) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      req.organizationId = organization.id;
      next();
    } catch (error) {
      next(error);
    }
  };
}
