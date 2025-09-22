import { sign, verify } from 'hono/jwt'
import type { JWTPayload } from 'hono/utils/jwt/types'
import { config } from '@/config'
import type { UserRole } from '@/database'

export type UserJwtPayload = { sub: string; role: UserRole }

export const signJWT = async (
  { sub, role }: UserJwtPayload,
  expiresIn: number
) =>
  sign(
    {
      sub,
      role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresIn
    },
    config.jwt.secret
  )

export const signJWTs = async (payload: UserJwtPayload) => ({
  accessToken: await signJWT(payload, config.jwt.accessExpiresIn),
  refreshToken: await signJWT(payload, config.jwt.refreshExpiresIn)
})

export const verifyJWT = async (
  token: string,
  secret: string
): Promise<JWTPayload & UserJwtPayload> =>
  verify(token, secret) as Promise<JWTPayload & UserJwtPayload>
