import { execSync } from 'child_process';

const main = () => {
  execSync('npx dx-absolute');
  execSync('npx dx-lint');
  execSync('npx dx-format');

  console.log('✅ Successfully updated tsconfig.json paths and applied linting & formatting.');
};

main();
