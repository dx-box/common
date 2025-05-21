import fs from 'fs';
import path from 'path';
import { mergeConfig } from '../configs/mergeConfig';
import { isEslintV9Above, hasKeywordInFilename } from '../utils';

const isESLintV9 = isEslintV9Above();

export const setupConfigScripts = async (rootDir: string, templateDir: string) => {
  // tsconfig.json 병합
  if (fs.existsSync(path.join(rootDir, 'tsconfig.json'))) {
    await mergeConfig(path.join(templateDir, 'tsconfig.base.json'), path.join(rootDir, 'tsconfig.json'));
  }

  // prettier 설정 병합 (prettier 관련 키워드 포함 파일 탐색)
  const prettierFile = hasKeywordInFilename(rootDir, ['prettier']);
  if (prettierFile) {
    const fullPath = path.join(rootDir, prettierFile);
    await mergeConfig(path.join(templateDir, 'prettier.base.js'), fullPath);
  }

  // eslint 설정 병합 또는 복사
  if (isESLintV9) {
    const target = path.join(rootDir, 'eslint.config.js');
    fs.copyFileSync(path.join(templateDir, 'eslint.base.v9.js'), target);
    console.log(`✅ ESLint V9 flat config 복사 완료`);
  } else {
    const eslintFile = hasKeywordInFilename(rootDir, ['.eslintrc']);
    if (eslintFile) {
      const fullPath = path.join(rootDir, eslintFile);
      await mergeConfig(path.join(templateDir, 'eslint.base.v8.js'), fullPath);
    }
  }
};
