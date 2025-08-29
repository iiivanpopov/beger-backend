import pino from 'pino'

const isProduction = process.env.NODE_ENV === 'production'

export const log = pino({
  level: isProduction ? 'info' : 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'yyyy-mm-dd HH:MM:ss.l',
      ignore: 'pid,hostname'
    }
  }
})
