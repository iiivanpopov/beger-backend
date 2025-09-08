import type { Context, MiddlewareHandler } from 'hono'
import { getCookie } from 'hono/cookie'
import { CONFIG } from '@/config'
import { ApiError } from '@/exceptions'
import { verify } from '@/utils'

export const auth: MiddlewareHandler = async (c: Context, next) => {
  const accessToken = getCookie(c, CONFIG.cookies.accessTokenName)
  if (!accessToken) {
    throw ApiError.Unauthorized('Missing accessToken token')
  }

  const [verified, decoded] = await verify(accessToken)
  if (!verified) {
    throw ApiError.Unauthorized()
  }

  c.set('user', decoded.payload)

  return await next()
}
