import fs from 'fs';
import path from 'path';

export const copyDefaultConfig = (rootDir: string, templateDir: string) => {
  const configFile = path.join(rootDir, 'dx.config.ts');
  if (!fs.existsSync(configFile)) {
    const source = path.join(templateDir, 'dx.config.ts');
    const content = fs.readFileSync(source, 'utf-8');
    fs.writeFileSync(configFile, content);
    console.log('✅ dx.config.ts 생성됨');
  }
};
