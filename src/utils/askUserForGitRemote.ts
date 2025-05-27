import { execSync } from 'child_process';
import readline from 'readline';

/**
 * Prompts the user for a Git remote URL and registers it as 'origin'.
 * @returns The registered Git remote URL.
 */
export const askUserForGitRemote = async (): Promise<string> => {
  const remoteUrl = await promptUser(
    '🌐 Please enter the Git remote URL (e.g., https://github.com/your-org/your-repo.git): '
  );

  try {
    execSync(`git remote add origin ${remoteUrl}`, { stdio: 'inherit' });
    console.log(`✅ Git origin has been set: ${remoteUrl}`);
  } catch (_) {
    console.error('❌ Failed to set origin. It may already exist or the URL may be invalid.');
  }

  return remoteUrl;
};

const promptUser = (question: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
};
