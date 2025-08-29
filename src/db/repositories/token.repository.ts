import { eq } from 'drizzle-orm'
import type { Database } from '@/db/instance'
import { type Token, tokens } from '@/db/tables'

export type TokenPayload = Omit<Token, 'id'>

export class TokenRepository {
  constructor(private db: Database) {}

  findTokenById(id: number) {
    return this.db.select().from(tokens).where(eq(tokens.id, id))
  }

  createToken(data: TokenPayload) {
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

  updateTokenById(id: number, data: Partial<TokenPayload>) {
    return this.db.update(tokens).set(data).where(eq(tokens.id, id)).returning()
  }

  updateTokenByUserId(userId: number, data: Partial<TokenPayload>) {
    return this.db
      .update(tokens)
      .set(data)
      .where(eq(tokens.userId, userId))
      .returning()
  }

  upsertToken(data: TokenPayload) {
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
