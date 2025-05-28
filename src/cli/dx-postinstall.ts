import { setupConfigScripts, setupHuskyHookScripts } from '@scripts/index.js';
import { Command } from 'commander';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = process.env.INIT_CWD || process.cwd();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_DIR = path.join(__dirname, '../../templates');

const program = new Command();
program.option('-t, --target <type>', 'target type: fe or be', 'fe');

program.parse(process.argv);
const options = program.opts();

const main = async () => {
  try {
    console.log('🔧 Setting up configuration files...');
    await setupConfigScripts(ROOT, TEMPLATE_DIR, options.target);

    console.log('🔧 Setting up Husky hooks...');
    await setupHuskyHookScripts(ROOT);

    console.log('✅ Setup complete. All ready to go!');
  } catch (error) {
    console.error('❌ Error during setup:', error);
    process.exit(1);
  }
};

main();
