import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

import { mergeAndWrite, updatePackageJson, loadDxConfig } from '../src';

const ROOT = process.cwd();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_DIR = path.join(__dirname, '../templates');

// dx.config.ts가 없으면 템플릿 복사
const configFile = path.join(ROOT, 'dx.config.ts');
if (!fs.existsSync(configFile)) {
  const source = path.join(TEMPLATE_DIR, 'dx.config.ts');
  const content = fs.readFileSync(source, 'utf-8');
  fs.writeFileSync(configFile, content);
  console.log('✅ dx.config.ts 생성됨');
}

const main = async () => {
  updatePackageJson();
  const userConfig = await loadDxConfig();

  mergeAndWrite(path.join(TEMPLATE_DIR, 'tsconfig.base.json'), path.join(ROOT, 'tsconfig.json'), userConfig.tsconfig);

  mergeAndWrite(path.join(TEMPLATE_DIR, 'prettier.base.js'), path.join(ROOT, '.prettierrc.json'), userConfig.prettier);

  mergeAndWrite(path.join(TEMPLATE_DIR, 'eslint.base.js'), path.join(ROOT, '.eslintrc.cjs'), userConfig.eslint, false);

  // ✅ Husky 설치 및 pre-commit 훅 등록
  const isGitRepo = fs.existsSync(path.join(ROOT, '.git'));
  if (!isGitRepo) {
    console.log('⚠️ Git 저장소가 아니므로 husky 설정을 건너뜁니다.');
    return;
  }

  try {
    execSync('git config core.hooksPath .husky', { stdio: 'inherit' });

    const hookPath = path.join(ROOT, '.husky', 'pre-commit');
    const hookContent = `
#!/bin/sh

npm run dx-lint
npm run dx-format
git update-index --again
`;

    fs.mkdirSync(path.dirname(hookPath), { recursive: true });
    fs.writeFileSync(hookPath, hookContent.trimStart(), { mode: 0o755 });
    console.log('✅ Husky pre-commit hook 생성됨');
  } catch (e) {
    console.error('❌ Husky 설정 실패:', e.message);
  }
};

main();
