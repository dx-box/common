import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath, pathToFileURL } from 'url';

import { mergeAndWrite } from '../src/mergeConfig.js';
import { loadDxConfig } from '../src/loadDxConfig.js';

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
  const userConfig = await loadDxConfig();

  mergeAndWrite(path.join(TEMPLATE_DIR, 'tsconfig.base.json'), path.join(ROOT, 'tsconfig.json'), userConfig.tsconfig);

  mergeAndWrite(
    path.join(TEMPLATE_DIR, 'prettier.base.js'),
    path.join(ROOT, '.prettierrc.js'),
    userConfig.prettier,
    false,
  );

  mergeAndWrite(path.join(TEMPLATE_DIR, 'eslint.base.js'), path.join(ROOT, '.eslintrc.js'), userConfig.eslint, false);

  // try {
  //   execSync('npx husky install', { stdio: 'inherit' });
  //   execSync('npx husky add .husky/pre-commit "npx eslint . --ext .ts,.tsx,.js"', {
  //     stdio: 'inherit',
  //   });
  //   console.log('✅ Husky hook 등록됨');
  // } catch (e) {
  //   console.error('❌ Husky 설정 실패:', e.message);
  // }
};

main();
