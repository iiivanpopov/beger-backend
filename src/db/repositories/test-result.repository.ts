import { and, desc, eq } from 'drizzle-orm'
import type { Database } from '@/db/instance'
import { type InsertTestResult, testResults } from '@/db/tables'
import { one } from '@/utils'

export class TestResultRepository {
  constructor(private db: Database) {}

  async findById(id: number) {
    return one(
      this.db.select().from(testResults).where(eq(testResults.id, id)).limit(1)
    )
  }

  async findByUserId(
    userId: number,
    opts?: { limit?: number; latest?: boolean }
  ) {
    return this.db
      .select()
      .from(testResults)
      .where(eq(testResults.userId, userId))
      .orderBy(opts?.latest ? desc(testResults.createdAt) : testResults.id)
      .limit(opts?.limit ?? 100)
  }

  async create(data: InsertTestResult) {
    return one(this.db.insert(testResults).values(data).returning())
  }

  async update(id: number, data: Partial<InsertTestResult>) {
    return one(
      this.db
        .update(testResults)
        .set(data)
        .where(eq(testResults.id, id))
        .returning()
    )
  }

  async delete(id: number, userId?: number) {
    const conditions = [eq(testResults.id, id)]
    if (userId !== undefined) {
      conditions.push(eq(testResults.userId, userId))
    }

    return one(
      this.db
        .delete(testResults)
        .where(and(...conditions))
        .returning()
    )
  }
}
