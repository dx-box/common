import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export const updatePackageJsonScripts = () => {
  const pkgPath = path.join(process.cwd(), 'package.json');
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
    console.log('✅ package.json 스크립트 업데이트 완료 (lint, format 추가됨)');
  } else {
    console.log('ℹ️  package.json에 필요한 스크립트가 이미 존재합니다');
  }

  // 🔧 필요한 devDependencies 설치
  const requiredDeps = ['prettier', 'eslint', 'tsx', 'husky'];
  const missingDeps = requiredDeps.filter((dep) => {
    return !((pkg.devDependencies && pkg.devDependencies[dep]) || (pkg.dependencies && pkg.dependencies[dep]));
  });

  if (missingDeps.length > 0) {
    console.log(`📦 ${missingDeps.join(', ')} 설치 중...`);
    try {
      execSync(`npm install -D ${missingDeps.join(' ')}`, { stdio: 'inherit' });
      console.log('✅ 필요한 패키지 설치 완료');
    } catch (error) {
      console.error('❌ 패키지 설치 중 오류 발생:', error);
    }
  } else {
    console.log('✅ 필요한 devDependencies가 이미 설치되어 있습니다');
  }
};
