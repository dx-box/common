import { hasKeywordInFilename, isEslintV9Above, mergeConfig } from '@utils/index.js';
import fs from 'fs';
import path from 'path';

const isESLintV9 = isEslintV9Above();

export const setupConfigScripts = async (rootDir: string, templateDir: string, targetType: 'fe' | 'be' = 'fe') => {
  const tsconfigBaseFile = targetType === 'fe' ? 'tsconfig.base.fe.json' : 'tsconfig.base.be.json';

  const tsconfigPath = path.join(rootDir, 'tsconfig.json');
  await mergeConfig(path.join(templateDir, tsconfigBaseFile), tsconfigPath);

  const prettierFile = hasKeywordInFilename(rootDir, ['prettier']);
  const prettierTargetPath = prettierFile ? path.join(rootDir, prettierFile) : path.join(rootDir, '.prettierrc.json');

  await mergeConfig(path.join(templateDir, 'prettier.base.js'), prettierTargetPath);

  if (isESLintV9) {
    const target = path.join(rootDir, 'eslint.config.js');
    fs.copyFileSync(path.join(templateDir, 'eslint.base.v9.js'), target);
    console.log('✅ ESLint v9 flat config copied successfully');
  } else {
    const eslintFile = hasKeywordInFilename(rootDir, ['.eslintrc']);

    const eslintTargetPath = eslintFile ? path.join(rootDir, eslintFile) : path.join(rootDir, '.eslintrc.cjs');

    await mergeConfig(path.join(templateDir, 'eslint.base.v8.js'), eslintTargetPath);
  }
};
