import * as ts from 'typescript';

let fileId = 0;
export function createSourceFile(code: string): ts.SourceFile {
  let sourceFile = ts.createSourceFile(
    `${fileId++}.js`,
    code,
    ts.ScriptTarget.ES2015,
    /* setParentNodes */ true,
    ts.ScriptKind.TSX
  );
  return sourceFile;
}
