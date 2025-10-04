import { readFileSync } from 'node:fs';
import { build } from 'esbuild';
import { esbuildConfig } from '../esbuild.config';

try {
  const result = await build(esbuildConfig);

  if (result.errors.length > 0) {
    result.errors.forEach((error) => {
      console.error(error.text);
    });
    throw new Error('Build errors');
  }

  if (result.warnings.length > 0) {
    result.warnings.forEach((warning) => {
      console.warn(warning.text);
    });
  }

  console.log('\nBundle sizes:');
  if (result.metafile) {
    const outputs = Object.keys(result.metafile.outputs);
    let totalSize = 0;

    outputs.forEach((output) => {
      const size = result.metafile?.outputs[output]?.bytes;
      if (size) {
        const sizeKB = (size / 1024).toFixed(2);
        const sizeMB = (size / (1024 * 1024)).toFixed(2);
        console.log(`  ${output}: ${sizeKB} KB (${sizeMB} MB)`);
        totalSize += size;
      }
    });

    const totalKB = (totalSize / 1024).toFixed(2);
    const totalMB = (totalSize / (1024 * 1024)).toFixed(2);
    console.log(`\nTotal size: ${totalKB} KB (${totalMB} MB)`);
  } else {
    try {
      const files = ['dist/index.mjs', 'dist/seed.script.mjs'];
      let totalSize = 0;

      files.forEach((file) => {
        try {
          const stats = readFileSync(file);
          const sizeKB = (stats.length / 1024).toFixed(2);
          const sizeMB = (stats.length / (1024 * 1024)).toFixed(2);
          console.log(`  ${file}: ${sizeKB} KB (${sizeMB} MB)`);
          totalSize += stats.length;
        } catch {
          console.log(`  ${file}: not found`);
        }
      });

      const totalKB = (totalSize / 1024).toFixed(2);
      const totalMB = (totalSize / (1024 * 1024)).toFixed(2);
      console.log(`\nTotal size: ${totalKB} KB (${totalMB} MB)`);
    } catch {
      console.log('  Failed to get file sizes');
    }
  }
} catch (error) {
  console.error(error);
  throw error;
}
