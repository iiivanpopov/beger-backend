import { Hono } from 'hono'
import type { JWTPayload } from 'hono/utils/jwt/types'
import type { UserJwtPayload } from './jwt'

export const createRouter = () =>
  new Hono<{
    Variables: {
      jwtPayload: JWTPayload & UserJwtPayload
    }
  }>()
