import { z } from 'zod';

export const OrganizationSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Organization = z.infer<typeof OrganizationSchema>;

export const OrganizationListSchema = z.array(OrganizationSchema);

export type OrganizationList = z.infer<typeof OrganizationListSchema>;

export const CreateOrganizationSchema = z.object({
  slug: z.string().min(3).max(100),
  name: z.string().min(1).max(255),
});

export type CreateOrganization = z.infer<typeof CreateOrganizationSchema>;
