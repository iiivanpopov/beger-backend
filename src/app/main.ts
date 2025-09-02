import path from 'node:path'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { CONFIG } from '@/config'
import { error } from '@/middleware'
import { log } from '@/utils'
import { router } from './router'

export const setup = async () => {
  const app = new Hono()

  app.onError(error)

  app.use(cors())
  app.use(logger())

  app.route('/api', router)

  const baseUrl = CONFIG.nodeEnv === 'development' ? '/' : import.meta.dirname
  Bun.serve({
    port: CONFIG.server.port,
    tls: {
      key: Bun.file(path.resolve(baseUrl, './certs/key.pem')),
      cert: Bun.file(path.resolve(baseUrl, './certs/cert.pem'))
    },
    fetch: app.fetch,
    development: CONFIG.nodeEnv !== 'production'
  })

  log.info(`HTTPS server running on https://localhost:${CONFIG.server.port}`)
}
