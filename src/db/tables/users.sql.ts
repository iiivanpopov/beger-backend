import { integer, pgEnum, pgTable, text, varchar } from 'drizzle-orm/pg-core'

export const rolesEnum = pgEnum('roles', ['user', 'admin'])

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  fullName: varchar('full_name', { length: 50 }).notNull(),
  userName: varchar('user_name', { length: 20 }).unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  role: rolesEnum().default('user').notNull()
})

export type User = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert
export type UserRole = (typeof rolesEnum.enumValues)[number]
