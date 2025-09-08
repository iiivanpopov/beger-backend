import { eq, sql } from 'drizzle-orm'
import type { Database } from '@/db/instance'
import { type InsertUser, tokens, users } from '@/db/tables'

export class UserRepository {
  constructor(private db: Database) {}

  private async one<T>(query: Promise<T[]>): Promise<T | null> {
    const rows = await query
    return rows[0] ?? null
  }

  async existsByUserName(userName: string): Promise<boolean> {
    const [result] = await this.db
      .select({
        exists: sql<boolean>`EXISTS(SELECT 1 FROM users WHERE user_name = ${userName})`
      })
      .from(users)
      .limit(1)

    return !!result?.exists
  }

  async existsById(id: number): Promise<boolean> {
    const [result] = await this.db
      .select({
        exists: sql<boolean>`EXISTS(SELECT 1 FROM users WHERE id = ${id})`
      })
      .from(users)
      .limit(1)

    return !!result?.exists
  }

  findById(id: number) {
    return this.one(
      this.db.select().from(users).where(eq(users.id, id)).limit(1)
    )
  }

  findByUserName(userName: string) {
    return this.one(
      this.db.select().from(users).where(eq(users.userName, userName)).limit(1)
    )
  }

  findByToken(token: string) {
    return this.one(
      this.db
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
        .limit(1)
    )
  }

  create(data: InsertUser) {
    return this.one(this.db.insert(users).values(data).returning())
  }

  deleteById(id: number) {
    return this.one(this.db.delete(users).where(eq(users.id, id)).returning())
  }

  updateById(id: number, data: Partial<InsertUser>) {
    return this.one(
      this.db.update(users).set(data).where(eq(users.id, id)).returning()
    )
  }
}
