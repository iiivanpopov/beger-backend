export const config = {
  server: {
    port: import.meta.env.PORT!
  },

  database: {
    url: import.meta.env.DATABASE_URL!
  },

  jwt: {
    secret: import.meta.env.JWT_SECRET!,
    accessExpiresIn: 15 * 60,
    refreshExpiresIn: 60 * 60
  },

  cookies: {
    accessTokenName: 'accessToken',
    refreshTokenName: 'refreshToken'
  },

  options: {
    sheetUrl: import.meta.env.SHEET_URL!
  },

  cache: {
    url: import.meta.env.CACHE_URL!,
    fields: {
      options: {
        key: 'options',
        ttl: 60 * 5
      }
    }
  }
}
