import { Hono } from 'hono'
import { CONFIG } from '@/config'
import { auth } from '@/middleware'
import { OptionsController } from './options.controller'
import { OptionsService } from './options.service'

export const optionsRouter = new Hono()

optionsRouter.use(auth)

const optionsService = new OptionsService()
const optionsController = new OptionsController(optionsService)

const routes = CONFIG.routes.options

optionsRouter.get(
  routes.root,
  optionsController.getOptions.bind(optionsController)
)
