import { Hono } from 'hono'
import { authRouter, repairRouter, userRouter } from '@/modules'

export const router = new Hono()

router.route('/auth', authRouter)
router.route('/user', userRouter)
router.route('/records/repairs', repairRouter)
