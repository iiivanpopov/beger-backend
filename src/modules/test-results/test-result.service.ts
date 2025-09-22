import { desc, eq } from 'drizzle-orm'
import { db, type InsertTestResult, testResultsTable } from '@/database'

export const getLastTestResults = async (userId: number) =>
  db
    .select()
    .from(testResultsTable)
    .where(eq(testResultsTable.userId, userId))
    .limit(10)
    .orderBy(desc(testResultsTable.createdAt))

export const createTestResult = async (
  userId: number,
  payload: Omit<InsertTestResult, 'createdAt' | 'userId'>
) =>
  db
    .insert(testResultsTable)
    .values({
      userId,
      pcbName: payload.pcbName,
      passedFirstTry: payload.failed,
      failed: payload.failed,
      total: payload.total,
      date: payload.date
    })
    .returning()

export const deleteTestResult = async (testResultId: number) =>
  db.delete(testResultsTable).where(eq(testResultsTable.id, testResultId))
