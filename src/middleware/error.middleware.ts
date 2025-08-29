import type { Context } from 'hono'
import { ValiError } from 'valibot'
import { ApiError } from '@/exceptions'
import { log } from '@/utils'

export const error = (err: unknown, c: Context) => {
  if (err instanceof ValiError) {
    return c.json(
      {
        success: false,
        message: 'Body Validation Error',
        details: err.issues.map(i => ({
          field: i.path.map((f: { key: string }) => f.key).join('.'),
          message: i.message,
          value: i.input
        }))
      },
      400
    )
  }

  if (err instanceof ApiError) {
    return c.json(err.toJSON(), err.status)
  }

  log.error(err)

  return c.json(
    {
      success: false,
      message: 'Internal Server Error'
    },
    500
  )
}
