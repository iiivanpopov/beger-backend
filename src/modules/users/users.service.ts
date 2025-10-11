import type { InsertUser } from '@/database/tables'
import { and, desc, eq, not } from 'drizzle-orm'
import { db, toUserDTO, usersTable } from '@/database'
import { ApiError } from '@/exceptions'

export async function getUser(userId: number) {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId))
  if (!user)
    throw ApiError.NotFound()

  return toUserDTO(user)
}

export async function getAllUsers({ offset = 0, limit = 10 }) {
  const users = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.role, 'user'))
    .limit(limit)
    .offset(offset)
    .orderBy(desc(usersTable.createdAt))

  return users.map(user => toUserDTO(user))
}

export async function updateUser(userId: number, payload: Partial<InsertUser>) {
  const [userExists] = await db.select().from(usersTable).where(eq(usersTable.id, userId))
  if (!userExists)
    throw ApiError.NotFound()

  const [user] = await db
    .update(usersTable)
    .set(payload)
    .where(eq(usersTable.id, userId))
    .returning()
  if (!user)
    throw ApiError.InternalServerError()

  return toUserDTO(user)
}

export async function deleteUser(userId: number) {
  const [userExists] = await db.select().from(usersTable).where(eq(usersTable.id, userId))
  if (!userExists)
    throw ApiError.NotFound()

  await db
    .delete(usersTable)
    .where(and(eq(usersTable.id, userId), not(eq(usersTable.role, 'admin'))))
}
