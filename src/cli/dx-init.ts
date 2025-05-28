import { installDevDependencies, setupChangesetScripts, updateTsconfigPath } from '@scripts/index.js';
import { execSync } from 'child_process';
import { Command } from 'commander';
import path from 'path';
import { fileURLToPath } from 'url';
const ROOT = process.env.INIT_CWD || process.cwd();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_DIR = path.join(__dirname, '../../templates');

const program = new Command();

program.option('--src <folder>', 'source folder name', 'src').parse(process.argv);
const options = program.opts();
const srcFolder = options.src;

const main = async () => {
  console.log('🔧 Installing dev dependencies...');
  await installDevDependencies(ROOT);

  console.log('🔧 Setting up Changeset configuration...');
  await setupChangesetScripts(ROOT, TEMPLATE_DIR);

  console.log('🔧 Updating tsconfig paths...');
  updateTsconfigPath(ROOT, srcFolder);

  console.log('🔧 Running dx-fix command...');
  execSync('npx dx-fix');
};

main();
