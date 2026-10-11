import { z } from 'zod';

export const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  organizationId: z.string(),
  roles: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

export const UserListItemSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  roles: z.array(z.string()),
  createdAt: z.date(),
});

export type UserListItem = z.infer<typeof UserListItemSchema>;
