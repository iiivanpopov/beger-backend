import { Hono } from 'hono'
import { CONFIG } from '@/config'
import { db, TokenRepository, UserRepository } from '@/db'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

export const authRouter = new Hono()

const userRepository = new UserRepository(db)
const tokenRepository = new TokenRepository(db)
const authService = new AuthService(userRepository, tokenRepository)
const authController = new AuthController(authService)

const routes = CONFIG.routes.auth

authRouter.post(routes.login, authController.login)
authRouter.post(routes.register, authController.register)
authRouter.post(routes.logout, authController.logout)
authRouter.post(routes.refresh, authController.refresh)
