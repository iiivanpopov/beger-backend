import { and, desc, eq } from 'drizzle-orm'
import type { Database } from '@/db/instance'
import { type InsertTestResult, testResults } from '@/db/tables'
import { one } from '@/utils'

export class TestResultRepository {
  constructor(private db: Database) {}

  findById(id: number) {
    return one(
      this.db.select().from(testResults).where(eq(testResults.id, id)).limit(1)
    )
  }

  findByUserId(userId: number, opts?: { limit?: number; latest?: boolean }) {
    return this.db
      .select()
      .from(testResults)
      .where(eq(testResults.userId, userId))
      .orderBy(opts?.latest ? desc(testResults.createdAt) : testResults.id)
      .limit(opts?.limit ?? 100)
  }

  create(data: InsertTestResult) {
    return one(this.db.insert(testResults).values(data).returning())
  }

  update(id: number, data: Partial<InsertTestResult>) {
    return one(
      this.db
        .update(testResults)
        .set(data)
        .where(eq(testResults.id, id))
        .returning()
    )
  }

  delete(id: number, userId?: number) {
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
