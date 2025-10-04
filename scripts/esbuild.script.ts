import { readFileSync } from 'node:fs';
import { build } from 'esbuild';
import { log } from '@/utils';
import { esbuildConfig } from '../esbuild.config';

try {
  const result = await build(esbuildConfig);

  if (result.errors.length > 0) {
    result.errors.forEach((error) => {
      log.error(error.text);
    });
    throw new Error('Build errors');
  }

  if (result.warnings.length > 0) {
    result.warnings.forEach((warning) => {
      log.warn(warning.text);
    });
  }

  log.info('Bundle sizes:');
  if (result.metafile) {
    const outputs = Object.keys(result.metafile.outputs);
    let totalSize = 0;

    outputs.forEach((output) => {
      const size = result.metafile?.outputs[output]?.bytes;
      if (size) {
        const sizeKB = (size / 1024).toFixed(2);
        const sizeMB = (size / (1024 * 1024)).toFixed(2);
        log.info(`${output}: ${sizeKB} KB (${sizeMB} MB)`);
        totalSize += size;
      }
    });

    const totalKB = (totalSize / 1024).toFixed(2);
    const totalMB = (totalSize / (1024 * 1024)).toFixed(2);
    log.info(`Total size: ${totalKB} KB (${totalMB} MB)`);
  } else {
    try {
      const files = ['dist/index.mjs', 'dist/seed.script.mjs'];
      let totalSize = 0;

      files.forEach((file) => {
        try {
          const stats = readFileSync(file);
          const sizeKB = (stats.length / 1024).toFixed(2);
          const sizeMB = (stats.length / (1024 * 1024)).toFixed(2);
          log.info(`${file}: ${sizeKB} KB (${sizeMB} MB)`);
          totalSize += stats.length;
        } catch {
          log.info(`${file}: not found`);
        }
      });

      const totalKB = (totalSize / 1024).toFixed(2);
      const totalMB = (totalSize / (1024 * 1024)).toFixed(2);
      log.info(`\nTotal size: ${totalKB} KB (${totalMB} MB)`);
    } catch {
      log.info('Failed to get file sizes');
    }
  }
} catch (error) {
  log.error(error);
  throw error;
}
