import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import deepmerge from 'deepmerge';

export const mergeConfig = async (
  basePath: string,
  targetPath: string,
  userConfig: Record<string, any> = {},
  isJSON: boolean = true
) => {
  const baseModule = await import(pathToFileURL(basePath).toString());
  const baseConfig = baseModule.default || baseModule;

  const merged = deepmerge(baseConfig, userConfig || {});
  const formatted = isJSON ? JSON.stringify(merged, null, 2) : `module.exports = ${JSON.stringify(merged, null, 2)};\n`;

  fs.writeFileSync(targetPath, formatted, 'utf-8');
  console.log(`✅ 설정 병합 완료 → ${path.basename(targetPath)}`);
};
