import * as v from 'valibot'

export const EnvSchema = v.object({
  NODE_ENV: v.optional(
    v.picklist(['development', 'production', 'test'] as const),
    'development'
  ),
  PORT: v.pipe(
    v.string('PORT must be a string'),
    v.transform(value => Number(value)),
    v.number('PORT must be a number'),
    v.minValue(1, 'PORT must be >= 1')
  ),
  DATABASE_URL: v.string('DATABASE_URL is required'),
  JWT_ACCESS_SECRET: v.string('JWT_ACCESS_SECRET is required'),
  JWT_REFRESH_SECRET: v.string('JWT_REFRESH_SECRET is required'),
  SHEET_URL: v.string('SHEET_URL is required'),
  MEMCACHED_URL: v.string('MEMCACHED_URL is required'),
  ADMIN_PASSWORD: v.string('ADMIN_PASSWORD is required')
})
