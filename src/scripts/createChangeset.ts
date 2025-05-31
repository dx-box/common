import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { join, resolve } from 'path';

const validBumps = ['patch', 'minor', 'major'] as const;
type BumpType = (typeof validBumps)[number];

export const createChangeset = async (bumpType: BumpType) => {
  if (!validBumps.includes(bumpType)) {
    throw new Error('Version type must be one of: patch, minor, or major.');
  }

  const changesetDir = resolve(process.cwd(), '.changeset');
  const fileName = `${bumpType}-${Date.now()}.md`;
  const targetPath = join(changesetDir, fileName);

  const template = `---
"@dx-box/common": ${bumpType}
---

### ✨ Summary of Changes

- 

### 📌 Detailed Description (Optional)

- 

### 🔧 Migration Required?

- 
`;

  if (!existsSync(changesetDir)) {
    await mkdir(changesetDir);
  }

  await writeFile(targetPath, template, 'utf8');
  console.log(`✅ Created changeset: .changeset/${fileName}`);
};
