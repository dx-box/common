import path from 'path';
import { existsSync } from 'fs';
import { pathToFileURL } from 'url';

export const loadDxConfig = async (): Promise<Partial<any>> => {
  const configPath = path.resolve(process.cwd(), 'dx.config.ts');
  if (existsSync(configPath)) {
    const imported = await import(pathToFileURL(configPath).href);
    return imported.default;
  }
  return {};
};
