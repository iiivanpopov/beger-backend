import { and, desc, eq } from 'drizzle-orm'
import type { Database } from '@/db/instance'
import { type InsertRepair, repairs } from '@/db/tables'
import { one } from '@/utils'

export class RepairRepository {
  constructor(private db: Database) {}

  async findById(id: number) {
    return one(
      this.db.select().from(repairs).where(eq(repairs.id, id)).limit(1)
    )
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
    return one(this.db.insert(repairs).values(data).returning())
  }

  async update(id: number, data: Partial<InsertRepair>) {
    return one(
      this.db.update(repairs).set(data).where(eq(repairs.id, id)).returning()
    )
  }

  async delete(id: number, userId?: number) {
    const conditions = [eq(repairs.id, id)]
    if (userId !== undefined) {
      conditions.push(eq(repairs.userId, userId))
    }

    return one(
      this.db
        .delete(repairs)
        .where(and(...conditions))
        .returning()
    )
  }
}
