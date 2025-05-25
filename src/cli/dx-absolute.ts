import { runConvertImports } from '@scripts/index.js';
import path from 'path';

const main = () => {
  const rootDir = process.cwd();
  const tsconfigPath = path.resolve(rootDir, 'tsconfig.json');
  runConvertImports(tsconfigPath);
};

main();
