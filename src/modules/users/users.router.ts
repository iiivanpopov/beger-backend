import { vValidator } from '@hono/valibot-validator'
import { ApiError } from '@/exceptions'
import { accessJwtMiddleware } from '@/middleware'
import { createRouter } from '@/utils'
import { DeleteUserParams, UpdateUserBody, UpdateUserParams } from './schemas'
import { deleteUser, getAllUsers, getUser, updateUser } from './users.service'

export const usersRouter = createRouter()

usersRouter.use(accessJwtMiddleware)

usersRouter.get('/me', async c => {
  const userId = Number(c.get('jwtPayload').sub)

  const user = await getUser(userId)

  return c.json({ data: user, success: true }, 200)
})

usersRouter.get('/', async c => {
  const userRole = c.get('jwtPayload').role
  if (userRole !== 'admin') throw ApiError.Forbidden()

  const users = await getAllUsers()

  return c.json({ data: users, success: true }, 200)
})

usersRouter.patch(
  '/:id',
  vValidator('param', UpdateUserParams),
  vValidator('json', UpdateUserBody),
  async c => {
    const userId = c.req.valid('param').id
    const userRole = c.get('jwtPayload').role
    if (userRole !== 'admin') throw ApiError.Forbidden()

    const user = await updateUser(userId, c.req.valid('json'))

    return c.json({ data: user, success: true }, 200)
  }
)

usersRouter.delete('/:id', vValidator('param', DeleteUserParams), async c => {
  const userId = c.req.valid('param').id
  const userRole = c.get('jwtPayload').role
  if (userRole !== 'admin') throw ApiError.Forbidden()

  await deleteUser(userId)

  return c.json({ success: true }, 200)
})
