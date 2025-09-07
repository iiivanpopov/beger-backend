import { eq, sql } from 'drizzle-orm'
import type { Database } from '@/db/instance'
import { type InsertUser, tokens, users } from '@/db/tables'

export class UserRepository {
  constructor(private db: Database) {}

  async isUserExistsByUserName(userName: string): Promise<boolean> {
    const [result] = await this.db
      .select({
        exists: sql<boolean>`EXISTS(SELECT 1 FROM users WHERE user_name = ${userName})`
      })
      .from(users)
      .limit(1)

    return !!result?.exists
  }

  async isUserExistsById(id: number): Promise<boolean> {
    const [result] = await this.db
      .select({
        exists: sql<boolean>`EXISTS(SELECT 1 FROM users WHERE id = ${id})`
      })
      .from(users)
      .limit(1)

    return !!result?.exists
  }

  async findUserById(id: number) {
    const [user] = await this.db.select().from(users).where(eq(users.id, id))
    return user || null
  }

  async findUserByUserName(userName: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.userName, userName))
    return user || null
  }

  async findUserByToken(token: string) {
    const result = await this.db
      .select({
        id: users.id,
        fullName: users.fullName,
        userName: users.userName,
        passwordHash: users.passwordHash,
        role: users.role,
        tokenId: tokens.id
      })
      .from(users)
      .innerJoin(tokens, eq(tokens.userId, users.id))
      .where(eq(tokens.token, token))

    return result[0] || null
  }

  async createUser(data: InsertUser) {
    const [user] = await this.db.insert(users).values(data).returning()
    return user
  }

  async deleteUserById(id: number) {
    const [user] = await this.db
      .delete(users)
      .where(eq(users.id, id))
      .returning()
    return user || null
  }

  async updateUserById(id: number, data: Partial<InsertUser>) {
    const [user] = await this.db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning()
    return user || null
  }
}
