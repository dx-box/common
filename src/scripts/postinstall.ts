import path from 'path';
import { fileURLToPath } from 'url';
import { runFormatScripts, setupHuskyHookScripts, updatePackageJsonScripts, setupConfigScripts } from './index.js';

const ROOT = process.env.INIT_CWD || process.cwd();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_DIR = path.join(__dirname, '../../templates');

const main = async () => {
  // 1. package.json에 필요한 dx 관련 스크립트 추가 (예: dx-lint, dx-format 등)
  await updatePackageJsonScripts(ROOT);

  // 2. 설정 병합 및 저장
  await setupConfigScripts(ROOT, TEMPLATE_DIR);

  // 3. 선택적으로 추가 실행할 스크립트가 있다면 실행 (예: lint-staged 등)
  await runFormatScripts();

  // 4. husky가 설치된 Git 저장소에 pre-commit 훅 등록
  await setupHuskyHookScripts(ROOT);
};

main();
