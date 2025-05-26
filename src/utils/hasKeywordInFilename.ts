import fs from 'fs';

export const hasKeywordInFilename = (dir: string, keywords: string[]): string | undefined => {
  const files = fs.readdirSync(dir);

  return files.find((filename) => keywords.some((keyword) => filename.toLowerCase().includes(keyword.toLowerCase())));
};
