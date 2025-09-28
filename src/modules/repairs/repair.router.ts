import { vValidator } from '@hono/valibot-validator'
import { accessJwtMiddleware } from '@/middleware'
import { createRouter } from '@/utils'
import { createRepair, deleteRepair, getLastRepairs } from './repair.service'
import { CreateRepairBody, DeleteRepairParams } from './schemas'

export const repairsRouter = createRouter()

repairsRouter.use(accessJwtMiddleware)

repairsRouter.get('/', async c => {
  const jwtPayload = c.get('jwtPayload')

  const repairs = await getLastRepairs(Number(jwtPayload.sub))

  return c.json({ data: repairs, success: true }, 200)
})

repairsRouter.post('/', vValidator('json', CreateRepairBody), async c => {
  const body = c.req.valid('json')
  const jwtPayload = c.get('jwtPayload')

  const repair = await createRepair(Number(jwtPayload.sub), body)

  return c.json({ data: repair, success: true }, 201)
})

repairsRouter.delete(
  '/:id',
  vValidator('param', DeleteRepairParams),
  async c => {
    const repairId = c.req.valid('param').id

    await deleteRepair(repairId)

    return c.json({ success: true }, 200)
  }
)
