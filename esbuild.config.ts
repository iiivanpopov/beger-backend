import { builtinModules } from 'node:module';
import type { BuildOptions } from 'esbuild';
import packageJson from './package.json';
import { config } from './src/config';

const external = [
  ...Object.keys(packageJson.dependencies),
  ...Object.keys(packageJson.devDependencies),
  ...builtinModules,
  '@/docs',
];

export const esbuildConfig: BuildOptions = {
  entryPoints: {
    index: 'src/index.ts',
    'seed.script': 'scripts/seed.script.ts',
  },
  bundle: true,
  outdir: './dist',
  platform: 'node',
  target: 'node18',
  format: 'esm',
  sourcemap: config.isDevelopment ? 'external' : false,
  minify: config.isProduction,
  splitting: true,
  external,
  define: {
    'process.env.NODE_ENV': JSON.stringify(config.nodeEnv),
    'process.env': '{}',
    __dirname: 'undefined',
    __filename: 'undefined',
  },
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx',
    '.js': 'js',
    '.jsx': 'jsx',
    '.json': 'json',
  },
  outExtension: {
    '.js': '.mjs',
  },
  treeShaking: true,
  drop: config.isProduction ? ['console', 'debugger'] : [],
  alias: {
    '@': './src',
  },
  metafile: true,
  write: true,
  logLevel: 'silent',
  legalComments: config.isProduction ? 'none' : 'inline',
  charset: 'utf8',
  mainFields: ['module', 'main'],
  conditions: ['node'],
  resolveExtensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  packages: 'external',
  keepNames: false,
  mangleProps: config.isProduction ? /^_/ : undefined,
  reserveProps: config.isProduction ? /^__/ : undefined,
  pure: config.isProduction ? ['console.log', 'console.info', 'console.debug'] : [],
  globalName: undefined,
};

export default esbuildConfig;
