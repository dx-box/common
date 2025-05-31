import { createChangeset } from '@scripts/index.js';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import inquirer from 'inquirer';
import { resolve } from 'path';

const main = async () => {
  const pkgPath = resolve(process.cwd(), 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  const packageName = pkg.name;
  const currentVersion = pkg.version;

  const greenLabel = chalk.green(`${packageName}@v${currentVersion}`);

  const { bump } = await inquirer.prompt([
    {
      type: 'list',
      name: 'bump',
      message: `Select a bump type for ${greenLabel}:`,
      choices: ['patch', 'minor', 'major'],
    },
  ]);

  await createChangeset(bump);
};

main();
