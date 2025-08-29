import { eq } from 'drizzle-orm'
import type { Database } from '@/db/instance'
import { tokens, type User, users } from '@/db/tables'

export type UserPayload = Omit<User, 'id'>

export class UserRepository {
  constructor(private db: Database) {}

  async isUserExistsByUserName(userName: string): Promise<boolean> {
    const [user] = await this.findUserByUserName(userName)
    return !!user
  }

  async isUserExistsById(id: number): Promise<boolean> {
    const [user] = await this.findUserById(id)
    return !!user
  }

  findUserById(id: number) {
    return this.db.select().from(users).where(eq(users.id, id))
  }

  findUserByUserName(userName: string) {
    return this.db.select().from(users).where(eq(users.userName, userName))
  }

  findUserByToken(token: string) {
    return this.db
      .select()
      .from(users)
      .innerJoin(tokens, eq(tokens.token, token))
  }

  createUser(data: UserPayload) {
    return this.db.insert(users).values(data).returning()
  }

  deleteUserById(id: number) {
    return this.db.delete(users).where(eq(users.id, id)).returning()
  }

  updateUserById(id: number, data: Partial<UserPayload>) {
    return this.db.update(users).set(data).where(eq(users.id, id)).returning()
  }
}
