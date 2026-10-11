import { AuthService } from '../AuthService';

export function withAuth(handler: Function) {
  return async (req: any) => {
    const token = extractToken(req);

    if (!token) {
      return {
        status: 401,
        body: { error: 'Unauthorized' },
      };
    }

    const payload = AuthService.verifyToken(token);
    if (!payload) {
      return {
        status: 401,
        body: { error: 'Invalid token' },
      };
    }

    // Attach to request
    req.user = payload;
    return handler(req);
  };
}

function extractToken(req: any): string | null {
  const authHeader = req.headers?.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}
