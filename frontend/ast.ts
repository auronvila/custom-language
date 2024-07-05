export type NodeType =
  | 'Program'
  | 'VariableDeclaration'
  | 'NumericLiteral'
  | 'Identifier'
  | 'BinaryExpression'

// statement will not return a value

export interface Statement {
  kind: NodeType;
}

export interface Program extends Statement {
  kind: 'Program';
  body: Statement[];
}

export interface VariableDeclaration extends Statement {
  kind: 'VariableDeclaration';
  constant: boolean,
  identifier: string,
  value?: Expression
}

// deno-lint-ignore no-empty-interface
export interface Expression extends Statement {
}

export interface BinaryExpression extends Expression {
  kind: 'BinaryExpression';
  left: Expression;
  right: Expression;
  operator: string;
}

export interface Identifier extends Expression {
  kind: 'Identifier';
  symbol: string;
}

export interface NumericLiteral extends Expression {
  kind: 'NumericLiteral';
  value: number;
}
