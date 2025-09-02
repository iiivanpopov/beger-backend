import { eq } from 'drizzle-orm'
import type { Database } from '@/db/instance'
import { type InsertRepair, repairs } from '@/db/tables'

export class RepairRepository {
  constructor(private db: Database) {}

  findRepairById(id: number) {
    return this.db.select().from(repairs).where(eq(repairs.id, id))
  }

  findRepairsByUserId(userId: number) {
    return this.db.select().from(repairs).where(eq(repairs.userId, userId))
  }

  createRepair(data: InsertRepair) {
    return this.db.insert(repairs).values(data).returning()
  }

  deleteRepairById(id: number) {
    return this.db.delete(repairs).where(eq(repairs.id, id)).returning()
  }

  updateRepairById(id: number, data: Partial<InsertRepair>) {
    return this.db
      .update(repairs)
      .set(data)
      .where(eq(repairs.id, id))
      .returning()
  }
}
