import * as v from 'valibot';
import { EnvSchema } from './env.schema';

const env = v.parse(EnvSchema, process.env);

export const config = {
  isProduction: env.NODE_ENV === 'production',
  isDevelopment: env.NODE_ENV !== 'production',

  server: {
    port: env.PORT,
  },

  database: {
    url: env.DATABASE_URL,
  },

  jwt: {
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessExpiresIn: 15 * 60,
    refreshExpiresIn: 7 * 24 * 60 * 60,
  },

  cookies: {
    accessTokenName: 'accessToken',
    refreshTokenName: 'refreshToken',
  },

  options: {
    sheetUrl: env.SHEET_URL,
  },

  cache: {
    url: env.MEMCACHED_URL,
    fields: {
      options: {
        key: 'options',
        ttl: 60 * 5,
      },
    },
  },

  validation: {
    MIN_USERNAME_LEN: 3,
    MIN_PASSWORD_LEN: 6,
    MIN_FULLNAME_LEN: 8,
    MIN_PCB_NAME_LEN: 1,
    MIN_DEFECT_LEN: 1,
  },
};
