import { askUserForGitRemote, detectGitPlatform } from '@utils/index.js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export const setupChangesetScripts = async (root: string, templateDir: string) => {
  let remoteUrl: string;

  try {
    remoteUrl = execSync('git remote get-url origin', { cwd: root, encoding: 'utf8' }).trim();
  } catch {
    remoteUrl = await askUserForGitRemote();
  }

  const platform = detectGitPlatform(remoteUrl);

  const configTemplateFile = `changeset-config.github.${platform}.json`;

  const configTemplatePath = path.join(templateDir, configTemplateFile);

  if (!fs.existsSync(configTemplatePath)) {
    throw new Error(`Config template not found: ${configTemplatePath}`);
  }

  let configContent = fs.readFileSync(configTemplatePath, 'utf-8');

  const repoMatch = remoteUrl.match(/[:/]([\w.-]+\/[\w.-]+)(\.git)?$/);
  const repo = repoMatch?.[1] ?? 'your-org/your-repo';

  if (platform === 'github') {
    configContent = configContent.replace(/"__REPO_PLACEHOLDER__"/g, `"${repo}"`);
  }

  const changesetDir = path.join(root, '.changeset');
  if (!fs.existsSync(changesetDir)) {
    execSync('npx changeset init', { cwd: root, stdio: 'inherit' });
  }

  fs.writeFileSync(path.join(changesetDir, 'config.json'), configContent);

  console.log(`✅ Changeset setup completed (${platform} repository, remote: ${remoteUrl})`);
};
