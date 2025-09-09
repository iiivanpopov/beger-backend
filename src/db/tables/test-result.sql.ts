import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'
import { users } from './users.sql'

export const testResults = pgTable('test_result', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  pcbName: varchar('pcb_name', { length: 255 }).notNull(),
  passedFirstTry: integer('passed_first_try').notNull(),
  failed: integer().notNull(),
  total: integer().notNull(),
  date: timestamp({ withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'set null'
    })
})

export type TestResult = typeof testResults.$inferSelect
export type InsertTestResult = typeof testResults.$inferInsert
