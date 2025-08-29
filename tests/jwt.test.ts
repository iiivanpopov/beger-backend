import { describe, expect, it } from 'bun:test'
import { decode, signJWT, type UserJwtPayload, verify } from '@/utils'

describe('JWT utils', () => {
  const payload: UserJwtPayload = { sub: 'user123', role: 'admin' }
  const expirationTime = '1h'
  let token: string

  it('should sign a JWT', async () => {
    token = await signJWT(payload, expirationTime)
    expect(typeof token).toBe('string')
    expect(token.split('.').length).toBe(3)
  })

  it('should decode a JWT', async () => {
    if (!token) token = await signJWT(payload, expirationTime)
    const decoded = decode(token)
    expect(decoded.sub).toBe(payload.sub)
  })

  it('should verify a valid JWT', async () => {
    if (!token) token = await signJWT(payload, expirationTime)
    const [success, _] = await verify(token)
    expect(success).toBe(true)
  })

  it('should fail to verify an invalid JWT', async () => {
    const [success, _] = await verify(token + 'invalid')
    expect(success).toBe(false)
  })
})
