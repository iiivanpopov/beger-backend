import { builtinModules } from 'node:module';
import { config } from '@/config';
import { log } from '@/utils';
import packageJson from '../package.json';

const external = [
  ...Object.keys(packageJson.dependencies),
  ...Object.keys(packageJson.devDependencies),
  ...builtinModules,
  '@/docs',
];

const build = async () => {
  const result = await Bun.build({
    entrypoints: ['src/index.ts', 'scripts/seed.script.ts'],
    outdir: './dist',
    target: 'bun',
    format: 'esm',
    sourcemap: config.isDevelopment ? 'external' : 'none',
    minify: config.isProduction,
    naming: {
      entry: '[name].mjs',
    },
    external,
    define: {
      'process.env.NODE_ENV': JSON.stringify(config.nodeEnv),
    },
  });

  for (const output of result.outputs) {
    const size = (output.size / 1024).toFixed(2);
    log.info(`${output.path}: ${size} KB`);
  }
};

build();
