import { execSync } from 'child_process';
import fs, { chmodSync } from 'fs';
import path from 'path';

export const setupHuskyHookScripts = (rootDir: string) => {
  const isGitRepo = fs.existsSync(path.join(rootDir, '.git'));
  if (!isGitRepo) {
    console.log('⚠️ Skipping Husky setup because this is not a Git repository.');
    return;
  }

  try {
    execSync('git config core.hooksPath .husky', { stdio: 'inherit' });

    const hookPath = path.join(rootDir, '.husky', 'pre-commit');
    const requiredLines = ['#!/bin/sh', '', 'npx dx-absolute', 'npx dx-fix', 'git update-index --again'];

    fs.mkdirSync(path.dirname(hookPath), { recursive: true });

    let finalLines = [...requiredLines];

    if (fs.existsSync(hookPath)) {
      const existing = fs
        .readFileSync(hookPath, 'utf-8')
        .split('\n')
        .map((line) => line.trim());
      const existingSet = new Set(existing);

      finalLines = requiredLines.filter((line) => line === '' || existingSet.has(line) || requiredLines.includes(line));
    }

    fs.writeFileSync(hookPath, finalLines.join('\n') + '\n', { mode: 0o755 });
    chmodSync(hookPath, 0o755);

    console.log('✅ Husky pre-commit hook configured successfully');
  } catch (e: unknown) {
    console.error('❌ Husky 설정 실패:', (e as Error).message);
  }
};
