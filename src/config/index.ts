import { importJWK } from 'jose'
import { object, optional, parse, string } from 'valibot'
import { ROUTES_CONFIG } from './routes'
import 'dotenv/config'

// ----- ENV VALIDATION -----
export const envSchema = object({
  PORT: string(),
  NODE_ENV: optional(string()),

  JWT_PRIVATE_KEY: string(),
  JWT_PUBLIC_KEY: string(),

  ADMIN_PASSWORD: string(),

  DB_USER: string(),
  DB_PASSWORD: string(),
  DB_NAME: string(),
  DB_HOST: string(),
  DB_PORT: string(),

  DATABASE_URL: string()
})

const parsedEnv = parse(envSchema, process.env)

// ----- JWT KEYS LOADING -----
async function loadJwtKeys() {
  const privateJwk = JSON.parse(parsedEnv.JWT_PRIVATE_KEY)
  const publicJwk = JSON.parse(parsedEnv.JWT_PUBLIC_KEY)

  const privateKey = await importJWK(privateJwk, 'ES256')
  const publicKey = await importJWK(publicJwk, 'ES256')

  return { privateKey, publicKey }
}

// ----- CONFIG FACTORY -----
export async function createConfig() {
  const keys = await loadJwtKeys()

  return {
    server: {
      port: parsedEnv.PORT
    },

    database: {
      url: parsedEnv.DATABASE_URL
    },

    jwt: {
      privateKey: keys.privateKey,
      publicKey: keys.publicKey,
      accessExpiration: '15m',
      refreshExpiration: '7d',
      issuer: 'beger-backend',
      audience: 'beger-frontend'
    },

    routes: ROUTES_CONFIG,

    nodeEnv: parsedEnv.NODE_ENV ?? 'development',

    cookies: {
      accessTokenName: 'accessToken',
      refreshTokenName: 'refreshToken',
      accessTokenMaxAge: 900,
      refreshTokenMaxAge: 604800
    }
  }
}

export const CONFIG = await createConfig()
