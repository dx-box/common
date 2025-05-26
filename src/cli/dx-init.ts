import { installDevDependencies, updateTsconfigPath } from '@scripts/index.js';
import { execSync } from 'child_process';
import { Command } from 'commander';

const program = new Command();

program.option('--src <folder>', 'source folder name', 'src').parse(process.argv);

const main = () => {
  const rootDir = process.cwd();
  const options = program.opts();
  const srcFolder = options.src;

  installDevDependencies(rootDir);
  updateTsconfigPath(rootDir, srcFolder);
  execSync('npx dx-fix');
};

main();
