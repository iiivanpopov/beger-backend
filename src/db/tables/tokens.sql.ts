import { integer, pgTable, text } from 'drizzle-orm/pg-core'
import { users } from './users.sql'

export const tokens = pgTable('tokens', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  token: text('token').notNull(),
  userId: integer('user_id')
    .unique()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
})

export type Token = typeof tokens.$inferSelect
export type InsertToken = typeof tokens.$inferInsert
