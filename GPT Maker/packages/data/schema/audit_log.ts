import { pgTable, varchar, text, timestamp, json } from 'drizzle-orm/pg-core';
import { organizations } from './organizations';
import { users } from './users';

export const auditLog = pgTable('audit_log', {
  id: varchar('id', { length: 36 }).primaryKey().default('uuid()'),
  organizationId: varchar('organization_id', { length: 36 })
    .notNull()
    .references(() => organizations.id),
  actorId: varchar('actor_id', { length: 36 })
    .notNull()
    .references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(), // login, create_automation, etc
  resourceId: varchar('resource_id', { length: 100 }), // What changed
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  metadata: json('metadata'), // Request params (NO PII, NO TOKENS)
});

export type AuditLog = typeof auditLog.$inferSelect;
export type NewAuditLog = typeof auditLog.$inferInsert;
