import { hasKeywordInFilename, isEslintV9Above, mergeConfig } from '@utils/index.js';
import fs from 'fs';
import path from 'path';

const isESLintV9 = isEslintV9Above();

export const setupConfigScripts = async (
  rootDir: string,
  templateDir: string,
  targetType: 'fe' | 'be' = 'fe' // 기본값 fe
) => {
  // tsconfig.base 파일 선택
  const tsconfigBaseFile = targetType === 'fe' ? 'tsconfig.base.fe.json' : 'tsconfig.base.be.json';

  // tsconfig.json 병합
  const tsconfigPath = path.join(rootDir, 'tsconfig.json');
  await mergeConfig(path.join(templateDir, tsconfigBaseFile), tsconfigPath);

  // prettier 설정 병합 (prettier 관련 키워드 포함 파일 탐색)
  const prettierFile = hasKeywordInFilename(rootDir, ['prettier']);
  const prettierTargetPath = prettierFile ? path.join(rootDir, prettierFile) : path.join(rootDir, '.prettierrc.json');

  await mergeConfig(path.join(templateDir, 'prettier.base.js'), prettierTargetPath);

  // eslint 설정 병합 또는 복사
  if (isESLintV9) {
    const target = path.join(rootDir, 'eslint.config.js');
    fs.copyFileSync(path.join(templateDir, 'eslint.base.v9.js'), target);
    console.log(`✅ ESLint V9 flat config 복사 완료`);
  } else {
    const eslintFile = hasKeywordInFilename(rootDir, ['.eslintrc']);

    const eslintTargetPath = eslintFile ? path.join(rootDir, eslintFile) : path.join(rootDir, '.eslintrc.cjs');

    await mergeConfig(path.join(templateDir, 'eslint.base.v8.js'), eslintTargetPath);
  }
};
