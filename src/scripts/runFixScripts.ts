import { execSync } from 'child_process';

export const runFixScripts = () => {
  try {
    console.log('🚀 eslint 실행 중...');
    execSync('eslint . --ext .ts,.tsx,.js,.cjs --fix', { stdio: 'inherit' });

    console.log('🚀 prettier 실행 중...');
    execSync('prettier --write "**/*.{ts,tsx,js,cjs,json,md}"', { stdio: 'inherit' });

    console.log('✅ eslint, prettier 모두 실행 완료');
  } catch (e) {
    console.error('❌ eslint 또는 prettier 실행 실패:', e);
  }
};
