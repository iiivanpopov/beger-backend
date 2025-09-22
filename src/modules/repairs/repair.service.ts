import { desc, eq } from 'drizzle-orm'
import { db, type InsertRepair, repairsTable } from '@/database'

export const getLastRepairs = async (userId: number) =>
  db
    .select()
    .from(repairsTable)
    .where(eq(repairsTable.userId, userId))
    .limit(10)
    .orderBy(desc(repairsTable.createdAt))

export const createRepair = async (
  userId: number,
  payload: Omit<InsertRepair, 'createdAt' | 'userId'>
) =>
  db
    .insert(repairsTable)
    .values({
      userId,
      defect: payload.defect,
      pcbName: payload.pcbName,
      note: payload.note,
      date: payload.date
    })
    .returning()

export const deleteRepair = async (repairId: number) =>
  db.delete(repairsTable).where(eq(repairsTable.id, repairId))
