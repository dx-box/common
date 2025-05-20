import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { copyDefaultConfig, loadDxConfig, mergeConfig } from '../src/configs';
import { runFormatScripts, setupHuskyHookScripts, updatePackageJsonScripts } from '../src/scripts';
import { isEslintV9Above } from '../src/utils';

const ROOT = process.cwd();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_DIR = path.join(__dirname, '../templates');
const isV9Above = isEslintV9Above();

const main = async () => {
  // 1. dx.config.ts가 없으면 템플릿에서 복사
  copyDefaultConfig(ROOT, TEMPLATE_DIR);

  // 2. package.json에 필요한 dx 관련 스크립트 추가 (예: dx-lint, dx-format 등)
  await updatePackageJsonScripts();

  // 3. 사용자 정의 dx.config.ts를 불러와 설정을 로드
  const userConfig = await loadDxConfig();

  // 4. tsconfig 설정 병합 및 저장
  await mergeConfig(
    path.join(TEMPLATE_DIR, 'tsconfig.base.json'),
    path.join(ROOT, 'tsconfig.json'),
    userConfig.tsconfig
  );

  // 5. prettier 설정 병합 및 저장
  await mergeConfig(
    path.join(TEMPLATE_DIR, 'prettier.base.js'),
    path.join(ROOT, '.prettierrc.json'),
    userConfig.prettier
  );

  // 6. eslint 설정 병합 및 저장
  if (isV9Above) {
    // flat config는 그냥 템플릿을 그대로 복사
    fs.copyFileSync(path.join(TEMPLATE_DIR, 'eslint.base.v9.js'), path.join(ROOT, 'eslint.config.js'));
  } else {
    // 기존 병합 방식
    await mergeConfig(
      path.join(TEMPLATE_DIR, 'eslint.base.v8.js'),
      path.join(ROOT, '.eslintrc.cjs'),
      userConfig.eslint,
      true
    );
  }

  // 7. 선택적으로 추가 실행할 스크립트가 있다면 실행 (예: lint-staged 등)
  runFormatScripts();

  // 8. husky가 설치된 Git 저장소에 pre-commit 훅 등록
  setupHuskyHookScripts();
};

main();
