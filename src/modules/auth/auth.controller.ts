import type { Context } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { parse } from 'valibot'
import { CONFIG } from '@/config'
import { ApiError } from '@/exceptions'
import { verify } from '@/utils'
import type { AuthService } from './auth.service'
import { LoginSchema, RegisterSchema } from './schemas'

export class AuthController {
  constructor(private authService: AuthService) {}

  private setCookieTokens(
    c: Context,
    tokens: { accessToken: string; refreshToken: string }
  ) {
    setCookie(c, CONFIG.cookies.accessTokenName, tokens.accessToken, {
      path: '/',
      secure: true,
      httpOnly: true,
      maxAge: CONFIG.cookies.accessTokenMaxAge
    })

    setCookie(c, CONFIG.cookies.refreshTokenName, tokens.refreshToken, {
      path: '/',
      secure: true,
      httpOnly: true,
      maxAge: CONFIG.cookies.refreshTokenMaxAge
    })
  }

  private clearCookieTokens(c: Context) {
    deleteCookie(c, CONFIG.cookies.accessTokenName)
    deleteCookie(c, CONFIG.cookies.refreshTokenName)
  }

  async login(c: Context): Promise<Response> {
    const parsed = parse(LoginSchema, await c.req.json())

    const userExists = await this.authService.userRepository.existsByUserName(
      parsed.userName
    )
    if (!userExists) {
      throw ApiError.NotFound(
        `User with {userName} '${parsed.userName}' not found`
      )
    }

    const tokens = await this.authService.login(parsed)

    this.setCookieTokens(c, tokens)

    return c.json(tokens, 200)
  }

  async register(c: Context): Promise<Response> {
    const userPayload = parse(RegisterSchema, await c.req.json())

    const accessToken = getCookie(c, CONFIG.cookies.accessTokenName)

    const [_, decoded] = await verify(accessToken ?? '')
    if (decoded?.payload.role !== 'admin') {
      throw ApiError.Forbidden('You must be an admin')
    }

    const userExists = await this.authService.userRepository.existsByUserName(
      userPayload.userName
    )
    if (userExists) {
      throw ApiError.BadRequest(
        `User with {userName} '${userPayload.userName}' already exists`
      )
    }

    const tokens = await this.authService.register(userPayload)

    this.setCookieTokens(c, tokens)

    return c.json(tokens, 201)
  }

  async logout(c: Context): Promise<Response> {
    const refreshToken = getCookie(c, CONFIG.cookies.refreshTokenName)

    const isVerified = await verify(refreshToken ?? '')
    if (!isVerified) {
      throw ApiError.Unauthorized('Invalid refresh token')
    }

    await this.authService.logout(refreshToken ?? '')

    this.clearCookieTokens(c)

    return c.json({ success: true }, 200)
  }

  async refresh(c: Context): Promise<Response> {
    const refreshToken = getCookie(c, CONFIG.cookies.refreshTokenName)
    if (!refreshToken) {
      throw ApiError.Unauthorized('Missing refresh token')
    }

    const isVerified = await verify(refreshToken)
    if (!isVerified) {
      throw ApiError.Unauthorized('Invalid refresh token')
    }

    const tokens = await this.authService.refresh(refreshToken)

    this.setCookieTokens(c, tokens)

    return c.json(tokens, 200)
  }
}
