import * as fs from 'fs';
import * as path from 'path';
import { Project } from 'ts-morph';

export const runConvertImports = async (tsconfigPath: string) => {
  const tsconfigFullPath = path.resolve(tsconfigPath);
  const tsconfigDir = path.dirname(tsconfigFullPath);

  const configJson = JSON.parse(fs.readFileSync(tsconfigFullPath, 'utf-8'));
  const compilerOptions = configJson.compilerOptions || {};

  const baseUrl = path.resolve(tsconfigDir, compilerOptions.baseUrl || '.');
  const paths = compilerOptions.paths || {};

  const project = new Project({
    tsConfigFilePath: tsconfigFullPath,
  });

  const sourceFiles = project.getSourceFiles();

  for (const sourceFile of sourceFiles) {
    let changed = false;

    sourceFile.getImportDeclarations().forEach((importDecl) => {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();
      if (!moduleSpecifier.startsWith('.')) return;

      const importerDir = path.dirname(sourceFile.getFilePath());
      const absImportPath = path.resolve(importerDir, moduleSpecifier);
      const relToBase = path.relative(baseUrl, absImportPath).replace(/\\/g, '/');

      let replaced = false;

      // paths alias 처리
      for (const [aliasPattern, targets] of Object.entries(paths)) {
        const aliasPrefix = aliasPattern.replace(/\*$/, '');
        const targetPrefix = (targets as string[])[0].replace(/\*$/, '').replace(/\\/g, '/');

        if (relToBase.startsWith(targetPrefix)) {
          const subPath = relToBase.slice(targetPrefix.length);
          const newImport = aliasPrefix + subPath;
          importDecl.setModuleSpecifier(newImport);
          changed = true;
          replaced = true;
          break;
        }
      }

      // paths 매칭 안 될 경우 baseUrl 기준 절대 import로
      if (!replaced) {
        const newImport = relToBase.startsWith('.') ? relToBase : './' + relToBase;
        importDecl.setModuleSpecifier(newImport);
        changed = true;
      }
    });

    if (changed) {
      await sourceFile.save();
      console.log(`✅ Updated imports in: ${sourceFile.getFilePath()}`);
    }
  }
};
