import { describe, expect, it } from 'bun:test'
import { compare, hash } from '@/utils'

describe('Password utils', () => {
  const password = 'mySecret123!'
  let passwordHash: string

  it('should hash a password', async () => {
    passwordHash = await hash(password)
    expect(typeof passwordHash).toBe('string')
    expect(passwordHash).not.toBe(password)
    expect(passwordHash.length).toBeGreaterThan(30)
  })

  it('should verify correct password', async () => {
    if (!passwordHash) passwordHash = await hash(password)
    const isValid = await compare(password, passwordHash)
    expect(isValid).toBe(true)
  })

  it('should fail verification for wrong password', async () => {
    if (!passwordHash) passwordHash = await hash(password)
    const isValid = await compare('wrongPassword', passwordHash)
    expect(isValid).toBe(false)
  })
})
