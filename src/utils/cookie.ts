import type { Context } from 'hono'
import { setCookie } from 'hono/cookie'
import { config } from '@/config'

export const setCookieTokens = (
  c: Context,
  tokens: { accessToken: string; refreshToken: string }
) => {
  setCookie(c, config.cookies.accessTokenName, tokens.accessToken, {
    path: '/',
    secure: true,
    httpOnly: true,
    maxAge: config.jwt.accessExpiresIn
  })

  setCookie(c, config.cookies.refreshTokenName, tokens.refreshToken, {
    path: '/',
    secure: true,
    httpOnly: true,
    maxAge: config.jwt.refreshExpiresIn
  })
}
