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

  login = async (c: Context): Promise<Response> => {
    const body = await c.req.json()
    const parsed = parse(LoginSchema, body)

    const userExists =
      await this.authService.userRepository.isUserExistsByUserName(
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

  register = async (c: Context): Promise<Response> => {
    const body = await c.req.json()
    const userPayload = parse(RegisterSchema, body)

    const accessToken = getCookie(c, CONFIG.cookies.accessTokenName)
    if (!accessToken) {
      throw ApiError.Unauthorized('Missing accessToken token')
    }

    const [_, decoded] = await verify(accessToken)
    if (decoded?.payload.role !== 'admin') {
      throw ApiError.Forbidden('You must be an admin')
    }

    const userExists =
      await this.authService.userRepository.isUserExistsByUserName(
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

  logout = async (c: Context): Promise<Response> => {
    const refreshToken = getCookie(c, CONFIG.cookies.refreshTokenName)
    if (!refreshToken) {
      throw ApiError.Unauthorized('Missing refresh token')
    }

    const isVerified = await verify(refreshToken)
    if (!isVerified) {
      throw ApiError.Unauthorized('Invalid refresh token')
    }

    await this.authService.logout(refreshToken)

    this.clearCookieTokens(c)

    return c.json({ success: true }, 200)
  }

  refresh = async (c: Context): Promise<Response> => {
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
