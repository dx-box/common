import { execSync } from 'child_process';

export const isEslintV9Above = (): boolean => {
  try {
    const version = execSync('npx eslint --version').toString().trim();
    const major = parseInt(version.split('.')[0].replace(/^v/, ''), 10);
    return major >= 9;
  } catch {
    return true;
  }
};
