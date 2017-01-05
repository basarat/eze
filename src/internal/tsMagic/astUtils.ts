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


export function getDemoCodes(code: string): string[] {
  const demoCodes: string[] = [];

  const visitNode = (node: ts.Node) => {

    /** 
     * Heuristic:
     * call expressions
     *  with property access name `demo`.
     *   Collect their first argument
     */
    if (node.kind === ts.SyntaxKind.CallExpression) {
      const call = node as ts.CallExpression;
      if (call.expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
        const propertyAccess = call.expression as ts.PropertyAccessExpression;
        if (
          propertyAccess.name.text === 'demo'
          && call.arguments.length
        ) {
          /** 
           * Unshift as .demo().demo()
           * => second call is visited first because of AST structure
           * So last one visited is the first one the user wrote in the chain
           */
          demoCodes.unshift(call.arguments[0].getFullText());
        }
      }
    }

    ts.forEachChild(node, visitNode);
  };
  visitNode(createSourceFile(code));

  return demoCodes;
}