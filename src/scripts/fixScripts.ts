import { execSync } from 'child_process';

export const lintScripts = () => {
  try {
    console.log('🚀 ESLint is running...');
    execSync('eslint . --ext .ts,.tsx,.js,.cjs,mjs --fix', { stdio: 'inherit' });
  } catch (e) {
    console.error('❌ ESLint execution failed:', e);
  }
};

export const formatScripts = () => {
  try {
    console.log('🚀 prettier is running...');
    execSync('prettier --write "**/*.{ts,tsx,js,cjs,mjs,json}"', { stdio: 'inherit' });
  } catch (e) {
    console.error('❌ prettier execution failed:', e);
  }
};
