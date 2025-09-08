import { and, desc, eq } from 'drizzle-orm'
import type { Database } from '@/db/instance'
import { type InsertRepair, repairs } from '@/db/tables'

export class RepairRepository {
  constructor(private db: Database) {}

  async findById(id: number) {
    const result = await this.db
      .select()
      .from(repairs)
      .where(eq(repairs.id, id))
      .limit(1)

    return result[0] ?? null
  }

  async findByUserId(
    userId: number,
    opts?: { limit?: number; latest?: boolean }
  ) {
    return this.db
      .select()
      .from(repairs)
      .where(eq(repairs.userId, userId))
      .orderBy(opts?.latest ? desc(repairs.createdAt) : repairs.id)
      .limit(opts?.limit ?? 100)
  }

  async create(data: InsertRepair) {
    const result = await this.db.insert(repairs).values(data).returning()

    return result[0]
  }

  async update(id: number, data: Partial<InsertRepair>) {
    const result = await this.db
      .update(repairs)
      .set(data)
      .where(eq(repairs.id, id))
      .returning()

    return result[0] ?? null
  }

  async delete(id: number, userId?: number) {
    const conditions = [eq(repairs.id, id)]
    if (userId !== undefined) {
      conditions.push(eq(repairs.userId, userId))
    }

    const result = await this.db
      .delete(repairs)
      .where(and(...conditions))
      .returning()

    return result[0] ?? null
  }
}
