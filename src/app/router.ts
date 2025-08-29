import { Hono } from 'hono'
import { authRouter, userRouter } from '@/modules'

export const router = new Hono()

router.route('/auth', authRouter)
router.route('/user', userRouter)
