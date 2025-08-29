import { decodeJwt, jwtVerify, SignJWT } from 'jose'
import { CONFIG } from '@/config'
import type { UserRole } from '@/db'

export type UserJwtPayload = { sub: string; role: UserRole }

export const signJWT = (
  payload: UserJwtPayload,
  expirationTime: string
): Promise<string> =>
  new SignJWT(payload)
    .setProtectedHeader({ alg: 'ES256' })
    .setIssuedAt()
    .setIssuer(CONFIG.jwt.issuer)
    .setAudience(CONFIG.jwt.audience)
    .setExpirationTime(expirationTime)
    .sign(CONFIG.jwt.privateKey)

export const signJWTs = async (
  payload: UserJwtPayload
): Promise<{
  accessToken: string
  refreshToken: string
}> => {
  const accessToken = await signJWT(payload, CONFIG.jwt.accessExpiration)
  const refreshToken = await signJWT(payload, CONFIG.jwt.refreshExpiration)
  return { accessToken, refreshToken }
}

export const decode = <T extends object = UserJwtPayload>(token: string): T =>
  decodeJwt(token)

export const verify = async <T extends object = UserJwtPayload>(
  token: string
): Promise<[true, T] | [false, undefined]> => {
  try {
    const payload = await jwtVerify(token, CONFIG.jwt.publicKey, {
      algorithms: ['ES256'],
      issuer: CONFIG.jwt.issuer,
      audience: CONFIG.jwt.audience,
      requiredClaims: ['sub']
    })
    return [true, payload as T]
  } catch (error) {
    error
    return [false, undefined]
  }
}
