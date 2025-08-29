import { integer, pgTable, text } from 'drizzle-orm/pg-core'

export const tokens = pgTable('tokens', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  token: text('token').notNull(),
  userId: integer('user_id').unique().notNull()
})
export type Token = typeof tokens.$inferSelect
