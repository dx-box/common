// scripts/postinstall.js
const fs = require('fs');
const path = require('path');

const configPath = path.resolve(process.cwd(), 'dx.config.ts');

if (!fs.existsSync(configPath)) {
  const content = `
export default {
  settingA: true,
  settingB: "default"
};
  `.trimStart();

  fs.writeFileSync(configPath, content);
  console.log('✅ dx.config.ts 파일이 생성되었습니다.');
} else {
  console.log('ℹ️ dx.config.ts 파일이 이미 존재합니다.');
}
