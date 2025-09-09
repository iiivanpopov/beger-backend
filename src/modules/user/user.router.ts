import { Hono } from 'hono'
import { CONFIG } from '@/config'
import { db, TokenRepository, UserRepository } from '@/db'
import { auth } from '@/middleware'
import { UserController } from './user.controller'
import { UserService } from './user.service'

export const userRouter = new Hono()

const userRepository = new UserRepository(db)
const tokenRepository = new TokenRepository(db)
const userService = new UserService(userRepository, tokenRepository)
const userController = new UserController(userService)

const routes = CONFIG.routes.user

userRouter.use(auth)

userRouter.delete(routes.by_id, userController.deactivate.bind(userController))
