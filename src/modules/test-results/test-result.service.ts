import { and, desc, eq, gte, sql } from 'drizzle-orm';
import type { InsertTestResult } from '@/database';
import { db, testResultsTable } from '@/database';
import { ApiError } from '@/exceptions';

export const getUserTestResults = async (userId: number) =>
  await db
    .select()
    .from(testResultsTable)
    .where(
      and(
        eq(testResultsTable.userId, userId),
        gte(testResultsTable.createdAt, sql`NOW() - interval '1 day'`)
      )
    )
    .limit(10)
    .orderBy(desc(testResultsTable.createdAt));

export const getTestResults = async ({ offset = 0, limit = 10 }) =>
  await db
    .select()
    .from(testResultsTable)
    .limit(limit)
    .offset(offset)
    .orderBy(desc(testResultsTable.createdAt));

export const createTestResult = async (
  userId: number,
  payload: Omit<InsertTestResult, 'createdAt' | 'userId'>
) => {
  const [testResult] = await db
    .insert(testResultsTable)
    .values({
      userId,
      pcbName: payload.pcbName,
      passedFirstTry: payload.passedFirstTry,
      failed: payload.failed,
      total: payload.total,
      date: payload.date,
    })
    .returning();
  if (!testResult) throw ApiError.InternalServerError();

  return testResult;
};

export const deleteSafeTestResult = async (userId: number, testResultId: number) => {
  const [testResult] = await db
    .select()
    .from(testResultsTable)
    .where(
      and(
        eq(testResultsTable.id, testResultId),
        eq(testResultsTable.userId, userId),
        gte(testResultsTable.createdAt, sql`NOW() - interval '1 day'`)
      )
    );
  if (!testResult) throw ApiError.NotFound();

  await db
    .delete(testResultsTable)
    .where(
      and(
        eq(testResultsTable.id, testResultId),
        eq(testResultsTable.userId, userId),
        gte(testResultsTable.createdAt, sql`NOW() - interval '1 day'`)
      )
    );
};

export const deleteTestResult = async (testResultId: number) =>
  await db.delete(testResultsTable).where(eq(testResultsTable.id, testResultId));
