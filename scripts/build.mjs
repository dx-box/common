// scripts/build.mjs
import { build } from 'esbuild';

await build({
  entryPoints: ['src/index.ts', 'src/scripts/postinstall.ts'],
  outdir: 'dist',
  bundle: true,
  minify: true,
  platform: 'node',
  format: 'esm',
  outbase: 'src',
});
