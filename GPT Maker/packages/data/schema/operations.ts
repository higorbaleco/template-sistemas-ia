import { pgTable, varchar, text, timestamp, json } from 'drizzle-orm/pg-core';
import { organizations } from './organizations';

export const operations = pgTable('operations', {
  id: varchar('id', { length: 36 }).primaryKey().default('uuid()'),
  organizationId: varchar('organization_id', { length: 36 })
    .notNull()
    .references(() => organizations.id),
  status: varchar('status', { length: 50 })
    .notNull()
    .default('PENDING'), // PENDING, PROCESSING, SUCCESS, FAILED
  type: varchar('type', { length: 100 }).notNull(), // automation_run, import_remote, etc
  result: json('result'), // Response payload
  error: json('error'), // Error details
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Operation = typeof operations.$inferSelect;
export type NewOperation = typeof operations.$inferInsert;
