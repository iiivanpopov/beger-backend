import type { Context } from 'hono'
import { parse } from 'valibot'
import { ApiError } from '@/exceptions'
import { type UserJwtPayload } from '@/utils'
import { CreateTestResultSchema } from './schemas'
import type { TestResultService } from './test-result.service'

export class TestResultController {
  constructor(private testResultService: TestResultService) {}

  async getTestResults(c: Context) {
    const user = c.var.user as UserJwtPayload

    const results =
      await this.testResultService.testResultRepository.findByUserId(
        Number(user.sub),
        { limit: 10, latest: true }
      )

    return c.json({ results }, 200)
  }

  async createTestResult(c: Context) {
    const parsed = parse(CreateTestResultSchema, await c.req.json())
    const user = c.var.user as UserJwtPayload

    await this.testResultService.testResultRepository.create({
      ...parsed,
      userId: Number(user.sub)
    })

    return c.json({ success: true }, 201)
  }

  async deleteTestResult(c: Context) {
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
