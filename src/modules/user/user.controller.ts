import type { Context } from 'hono'
import { getCookie } from 'hono/cookie'
import { CONFIG } from '@/config'
import { ApiError } from '@/exceptions'
import { decode, verify } from '@/utils'
import type { UserService } from './user.service'

export class UserController {
  constructor(private userService: UserService) {}

  deactivate = async (c: Context) => {
    const userId = c.req.param('id')
    if (!userId) {
      throw ApiError.BadRequest('Missing {id} param')
    }

    const userExists = await this.userService.userRepository.isUserExistsById(
      Number(userId)
    )
    if (!userExists) {
      throw ApiError.NotFound(`User with {id} '${userId}' not found`)
    }

    const accessToken = getCookie(c, CONFIG.cookies.accessTokenName)
    if (!accessToken) {
      throw ApiError.Unauthorized('Missing access token')
    }

    const isVerified = await verify(accessToken)
    if (!isVerified) {
      throw ApiError.Unauthorized('Invalid refresh token')
    }

    const [_, decoded] = await verify(accessToken)
    if (decoded?.payload.role !== 'admin') {
      throw ApiError.Forbidden('You must be an admin')
    }

    await this.userService.deactivate(Number(userId))

    return c.json({ success: true }, 200)
  }
}
