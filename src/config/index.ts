export const config = {
  server: {
    port: process.env.PORT!
  },

  database: {
    url: process.env.DATABASE_URL!
  },

  jwt: {
    secret: process.env.JWT_SECRET!,
    accessExpiresIn: 15 * 60,
    refreshExpiresIn: 60 * 60
  },

  cookies: {
    accessTokenName: 'accessToken',
    refreshTokenName: 'refreshToken'
  },

  options: {
    sheetUrl: process.env.SHEET_URL!
  },

  cache: {
    url: process.env.CACHE_URL!,
    fields: {
      options: {
        key: 'options',
        ttl: 60 * 5
      }
    }
  },

  validation: {
    MIN_USERNAME_LEN: 3,
    MIN_PASSWORD_LEN: 6,
    MIN_FULLNAME_LEN: 8
  }
}
