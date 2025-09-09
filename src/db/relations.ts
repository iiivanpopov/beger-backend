import { relations } from 'drizzle-orm'
import { repairs, testResults, tokens, users } from '@/db/tables'

export const tokensRelations = relations(tokens, ({ one }) => ({
  user: one(users, {
    fields: [tokens.userId],
    references: [users.id]
  })
}))

export const repairsRelations = relations(repairs, ({ one }) => ({
  user: one(users, {
    fields: [repairs.userId],
    references: [users.id]
  })
}))

export const testResultsRelations = relations(testResults, ({ one }) => ({
  user: one(users, {
    fields: [testResults.userId],
    references: [users.id]
  })
}))

export const usersRelations = relations(users, ({ one, many }) => ({
  token: one(tokens),
  repairs: many(repairs),
  textResults: many(testResults)
}))
