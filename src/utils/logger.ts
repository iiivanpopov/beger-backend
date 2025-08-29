import pino from 'pino'

const isProduction = process.env.NODE_ENV === 'production'

const prettyTransport = {
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'yyyy-mm-dd HH:MM:ss.l',
    ignore: 'pid,hostname'
  }
}

const fileTransport = {
  target: 'pino/file',
  options: {
    destination: './logs/app.log',
    mkdir: true
  }
}

export const log = pino({
  level: isProduction ? 'info' : 'debug',
  transport: {
    targets: [prettyTransport, fileTransport]
  }
})
