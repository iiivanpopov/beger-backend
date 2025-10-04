import { and, desc, eq, gte, sql } from 'drizzle-orm';
import type { InsertRepair } from '@/database';
import { db, repairsTable } from '@/database';
import { ApiError } from '@/exceptions';

export const getUserRepairs = async (userId: number) => {
  const repairs = await db
    .select()
    .from(repairsTable)
    .where(
      and(
        eq(repairsTable.userId, userId),
        gte(repairsTable.createdAt, sql`NOW() - interval '1 day'`)
      )
    )
    .limit(10)
    .orderBy(desc(repairsTable.createdAt));

  return repairs;
};

export const getRepairs = async ({ offset = 0, limit = 10 }) =>
  await db
    .select()
    .from(repairsTable)
    .limit(limit)
    .offset(offset)
    .orderBy(desc(repairsTable.createdAt));

export const createRepair = async (
  userId: number,
  payload: Omit<InsertRepair, 'createdAt' | 'userId'>
) => {
  const [repair] = await db
    .insert(repairsTable)
    .values({
      userId,
      defect: payload.defect,
      pcbName: payload.pcbName,
      note: payload.note,
      date: payload.date,
    })
    .returning();
  if (!repair) throw new ApiError.InternalServerError();

  return repair;
};

export const deleteSafeRepair = async (userId: number, testResultId: number) => {
  const [testResult] = await db
    .select()
    .from(repairsTable)
    .where(
      and(
        eq(repairsTable.id, testResultId),
        eq(repairsTable.userId, userId),
        gte(repairsTable.createdAt, sql`NOW() - interval '1 day'`)
      )
    );
  if (!testResult) throw ApiError.NotFound();

  await db
    .delete(repairsTable)
    .where(
      and(
        eq(repairsTable.id, testResultId),
        eq(repairsTable.userId, userId),
        gte(repairsTable.createdAt, sql`NOW() - interval '1 day'`)
      )
    );
};

export const deleteRepair = async (repairId: number) =>
  await db.delete(repairsTable).where(eq(repairsTable.id, repairId));
