import { Hono } from 'hono'
import { accessJwtMiddleware } from '@/middleware'
import { fetchOptions } from './options.service'

export const optionsRouter = new Hono()

optionsRouter.get('/', accessJwtMiddleware, async c => {
  const options = await fetchOptions()

  return c.json({ data: options, success: true }, 200)
})
