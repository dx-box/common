import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import deepmerge from 'deepmerge';

const loadConfig = async (filePath: string): Promise<Record<string, unknown>> => {
  if (!fs.existsSync(filePath)) return {};

  const ext = path.extname(filePath);
  const base = path.basename(filePath);

  try {
    if (base === 'package.json') {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return content.prettier || content.eslintConfig || {};
    }

    if (ext === '.js' || ext === '.cjs') {
      const mod = await import(pathToFileURL(filePath).toString());
      return mod.default || mod;
    }

    if (ext === '.json' || ext === '' || base === 'tsconfig.json') {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    throw new Error(`지원하지 않는 포맷: ${filePath}`);
  } catch (err) {
    console.warn(`⚠️  설정 로드 실패 → ${filePath}: ${(err as { message: string }).message}`);
    return {};
  }
};

const _overwriteMerge = (destinationArray: unknown[], sourceArray: unknown[]) => {
  return Array.from(new Set([...destinationArray, ...sourceArray]));
};

export const mergeConfig = async (basePath: string, targetPath: string, isJSON: boolean = true) => {
  const base = await loadConfig(basePath);
  const target = await loadConfig(targetPath);
  const merged = deepmerge(base, target, {
    arrayMerge: _overwriteMerge,
  });

  const ext = path.extname(targetPath);
  const formatted =
    isJSON || ext === '.json' || path.basename(targetPath) === 'tsconfig.json'
      ? JSON.stringify(merged, null, 2)
      : `module.exports = ${JSON.stringify(merged, null, 2)};\n`;

  fs.writeFileSync(targetPath, formatted, 'utf-8');
  console.log(`✅ 설정 병합 완료 → ${path.basename(targetPath)}`);
};
