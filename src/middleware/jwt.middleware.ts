import { jwt } from 'hono/jwt'
import { config } from '@/config'

export const accessJwtMiddleware = jwt({
  secret: config.jwt.accessSecret,
  // cookie: config.cookies.accessTokenName,
  headerName: config.headers.accessToken,
})

export const refreshJwtMiddleware = jwt({
  secret: config.jwt.refreshSecret,
  // cookie: config.cookies.refreshTokenName,
  headerName: config.headers.refreshToken,
})
