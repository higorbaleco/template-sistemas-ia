import { pgTable, text, varchar, timestamp } from 'drizzle-orm/pg-core';

export const organizations = pgTable('organizations', {
  id: varchar('id', { length: 36 }).primaryKey().default('uuid()'),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  createdBy: varchar('created_by', { length: 36 }).notNull(),
  organizationId: varchar('organization_id', { length: 36 }).notNull(), // Self-ref for RLS
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
