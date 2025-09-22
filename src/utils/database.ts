export const one = async <T>(query: Promise<T[]>): Promise<T | null> => {
  const rows = await query

  return rows[0] ?? null
}
