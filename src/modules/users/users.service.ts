import { and, eq, not } from 'drizzle-orm'
import { db, toUserDTO, usersTable } from '@/database'
import { ApiError } from '@/exceptions'

export const getUser = async (userId: number) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId))
  if (!user) throw ApiError.NotFound()

  return toUserDTO(user)
}

export const deleteUser = async (userId: number) => {
  const [userExists] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, Number(userId)))
  if (!userExists) throw ApiError.NotFound()

  await db
    .delete(usersTable)
    .where(and(eq(usersTable.id, userId), not(eq(usersTable.role, 'admin'))))
}
