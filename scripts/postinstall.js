import path from 'path';
import { fileURLToPath } from 'url';

import { copyDefaultConfig, loadDxConfig, mergeConfig } from '../src/configs';
import { runFormatScripts, setupHuskyHookScripts, updatePackageJsonScripts } from '../src/scripts';

const ROOT = process.cwd();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_DIR = path.join(__dirname, '../templates');

const main = async () => {
  // 1. dx.config.ts가 없으면 템플릿에서 복사
  copyDefaultConfig(ROOT, TEMPLATE_DIR);

  // 2. package.json에 필요한 dx 관련 스크립트 추가 (예: dx-lint, dx-format 등)
  updatePackageJsonScripts();

  // 3. 사용자 정의 dx.config.ts를 불러와 설정을 로드
  const userConfig = await loadDxConfig();

  // 4. tsconfig 설정 병합 및 저장
  mergeConfig(path.join(TEMPLATE_DIR, 'tsconfig.base.json'), path.join(ROOT, 'tsconfig.json'), userConfig.tsconfig);

  // 5. prettier 설정 병합 및 저장
  mergeConfig(path.join(TEMPLATE_DIR, 'prettier.base.js'), path.join(ROOT, '.prettierrc.json'), userConfig.prettier);

  // 6. eslint 설정 병합 및 저장
  mergeConfig(
    // default: v9
    path.join(TEMPLATE_DIR, 'eslint.base.v9.js'),
    path.join(ROOT, 'eslint.config.cjs'),
    userConfig.eslint,
    false // 이 값은 보통 "deep merge가 아닌 덮어쓰기 여부"를 제어
  );

  // 7. 선택적으로 추가 실행할 스크립트가 있다면 실행 (예: lint-staged 등)
  runFormatScripts();

  // 8. husky가 설치된 Git 저장소에 pre-commit 훅 등록
  setupHuskyHookScripts();
};

main();
