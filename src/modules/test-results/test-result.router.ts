import { vValidator } from '@hono/valibot-validator'
import { accessJwtMiddleware } from '@/middleware'
import { createRouter } from '@/utils'
import { CreateTestResultSchema, DeleteTestResultSchema } from './schemas'
import {
  createTestResult,
  deleteTestResult,
  getLastTestResults
} from './test-result.service'

export const testResultsRouter = createRouter()

testResultsRouter.use(accessJwtMiddleware)

testResultsRouter.get('/', async c => {
  const jwtPayload = c.get('jwtPayload')

  const testResults = await getLastTestResults(Number(jwtPayload.sub))

  return c.json({ data: testResults, success: true }, 200)
})

testResultsRouter.post(
  '/',
  vValidator('json', CreateTestResultSchema),
  async c => {
    const body = c.req.valid('json')
    const jwtPayload = c.get('jwtPayload')

    const testResult = await createTestResult(Number(jwtPayload.sub), body)

    return c.json({ data: testResult, success: true }, 201)
  }
)

testResultsRouter.delete(
  '/:id',
  vValidator('param', DeleteTestResultSchema),
  async c => {
    const testResultId = c.req.valid('param').id

    await deleteTestResult(testResultId)

    return c.json({ success: true }, 200)
  }
)
