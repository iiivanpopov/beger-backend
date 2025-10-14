import type { Context } from 'hono'
import { ApiError } from '@/exceptions'
import { isUnauthorizedError, log } from '@/utils'

export function errorMiddleware(error: unknown, c: Context) {
  if (isUnauthorizedError(error)) {
    return c.json(ApiError.Unauthorized(error.message).toJSON(), 401)
  }
  if (error instanceof ApiError)
    return c.json(error.toJSON(), error.status)

  log.error(error)

  return c.json(ApiError.InternalServerError().toJSON(), 500)
}
