import { runFixScripts, runInstallDevDependencies, runUpdateTsconfigPath } from '@scripts/index.js';
import { Command } from 'commander';

const program = new Command();

program.option('--src <folder>', 'source folder name', 'src').parse(process.argv);

const main = () => {
  const rootDir = process.cwd();
  const options = program.opts();
  const srcFolder = options.src;

  runInstallDevDependencies(rootDir);
  runUpdateTsconfigPath(rootDir, srcFolder);
  runFixScripts();
};

main();
