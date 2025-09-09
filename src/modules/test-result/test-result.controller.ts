import type { Context } from 'hono'
import { parse } from 'valibot'
import { ApiError } from '@/exceptions'
import { type UserJwtPayload } from '@/utils'
import type { TestResultService } from './test-result.service'
import { CreateTestResultSchema } from './schemas'

export class TestResultController {
  constructor(private testResultService: TestResultService) {}

  getTestResults = async (c: Context) => {
    const user = c.var.user as UserJwtPayload

    const results = await this.testResultService.testResultRepository.findByUserId(
      Number(user.sub),
      { limit: 10, latest: true }
    )

    return c.json({ results }, 200)
  }

  createTestResult = async (c: Context) => {
    const parsed = parse(CreateTestResultSchema, await c.req.json())
    const user = c.var.user as UserJwtPayload

    await this.testResultService.testResultRepository.create({
      ...parsed,
      userId: Number(user.sub)
    })

    return c.json({ success: true }, 201)
  }

  deleteTestResult = async (c: Context) => {
    const resultId = c.req.param('id')
    if (!resultId) {
      throw ApiError.BadRequest('Missing {id} param')
    }

    const user = c.var.user as UserJwtPayload

    await this.testResultService.testResultRepository.delete(
      Number(resultId),
      Number(user.sub)
    )

    return c.json({ success: true }, 200)
  }
}
