import { BunSQLDatabase, drizzle } from 'drizzle-orm/bun-sql'
import { CONFIG } from '@/config'
import * as relations from './relations'
import * as schema from './tables'

export const db = drizzle(CONFIG.database.url, {
  schema: { ...schema, ...relations }
})

export type Database = BunSQLDatabase<typeof schema & typeof relations>
