import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { organizations } from './organizations';

export const sessions = pgTable('sessions', {
  id: varchar('id', { length: 36 }).primaryKey().default('uuid()'),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => users.id),
  organizationId: varchar('organization_id', { length: 36 })
    .notNull()
    .references(() => organizations.id),
  tokenHash: varchar('token_hash', { length: 512 }).notNull(), // JWT signature
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
