import { Command } from 'commander';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupConfigScripts, setupHuskyHookScripts } from './index.js';

const ROOT = process.env.INIT_CWD || process.cwd();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_DIR = path.join(__dirname, '../../templates');

const program = new Command();
program.option('-t, --target <type>', 'target type: fe or be', 'fe');

program.parse(process.argv);
const options = program.opts();

// const main = async () => {
//   // 1. 설정 병합 및 저장
//   await setupConfigScripts(ROOT, TEMPLATE_DIR, options.target);

//   // 2. husky가 설치된 Git 저장소에 pre-commit 훅 등록
//   await setupHuskyHookScripts(ROOT);
// };

const main = async () => {
  try {
    await setupConfigScripts(ROOT, TEMPLATE_DIR, options.target);
    await setupHuskyHookScripts(ROOT);
    console.log('Setup complete.');
  } catch (error) {
    console.error('Error during setup:', error);
    process.exit(1);
  }
};

main();
