import path from 'node:path'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { config } from '@/config'
import { errorMiddleware } from '@/middleware'
import { createRouter, log } from '@/utils'
import { router } from './router'

export const setup = async () => {
  const app = createRouter()

  app.onError(errorMiddleware)

  app.use(cors())
  app.use(logger())

  app.get('/health', c =>
    c.json({
      status: 'ok',
      timestamp: new Date().toISOString()
    })
  )

  app.route('/api', router)

  const baseUrl =
    process.env.NODE_ENV === 'development' ? '/' : import.meta.dirname
  const server = Bun.serve({
    port: config.server.port,
    tls: {
      key: Bun.file(path.resolve(baseUrl, './certs/key.pem')),
      cert: Bun.file(path.resolve(baseUrl, './certs/cert.pem'))
    },
    fetch: app.fetch,
    development: process.env.NODE_ENV !== 'production'
  })

  log.info(`Listening ${server.url}`)
}
