import { z } from 'zod';

export const OAuthCallbackResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  expiresIn: z.number(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
  }),
  organizations: z.array(
    z.object({
      id: z.string(),
      slug: z.string(),
      name: z.string(),
    })
  ),
});

export type OAuthCallbackResponse = z.infer<typeof OAuthCallbackResponseSchema>;

export const JWTPayloadSchema = z.object({
  sub: z.string(), // user_id
  email: z.string(),
  org_id: z.string(), // organization_id
  roles: z.array(z.string()),
  iat: z.number(),
  exp: z.number(),
});

export type JWTPayload = z.infer<typeof JWTPayloadSchema>;

export const LoginRequestSchema = z.object({
  code: z.string(), // OAuth code
  state: z.string(), // OAuth state
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LogoutRequestSchema = z.object({
  token: z.string().optional(),
});

export type LogoutRequest = z.infer<typeof LogoutRequestSchema>;
