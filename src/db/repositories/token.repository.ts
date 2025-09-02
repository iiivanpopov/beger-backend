import { eq } from 'drizzle-orm'
import type { Database } from '@/db/instance'
import { type InsertToken, tokens } from '@/db/tables'

export class TokenRepository {
  constructor(private db: Database) {}

  findTokenById(id: number) {
    return this.db.select().from(tokens).where(eq(tokens.id, id))
  }

  createToken(data: InsertToken) {
    return this.db.insert(tokens).values(data).returning()
  }

  deleteTokenById(id: number) {
    return this.db.delete(tokens).where(eq(tokens.id, id)).returning()
  }

  deleteTokenByUserId(id: number) {
    return this.db.delete(tokens).where(eq(tokens.userId, id)).returning()
  }

  deleteTokenByToken(token: string) {
    return this.db.delete(tokens).where(eq(tokens.token, token)).returning()
  }

  updateTokenById(id: number, data: Partial<InsertToken>) {
    return this.db.update(tokens).set(data).where(eq(tokens.id, id)).returning()
  }

  updateTokenByUserId(userId: number, data: Partial<InsertToken>) {
    return this.db
      .update(tokens)
      .set(data)
      .where(eq(tokens.userId, userId))
      .returning()
  }

  upsertToken(data: InsertToken) {
    return this.db
      .insert(tokens)
      .values(data)
      .onConflictDoUpdate({
        target: tokens.userId,
        set: {
          token: data.token
        }
      })
      .returning()
  }
}
