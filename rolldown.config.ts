import { builtinModules } from 'node:module'
import path from 'node:path'
import alias from '@rollup/plugin-alias'
import { defineConfig } from 'rolldown'
import { minify } from 'rollup-plugin-swc3'
import Sonda from 'sonda/rolldown'

const NODE_ENV = process.env.NODE_ENV || 'development'
const isProduction = NODE_ENV === 'production'
const isDevelopment = NODE_ENV === 'development'

const aliases = [
  { find: '@', replacement: path.resolve(import.meta.dirname, 'src') },
  { find: '@/db', replacement: path.resolve(import.meta.dirname, 'src/db') },
  { find: '@/app', replacement: path.resolve(import.meta.dirname, 'src/app') },
  {
    find: '@/config',
    replacement: path.resolve(import.meta.dirname, 'src/config')
  },
  {
    find: '@/utils',
    replacement: path.resolve(import.meta.dirname, 'src/utils')
  },
  {
    find: '@/modules',
    replacement: path.resolve(import.meta.dirname, 'src/modules')
  },
  {
    find: '@/middleware',
    replacement: path.resolve(import.meta.dirname, 'src/middleware')
  },
  {
    find: '@/exceptions',
    replacement: path.resolve(import.meta.dirname, 'src/exceptions')
  }
]

const external = [
  'pino',
  'pino-pretty',
  'hono',
  'hono/cors',
  'hono/logger',
  'hono/utils/http-status',
  'hono/cookie',
  'dotenv',
  'dotenv/config',
  'drizzle-orm',
  'drizzle-orm/pg-core',
  'drizzle-orm/bun-sql',
  'pg',
  'jose',
  'valibot',
  ...builtinModules
]

const minifyConfig = minify({
  module: true,
  compress: {
    drop_console: true,
    drop_debugger: true,
    pure_funcs: [
      'console.log',
      'console.info',
      'console.debug',
      'console.warn'
    ],
    passes: 2,
    toplevel: true,
    dead_code: true,
    evaluate: true,
    conditionals: true,
    unused: true,
    sequences: true,
    collapse_vars: true,
    reduce_funcs: true,
    reduce_vars: true,
    join_vars: true,
    if_return: true
  },
  mangle: {
    toplevel: true,
    safari10: true,
    keep_classnames: true,
    keep_fnames: false
  },
  format: {
    comments: false,
    ascii_only: true,
    ecma: 2025,
    preserve_annotations: false
  }
})

export default defineConfig([
  {
    input: 'src/index.ts',
    platform: 'node',
    plugins: [
      ...(isDevelopment
        ? [
            Sonda({
              deep: true,
              sources: true,
              brotli: true,
              gzip: true
            })
          ]
        : []),
      alias({ entries: aliases }),
      ...(isProduction ? [minifyConfig] : [])
    ],
    external,
    output: {
      file: 'dist/index.mjs',
      format: 'esm',
      sourcemap: isDevelopment
    },
    treeshake: {
      moduleSideEffects: false,
      unknownGlobalSideEffects: false
    }
  },
  {
    input: 'src/db/seed.ts',
    platform: 'node',
    plugins: [
      alias({ entries: aliases }),
      ...(isProduction ? [minifyConfig] : [])
    ],
    external,
    output: {
      file: 'dist/seed.mjs',
      format: 'esm',
      sourcemap: isDevelopment
    },
    treeshake: {
      moduleSideEffects: false,
      unknownGlobalSideEffects: false
    }
  }
])
