import { vValidator } from '@hono/valibot-validator'
import { ApiError } from '@/exceptions'
import { accessJwtMiddleware } from '@/middleware'
import {
  createRouter,
  getUserId,
  getUserRole,
  IdParam,
  PaginationQuery
} from '@/utils'
import { UpdateUserBody } from './schemas'
import { deleteUser, getAllUsers, getUser, updateUser } from './users.service'

export const usersRouter = createRouter()

usersRouter.use(accessJwtMiddleware)

usersRouter.get('/me', async c => {
  const userId = getUserId(c)

  const user = await getUser(userId)

  return c.json({ data: user, success: true }, 200)
})

usersRouter.get('/', vValidator('query', PaginationQuery), async c => {
  const userRole = getUserRole(c)
  const queryParams = c.req.valid('query')
  if (userRole !== 'admin') throw ApiError.Forbidden()

  const users = await getAllUsers(queryParams)

  return c.json({ data: users, success: true }, 200)
})

usersRouter.patch(
  '/:id',
  vValidator('param', IdParam),
  vValidator('json', UpdateUserBody),
  async c => {
    const body = c.req.valid('json')
    const targetId = c.req.valid('param').id
    const userRole = getUserRole(c)
    if (userRole !== 'admin') throw ApiError.Forbidden()

    const user = await updateUser(targetId, body)

    return c.json({ data: user, success: true }, 200)
  }
)

usersRouter.delete('/:id', vValidator('param', IdParam), async c => {
  const targetId = c.req.valid('param').id
  const userRole = getUserRole(c)
  if (userRole !== 'admin') throw ApiError.Forbidden()

  await deleteUser(targetId)

  return c.json({ success: true }, 200)
})
