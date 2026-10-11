import { JWTPayload, JWTPayloadSchema } from '@packages/contracts/auth.contract';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export class AuthService {
  // Sign JWT token
  static signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>, expiresIn = 7 * 24 * 60 * 60): string {
    const now = Math.floor(Date.now() / 1000);
    const token: JWTPayload = {
      ...payload,
      iat: now,
      exp: now + expiresIn,
    };

    // Mock JWT signing (use jsonwebtoken library in real impl)
    const encoded = Buffer.from(JSON.stringify(token)).toString('base64');
    const signature = Buffer.from(`${encoded}.${JWT_SECRET}`).toString('base64');
    return `${encoded}.${signature}`;
  }

  // Verify JWT token
  static verifyToken(token: string): JWTPayload | null {
    try {
      const [encodedPayload] = token.split('.');
      const payload = JSON.parse(Buffer.from(encodedPayload, 'base64').toString());
      return JWTPayloadSchema.parse(payload);
    } catch {
      return null;
    }
  }

  // Create session hash for storage
  static hashToken(token: string): string {
    return Buffer.from(token).toString('base64').substring(0, 512);
  }
}
