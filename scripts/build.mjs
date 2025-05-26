import { build } from 'esbuild';
import fg from 'fast-glob';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function aliasTransformPlugin() {
  const aliases = {
    '@utils/': path.resolve(__dirname, '../src/utils/'),
    '@scripts/': path.resolve(__dirname, '../src/scripts/'),
  };

  return {
    name: 'alias-transform',
    setup(build) {
      build.onLoad({ filter: /\.ts$/ }, async (args) => {
        let source = await fs.promises.readFile(args.path, 'utf8');

        for (const [alias, targetDir] of Object.entries(aliases)) {
          const regex = new RegExp(`from ['"]${alias}([^'"]+)['"]`, 'g');

          source = source.replace(regex, (_match, subPath) => {
            const absoluteImportPath = path.resolve(targetDir, subPath);
            const relativePath = path.relative(path.dirname(args.path), absoluteImportPath).replace(/\\/g, '/');
            return `from '${relativePath.startsWith('.') ? relativePath : './' + relativePath}'`;
          });
        }

        return {
          contents: source,
          loader: 'ts',
        };
      });
    },
  };
}

async function buildFolder(srcPattern, outDir, outBase) {
  const entryPoints = await fg([srcPattern]);
  if (entryPoints.length === 0) return;

  await build({
    entryPoints,
    outdir: outDir,
    bundle: false,
    minify: true,
    platform: 'node',
    format: 'esm',
    sourcemap: false,
    outbase: outBase,
    plugins: [aliasTransformPlugin()],
  });
}

async function buildAll() {
  // bin (cli) 파일들 dist/bin 으로
  const cliEntryPoints = await fg(['src/cli/**/*.ts']);
  if (cliEntryPoints.length > 0) {
    await build({
      entryPoints: cliEntryPoints,
      outdir: 'dist/bin',
      bundle: false,
      minify: true,
      platform: 'node',
      format: 'esm',
      sourcemap: false,
      outbase: 'src/cli',
      plugins: [aliasTransformPlugin()],
      banner: {
        js: '#!/usr/bin/env node',
      },
    });
  }

  // scripts, utils는 dist/scripts, dist/utils
  await buildFolder('src/scripts/**/*.ts', 'dist/scripts', 'src/scripts');
  await buildFolder('src/utils/**/*.ts', 'dist/utils', 'src/utils');

  // src/index.ts는 dist 루트에
  await build({
    entryPoints: ['src/index.ts'],
    outdir: 'dist',
    bundle: false,
    minify: true,
    platform: 'node',
    format: 'esm',
    sourcemap: false,
    plugins: [aliasTransformPlugin()],
  });
}

buildAll().catch((e) => {
  console.error(e);
  process.exit(1);
});
