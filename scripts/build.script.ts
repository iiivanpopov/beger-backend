import { builtinModules } from 'node:module'
import { config } from '@/config'
import packageJson from '../package.json'

Bun.build({
  entrypoints: ['./src/index.ts', './scripts/seed.script.ts'],
  outdir: './dist',
  target: 'bun',
  format: 'esm',
  minify: config.isProduction,
  splitting: true,
  sourcemap: config.isDevelopment ? 'inline' : 'none',
  external: [
    ...Object.keys(packageJson.dependencies),
    ...Object.keys(packageJson.devDependencies),
    ...builtinModules,
  ],
  naming: '[name].[ext]',
})
