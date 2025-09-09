import { Hono } from 'hono'
import { CONFIG } from '@/config'
import { db, TestResultRepository, UserRepository } from '@/db'
import { auth } from '@/middleware'
import { TestResultController } from './test-result.controller'
import { TestResultService } from './test-result.service'

export const testResultRouter = new Hono()

const testResultRepository = new TestResultRepository(db)
const userRepository = new UserRepository(db)
const testResultService = new TestResultService(
  testResultRepository,
  userRepository
)
const testResultController = new TestResultController(testResultService)

const routes = CONFIG.routes.records.test_results

testResultRouter.use(auth)

testResultRouter.get(
  routes.root,
  testResultController.getTestResults.bind(testResultController)
)
testResultRouter.post(
  routes.root,
  testResultController.createTestResult.bind(testResultController)
)
testResultRouter.delete(
  routes.by_id,
  testResultController.deleteTestResult.bind(testResultController)
)
