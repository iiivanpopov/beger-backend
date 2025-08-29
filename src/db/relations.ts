import { relations } from 'drizzle-orm'
import { tokens, users } from '@/db/tables'

export const tokensRelations = relations(tokens, ({ one }) => ({
  user: one(users, {
    fields: [tokens.userId],
    references: [users.id]
  })
}))

export const usersRelations = relations(users, ({ one }) => ({
  token: one(tokens)
}))
