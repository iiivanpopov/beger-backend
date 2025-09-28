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
import {
  createRepair,
  deleteRepair,
  deleteSafeRepair,
  getRepairs,
  getUserRepairs
} from './repair.service'
import { CreateRepairBody } from './schemas'

export const repairsRouter = createRouter()

repairsRouter.use(accessJwtMiddleware)

repairsRouter.get('/me', async c => {
  const userId = getUserId(c)

  const repairs = await getUserRepairs(userId)

  return c.json({ data: repairs, success: true }, 200)
})

repairsRouter.get('/', vValidator('query', PaginationQuery), async c => {
  const userRole = getUserRole(c)
  const queryParams = c.req.valid('query')
  if (userRole !== 'admin') throw ApiError.Forbidden()

  const testResults = await getRepairs(queryParams)

  return c.json({ data: testResults, success: true }, 200)
})

repairsRouter.post('/', vValidator('json', CreateRepairBody), async c => {
  const body = c.req.valid('json')
  const userId = getUserId(c)

  const repair = await createRepair(userId, body)

  return c.json({ data: repair, success: true }, 201)
})

repairsRouter.delete('/:id', vValidator('param', IdParam), async c => {
  const userRole = getUserRole(c)
  const userId = getUserId(c)
  const repairId = c.req.valid('param').id

  if (userRole === 'user') await deleteSafeRepair(userId, repairId)
  else if (userRole === 'admin') await deleteRepair(repairId)

  return c.json({ success: true }, 200)
})
