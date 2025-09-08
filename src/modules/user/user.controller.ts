import type { Context } from 'hono'
import { ApiError } from '@/exceptions'
import type { UserJwtPayload } from '@/utils'
import type { UserService } from './user.service'

export class UserController {
  constructor(private userService: UserService) {}

  deactivate = async (c: Context) => {
    const userId = c.req.param('id')
    if (!userId) {
      throw ApiError.BadRequest('Missing {id} param')
    }

    const userExists = await this.userService.userRepository.existsById(
      Number(userId)
    )
    if (!userExists) {
      throw ApiError.NotFound(`User with {id} '${userId}' not found`)
    }

    const user = c.var.user as UserJwtPayload
    if (user.role !== 'admin') {
      throw ApiError.Forbidden('You must be an admin')
    }

    await this.userService.deactivate(Number(userId))

    return c.json({ success: true }, 200)
  }
}
