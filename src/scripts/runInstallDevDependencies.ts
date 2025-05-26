import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export const runInstallDevDependencies = (rootDir: string) => {
  const requiredDeps = ['prettier', 'eslint', 'eslint-config-prettier', 'husky', '@typescript-eslint/eslint-plugin'];
  const missingDeps = requiredDeps.filter((dep) => !_isPackageInstalled(rootDir, dep));

  if (missingDeps.length > 0) {
    console.log(`📦 Installing missing devDependencies: ${missingDeps.join(', ')}`);
    try {
      execSync(`npm install -D ${missingDeps.join(' ')}`, {
        cwd: rootDir,
        stdio: 'inherit',
      });
      console.log('✅ devDependencies installed');
    } catch (error) {
      console.error('❌ Failed to install devDependencies:', error);
      process.exit(1);
    }
  } else {
    console.log('✅ All required devDependencies are already installed');
  }
};

const _isPackageInstalled = (projectRoot: string, pkgName: string): boolean => {
  return fs.existsSync(path.join(projectRoot, 'node_modules', pkgName));
};
