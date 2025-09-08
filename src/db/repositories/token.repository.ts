import { eq } from 'drizzle-orm'
import type { Database } from '@/db/instance'
import { type InsertToken, tokens } from '@/db/tables'

export class TokenRepository {
  constructor(private db: Database) {}

  private async one<T>(query: Promise<T[]>): Promise<T | null> {
    const rows = await query
    return rows[0] ?? null
  }

  findById(id: number) {
    return this.one(
      this.db.select().from(tokens).where(eq(tokens.id, id)).limit(1)
    )
  }

  create(data: InsertToken) {
    return this.one(this.db.insert(tokens).values(data).returning())
  }

  deleteById(id: number) {
    return this.one(this.db.delete(tokens).where(eq(tokens.id, id)).returning())
  }

  deleteByUserId(userId: number) {
    return this.one(
      this.db.delete(tokens).where(eq(tokens.userId, userId)).returning()
    )
  }

  deleteByToken(token: string) {
    return this.one(
      this.db.delete(tokens).where(eq(tokens.token, token)).returning()
    )
  }

  updateById(id: number, data: Partial<InsertToken>) {
    return this.one(
      this.db.update(tokens).set(data).where(eq(tokens.id, id)).returning()
    )
  }

  updateByUserId(userId: number, data: Partial<InsertToken>) {
    return this.one(
      this.db
        .update(tokens)
        .set(data)
        .where(eq(tokens.userId, userId))
        .returning()
    )
  }

  upsert(data: InsertToken) {
    return this.one(
      this.db
        .insert(tokens)
        .values(data)
        .onConflictDoUpdate({
          target: tokens.userId,
          set: { token: data.token }
        })
        .returning()
    )
  }
}
