import { execSync } from 'child_process';

export const runFormatScripts = () => {
  try {
    console.log('🚀 dx:lint 실행 중...');
    execSync('npm run dx:lint', { stdio: 'inherit' });

    console.log('🚀 dx:format 실행 중...');
    execSync('npm run dx:format', { stdio: 'inherit' });

    console.log('✅ dx:lint, dx:format 모두 실행 완료');
  } catch (e) {
    console.error('❌ dx:lint 또는 dx:format 실행 실패:', e);
  }
};
