import { Hono } from 'hono'
import {
  authRouter,
  optionsRouter,
  repairRouter,
  testResultRouter,
  userRouter
} from '@/modules'

export const router = new Hono()

router.route('/auth', authRouter)
router.route('/user', userRouter)
router.route('/records/repairs', repairRouter)
router.route('/records/test-results', testResultRouter)
router.route('/options', optionsRouter)
