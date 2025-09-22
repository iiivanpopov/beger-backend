import { vValidator } from '@hono/valibot-validator'
import { ApiError } from '@/exceptions'
import { accessJwtMiddleware } from '@/middleware'
import { createRouter } from '@/utils'
import { DeleteUserSchema } from './schemas'
import { deleteUser, getUser } from './users.service'

export const usersRouter = createRouter()

usersRouter.use(accessJwtMiddleware)

usersRouter.get('/', async c => {
  const jwtPayload = c.get('jwtPayload')

  const user = await getUser(Number(jwtPayload.sub))

  return c.json({ data: user, success: true }, 200)
})

usersRouter.delete('/:id', vValidator('param', DeleteUserSchema), async c => {
  const userId = c.req.valid('param').id
  const jwtPayload = c.get('jwtPayload')

  if (jwtPayload?.role !== 'admin') throw ApiError.Forbidden()

  await deleteUser(userId)

  return c.json({ success: true }, 200)
})
