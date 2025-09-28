import { type Context, Hono } from 'hono'
import type { JWTPayload } from 'hono/utils/jwt/types'
import type { UserJwtPayload } from './jwt'

export interface AppRouter {
  Variables: {
    jwtPayload: JWTPayload & UserJwtPayload
  }
}
export type AppContext = Context<AppRouter>

export const createRouter = () => new Hono<AppRouter>()
