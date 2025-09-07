import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'
import { users } from './users.sql'

export const repairs = pgTable('repairs', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  pcbName: varchar('pcb_name', { length: 255 }).notNull(),
  defect: varchar({ length: 255 }).notNull(),
  note: varchar({ length: 255 }),
  date: timestamp({ withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'set null'
    })
})

export type Repair = typeof repairs.$inferSelect
export type InsertRepair = typeof repairs.$inferInsert
