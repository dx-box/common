import * as path from 'path';
import { Project } from 'ts-morph';

export const runConvertImports = async (tsconfigPath: string) => {
  const project = new Project({
    tsConfigFilePath: tsconfigPath,
  });

  const sourceFiles = project.getSourceFiles();

  for (const sourceFile of sourceFiles) {
    let changed = false;

    sourceFile.getImportDeclarations().forEach((importDecl) => {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();
      if (moduleSpecifier.startsWith('.')) {
        // 상대경로 → 절대경로 변환 로직 (예: rootDir 기준 변환)
        // 아래는 예시: src 경로 대신 @src 별칭 붙이기
        const absPath = path.resolve(path.dirname(sourceFile.getFilePath()), moduleSpecifier);
        // TODO: rootDir, alias 매핑을 넣어 절대경로 변환
        const newImport = absPath.replace('/absolute/root/dir/', '@src/');
        if (newImport !== moduleSpecifier) {
          importDecl.setModuleSpecifier(newImport);
          changed = true;
        }
      }
    });

    if (changed) {
      await sourceFile.save();
      console.log(`Updated imports in: ${sourceFile.getFilePath()}`);
    }
  }
};
