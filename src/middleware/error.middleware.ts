import type { Context } from 'hono'
import { ApiError } from '@/exceptions'
import { log } from '@/utils'

export function errorMiddleware(error: unknown, c: Context) {
  if (error && typeof error === 'object' && 'status' in error && error.status === 401)
    return c.json(ApiError.Unauthorized().toJSON(), 401)
  if (error instanceof ApiError)
    return c.json(error.toJSON(), error.status)

  log.error(error)

  return c.json(ApiError.InternalServerError().toJSON(), 500)
}
