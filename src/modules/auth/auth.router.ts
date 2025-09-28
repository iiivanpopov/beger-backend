import { vValidator } from '@hono/valibot-validator'
import { eq } from 'drizzle-orm'
import { deleteCookie } from 'hono/cookie'
import { config } from '@/config'
import { db, usersTable } from '@/database'
import { ApiError } from '@/exceptions'
import {
  accessJwtMiddleware,
  refreshJwtMiddleware
} from '@/middleware/jwt.middleware'
import { getUserId, getUserRole } from '@/utils'
import { setCookieTokens } from '@/utils/cookie'
import { createRouter } from '@/utils/hono'
import { login, logout, refresh, register } from './auth.service'
import { LoginBody, RegisterBody } from './schemas'

export const authRouter = createRouter()

authRouter.post('/login', vValidator('json', LoginBody), async c => {
  const body = c.req.valid('json')

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.userName, body.userName))
  if (!user) throw ApiError.NotFound()

  const tokens = await login(body)

  setCookieTokens(c, tokens)

  return c.json({ data: tokens, success: true }, 200)
})

authRouter.post(
  '/register',
  vValidator('json', RegisterBody),
  accessJwtMiddleware,
  async c => {
    const body = c.req.valid('json')
    const userRole = getUserRole(c)
    if (userRole !== 'admin') throw ApiError.Forbidden()

    const tokens = await register(body)

    return c.json({ data: tokens, success: true }, 201)
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
  const userId = getUserId(c)

  const tokens = await refresh(userId)

  setCookieTokens(c, tokens)

  return c.json({ data: tokens, success: true }, 200)
})
