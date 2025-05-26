import { execSync } from 'child_process';

const main = () => {
  execSync('npx dx-absolut');
  execSync('npx dx-lint');
  execSync('npx dx-format');
};

main();
