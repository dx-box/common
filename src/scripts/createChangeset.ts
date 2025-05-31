import chalk from 'chalk';
import { execSync } from 'child_process';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';

const getPackageName = (): string => {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  return pkg.name || 'your-package';
};

const getPackageVersion = (): string => {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  return pkg.version || '0.0.0';
};

const getCommitsSinceVersionInMessage = (version: string): string[] => {
  try {
    const log = execSync('git log --pretty=format:"%H %s"', { encoding: 'utf-8' });
    const commits = log.split('\n').map((line) => {
      const firstSpace = line.indexOf(' ');
      return {
        hash: line.slice(0, firstSpace),
        message: line.slice(firstSpace + 1),
      };
    });

    const versionCommitIndex = commits.findIndex((c) => c.message.includes(version));
    if (versionCommitIndex === -1) {
      return commits.map((c) => `- ${c.message}`);
    }

    const newerCommits = commits.slice(0, versionCommitIndex);
    if (newerCommits.length === 0) return ['- (no new commits since version)'];
    return newerCommits.map((c) => `- ${c.message}`);
  } catch {
    return ['- (no commits found)'];
  }
};

export const createChangeset = async (bump: string) => {
  const validBumps = ['patch', 'minor', 'major'];
  if (!validBumps.includes(bump)) {
    throw new Error('Version type must be one of patch, minor, or major.');
  }

  const packageName = getPackageName();
  const packageVersion = getPackageVersion();
  const commits = getCommitsSinceVersionInMessage(packageVersion);

  const content = `---
"${packageName}": ${bump}
---

### ✨ Summary

- 

### 📌 Detailed Description (optional)

${commits.join('\n')}

### 🔧 Migration Needed?

- 
`;

  const fileName = `${randomUUID().split('-')[0]}-${bump}.md`;
  const filePath = path.join('.changeset', fileName);

  if (!fs.existsSync('.changeset')) {
    fs.mkdirSync('.changeset');
  }

  fs.writeFileSync(filePath, content.trim());
  console.log(`✅ Changeset template created: .changeset/${fileName}`);
  console.log(`📦 Package: ${chalk.green(packageName)}  |  bump: ${bump}`);
};
