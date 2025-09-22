import { jwt } from 'hono/jwt'
import { config } from '@/config'

export const accessJwtMiddleware = jwt({
  secret: config.jwt.secret,
  cookie: config.cookies.accessTokenName
})

export const refreshJwtMiddleware = jwt({
  secret: config.jwt.secret,
  cookie: config.cookies.refreshTokenName
})
