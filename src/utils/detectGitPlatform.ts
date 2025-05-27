export const detectGitPlatform = (remoteUrl: string): 'github' | 'gitlab' | 'default' => {
  if (!remoteUrl) return 'default';

  const url = remoteUrl.toLowerCase();

  if (url.includes('github.com')) {
    return 'github';
  } else if (url.includes('gitlab.com')) {
    return 'gitlab';
  } else {
    return 'default';
  }
};
