export type NodeType =
  | 'Program'
  | 'VariableDeclaration'
  | 'NumericLiteral'
  | 'AssignmentExpression'
  | 'Identifier'
  | 'BinaryExpression'
  | 'ObjectLiteral'
  | 'Property'
  | 'MemberExpr'
  | 'CallExpr'

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

export interface AssignmentExpression extends Expression {
  kind: 'AssignmentExpression',
  assigne: Expression,
  value: Expression
}

export interface BinaryExpression extends Expression {
  kind: 'BinaryExpression';
  left: Expression;
  right: Expression;
  operator: string;
}

export interface CallExpr extends Expression {
  kind: 'CallExpr';
  args: Expression[];
  caller: Expression;
}

export interface MemberExpr extends Expression {
  kind: 'MemberExpr';
  object: Expression;
  property: Expression;
  computed: boolean;
}

export interface Identifier extends Expression {
  kind: 'Identifier';
  symbol: string;
}

export interface NumericLiteral extends Expression {
  kind: 'NumericLiteral';
  value: number;
}

export interface Property extends Expression {
  kind: 'Property';
  key: string;
  value?: Expression;
}


export interface ObjectLiteral extends Expression {
  kind: 'ObjectLiteral';
  properties: Property[]
}
