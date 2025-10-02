import { vValidator } from '@hono/valibot-validator'
import { deleteCookie, getCookie } from 'hono/cookie'
import { config } from '@/config'
import { roleMiddleware } from '@/middleware'
import {
  accessJwtMiddleware,
  refreshJwtMiddleware
} from '@/middleware/jwt.middleware'
import { getUserId } from '@/utils'
import { setCookieTokens } from '@/utils/cookie'
import { createRouter } from '@/utils/hono'
import { login, logout, refresh, register } from './auth.service'
import { LoginBody, RegisterBody } from './schemas'

export const authRouter = createRouter()

authRouter.post('/login', vValidator('json', LoginBody), async c => {
  const body = c.req.valid('json')

  const tokens = await login(body)

  setCookieTokens(c, tokens)

  return c.json({ data: tokens, success: true }, 200)
})

authRouter.post(
  '/register',
  vValidator('json', RegisterBody),
  accessJwtMiddleware,
  roleMiddleware(['admin']),
  async c => {
    const body = c.req.valid('json')

    const user = await register(body)

    return c.json({ data: user, success: true }, 201)
  }
)

authRouter.post('/logout', refreshJwtMiddleware, async c => {
  const userId = getUserId(c)

  await logout(userId)

  deleteCookie(c, config.cookies.accessTokenName)
  deleteCookie(c, config.cookies.refreshTokenName)

  return c.json({ success: true }, 200)
})

authRouter.post('/refresh', refreshJwtMiddleware, async c => {
  const refreshToken = getCookie(c, config.cookies.refreshTokenName)!
  const userId = getUserId(c)

  const tokens = await refresh(userId, refreshToken)

  setCookieTokens(c, tokens)

  return c.json({ data: tokens, success: true }, 200)
})
