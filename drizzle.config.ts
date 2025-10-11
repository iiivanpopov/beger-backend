import { defineConfig } from 'drizzle-kit'
import { config } from '@/config'

export default defineConfig({
  out: './drizzle',
  schema: ['./src/database/tables/*.sql.ts', './src/database/relations.ts'],
  dialect: 'postgresql',
  dbCredentials: {
    url: config.database.url,
  },
})
