import { builtinModules } from 'node:module'
import { log } from '@/utils'

const isDevelopment = process.env.NODE_ENV === 'development'

const external = [
  'hono',
  'drizzle-orm',
  'memcached',
  '@hono/valibot-validator',
  'valibot',
  'pino',
  'pino-pretty',
  ...builtinModules
]

async function build() {
  const result = await Bun.build({
    entrypoints: ['src/index.ts', 'scripts/seed.script.ts'],
    outdir: './dist',
    target: 'bun',
    format: 'esm',
    sourcemap: isDevelopment ? 'external' : 'none',
    minify: !isDevelopment,
    naming: {
      entry: '[name].mjs'
    },
    external
  })

  for (const output of result.outputs) {
    const size = (output.size / 1024).toFixed(2)
    log.info(`${output.path}: ${size} KB`)
  }
}

build()
