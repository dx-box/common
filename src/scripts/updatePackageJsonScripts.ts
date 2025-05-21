import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * 사용자 프로젝트 루트에서 실제 패키지가 설치되었는지 확인
 */

export const updatePackageJsonScripts = (rootDir: string) => {
  const pkgPath = path.join(rootDir, 'package.json');

  if (!fs.existsSync(pkgPath)) {
    console.error('❌ 사용자 프로젝트의 package.json을 찾을 수 없습니다:', pkgPath);
    process.exit(1);
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  pkg.scripts = pkg.scripts || {};

  const desiredScripts: Record<string, string> = {
    'dx-lint': 'eslint . --ext .ts,.tsx,.js --fix',
    'dx-format': 'prettier --cache --write "**/*.{ts,tsx,js,json,md}"',
    postinstall: 'tsx scripts/postinstall.js',
  };

  let changed = false;

  for (const [key, value] of Object.entries(desiredScripts)) {
    if (!pkg.scripts[key]) {
      pkg.scripts[key] = value;
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
    console.log('✅ package.json 스크립트가 업데이트되었습니다 (dx-lint, dx-format 등 추가됨)');
  } else {
    console.log('ℹ️ package.json에 필요한 스크립트가 이미 존재합니다');
  }

  // 🔧 devDependencies 설치 여부 확인
  const requiredDeps = ['prettier', 'eslint', 'eslint-config-prettier', 'husky'];
  const missingDeps = requiredDeps.filter((dep) => !_isPackageInstalled(rootDir, dep));

  if (missingDeps.length > 0) {
    console.log(`📦 다음 패키지를 설치합니다: ${missingDeps.join(', ')}`);
    try {
      execSync(`npm install -D ${missingDeps.join(' ')}`, {
        cwd: rootDir,
        stdio: 'inherit',
      });
      console.log('✅ 필요한 devDependencies 설치 완료');
    } catch (error) {
      console.error('❌ devDependencies 설치 중 오류 발생:', error);
    }
  } else {
    console.log('✅ 필요한 devDependencies가 이미 설치되어 있습니다');
  }
};

const _isPackageInstalled = (projectRoot: string, pkgName: string): boolean => {
  const modulePath = path.join(projectRoot, 'node_modules', pkgName);
  return fs.existsSync(modulePath);
};
