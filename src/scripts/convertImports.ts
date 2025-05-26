import * as fs from 'fs';
import * as path from 'path';
import { Project } from 'ts-morph';

export const convertImports = async (tsconfigPath: string) => {
  const tsconfigFullPath = path.resolve(tsconfigPath);
  const tsconfigDir = path.dirname(tsconfigFullPath);
  const configJson = JSON.parse(fs.readFileSync(tsconfigFullPath, 'utf-8'));

  const compilerOptions = configJson.compilerOptions || {};
  const baseUrl = path.resolve(tsconfigDir, compilerOptions.baseUrl || '.');
  const paths = compilerOptions.paths as Record<string, string[]>;

  const project = new Project({ tsConfigFilePath: tsconfigFullPath });

  for (const sourceFile of project.getSourceFiles()) {
    let changed = false;

    sourceFile.getImportDeclarations().forEach((decl) => {
      const spec = decl.getModuleSpecifierValue();
      if (!spec.startsWith('.')) return;

      const absPath = path.resolve(path.dirname(sourceFile.getFilePath()), spec);
      const relPath = path.relative(baseUrl, absPath).replace(/\\/g, '/');

      const aliasEntry = Object.entries(paths).find(([_, targets]) => {
        const target = targets[0].replace(/\*$/, '').replace(/\\/g, '/');
        return relPath.startsWith(target);
      });

      if (aliasEntry) {
        const [alias, targets] = aliasEntry;
        const aliasPrefix = alias.replace(/\*$/, '');
        const targetPrefix = targets[0].replace(/\*$/, '').replace(/\\/g, '/');
        const subPath = relPath.slice(targetPrefix.length);
        decl.setModuleSpecifier(aliasPrefix + subPath);
      } else {
        decl.setModuleSpecifier(relPath.startsWith('.') ? relPath : './' + relPath);
      }

      changed = true;
    });

    if (changed) {
      await sourceFile.save();
      console.log(`✅ Updated imports in: ${sourceFile.getFilePath()}`);
    }
  }
};
