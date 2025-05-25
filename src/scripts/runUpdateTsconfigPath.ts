import fs from 'fs';
import path from 'path';

export const runUpdateTsconfigPath = (rootDir: string, srcFolder: string) => {
  const tsconfigPath = path.resolve(rootDir, 'tsconfig.json');
  const srcPath = path.resolve(rootDir, srcFolder);

  if (!fs.existsSync(tsconfigPath)) {
    console.error(`❌ tsconfig.json not found at ${tsconfigPath}`);
    process.exit(1);
  }
  if (!fs.existsSync(srcPath)) {
    console.error(`❌ Source folder not found at ${srcPath}`);
    process.exit(1);
  }

  const folders = fs
    .readdirSync(srcPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

  tsconfig.compilerOptions ??= {};
  tsconfig.compilerOptions.baseUrl = srcFolder;
  tsconfig.compilerOptions.paths ??= {};

  for (const folder of folders) {
    tsconfig.compilerOptions.paths[`@${folder}/*`] = [`${folder}/*`];
  }

  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2) + '\n');

  console.log('✅ Updated tsconfig.json paths:');
  console.table(tsconfig.compilerOptions.paths);
};
