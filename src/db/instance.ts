import { drizzle } from 'drizzle-orm/bun-sql'
import { CONFIG } from '@/config'

export const db = drizzle(CONFIG.database.url)

export type Database = typeof db
