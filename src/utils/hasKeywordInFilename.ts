import fs from 'fs';

/**
 * 디렉터리 내 파일명 중 하나라도 키워드를 포함하고 있는지 확인
 *
 * @param dir 디렉터리 경로
 * @param keywords 포함 여부를 확인할 키워드 배열
 * @returns 키워드를 포함한 파일명이 존재하는 경우 해당 파일명 문자열, 없으면 undefined
 */

export const hasKeywordInFilename = (dir: string, keywords: string[]): string | undefined => {
  const files = fs.readdirSync(dir);

  return files.find((filename) => keywords.some((keyword) => filename.toLowerCase().includes(keyword.toLowerCase())));
};
