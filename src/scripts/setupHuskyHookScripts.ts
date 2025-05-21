import { execSync } from 'child_process';
import fs, { chmodSync } from 'fs';
import path from 'path';

export const setupHuskyHookScripts = (rootDir: string) => {
  // ✅ Husky 설치 및 pre-commit 훅 등록
  const isGitRepo = fs.existsSync(path.join(rootDir, '.git'));
  if (!isGitRepo) {
    console.log('⚠️ Git 저장소가 아니므로 husky 설정을 건너뜁니다.');
    return;
  }

  try {
    execSync('git config core.hooksPath .husky', { stdio: 'inherit' });

    const hookPath = path.join(rootDir, '.husky', 'pre-commit');
    const hookContent = _dedent(`
      #!/bin/sh

      npm run dx-lint
      npm run dx-format
      git update-index --again
    `);

    fs.mkdirSync(path.dirname(hookPath), { recursive: true });
    fs.writeFileSync(hookPath, hookContent.trimStart(), { mode: 0o755 });
    chmodSync(hookPath, 0o755);
    console.log('✅ Husky pre-commit hook 생성됨');
  } catch (e: unknown) {
    console.error('❌ Husky 설정 실패:', (e as Error).message);
  }
};

const _dedent = (str: string) => {
  const lines = str.split('\n');

  while (lines.length && lines[0].trim() === '') lines.shift();
  while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();

  const minIndent =
    lines.reduce(
      (min, line) => {
        if (line.trim() === '') return min;
        const indent = line.match(/^(\s*)/)![1].length;
        return min === null ? indent : Math.min(min, indent);
      },
      null as number | null
    ) || 0;

  return lines.map((line) => line.slice(minIndent)).join('\n');
};
