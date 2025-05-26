import { convertImports, updateTsconfigPath } from '@scripts/index.js';
import path from 'path';
import { Command } from 'commander';

const program = new Command();

program.option('--src <folder>', 'source folder name', 'src').parse(process.argv);

const main = () => {
  const rootDir = process.cwd();
  const options = program.opts();
  const srcFolder = options.src;

  const tsconfigPath = path.resolve(rootDir, 'tsconfig.json');

  updateTsconfigPath(rootDir, srcFolder);
  convertImports(tsconfigPath);
};

main();
