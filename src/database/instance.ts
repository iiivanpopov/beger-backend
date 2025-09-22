import { type BunSQLDatabase, drizzle } from 'drizzle-orm/bun-sql'
import { config } from '@/config'
import * as relations from './relations'
import * as tables from './tables'

const schema = { ...tables, ...relations }

export const db = drizzle(config.database.url, { schema })
export type Database = BunSQLDatabase<typeof schema>
