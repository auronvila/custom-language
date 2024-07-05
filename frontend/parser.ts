import {BinaryExpression, Expression, Identifier, NumericLiteral, Program, Statement} from "./ast.ts";
import {Token, tokenize, TokenType} from "./lexer.ts";


export default class Parser {
  private tokens: Token[] = [];

  private not_eof(): boolean {
    return this.tokens[0].type != TokenType.EOF;
  }

  private at() {
    return this.tokens[0] as Token
  }

  // deno-lint-ignore no-explicit-any
  private expect(type: TokenType, err: any) {
    const prev = this.tokens.shift() as Token;
    if (!prev || prev.type != type) {
      console.log('Parser Err: \n', err, prev, 'Expecting: ', type);
      Deno.exit(1)
    }

    return prev;
  }

  private eat() {
    const prev = this.tokens.shift() as Token;
    return prev
  }

  public produceAst(sourceCode: string): Program {
    this.tokens = tokenize(sourceCode)
    const program: Program = {
      kind: 'Program',
      body: []
    }

    // parse until the end of the file
    while (this.not_eof()) {
      program.body.push(this.parse_statement());
    }

    return program
  }

  private parse_statement(): Statement {
    // skip to parse expression
    return this.parse_expression()
  }

  private parse_expression(): Expression {
    return this.parse_additive_expression()
  }

  // Orders of Prescidence
  // AssignmentExpr
  // MemberExpr
  // FunctionCall
  // Logical
  // Comparison
  // AdditiveExpr
  // MultiplicativeExpr
  // UnaryExpr
  // PrimaryExpr
  private parse_additive_expression(): Expression {
    let left = this.parse_multiplicative_expression();

    while (this.at().value == '+' || this.at().value == '-') {
      const operator = this.eat().value;
      const right = this.parse_multiplicative_expression();
      left = {
        kind: 'BinaryExpression',
        left,
        right,
        operator,
      } as BinaryExpression
    }

    return left
  }


  private parse_multiplicative_expression(): Expression {
    let left = this.parse_primary_expression();

    while (this.at().value == '/' || this.at().value == '*' || this.at().value == '%') {
      const operator = this.eat().value;
      const right = this.parse_primary_expression();
      left = {
        kind: 'BinaryExpression',
        left,
        operator,
        right
      } as BinaryExpression
    }

    return left
  }

  private parse_primary_expression(): Expression {
    const token = this.at().type;

    switch (token) {
      case TokenType.Identifier:
        return {kind: 'Identifier', symbol: this.eat().value} as Identifier;
      case TokenType.Number:
        return {kind: 'NumericLiteral', value: parseFloat(this.eat().value)} as NumericLiteral;
      case TokenType.OpenParen: {
        this.eat(); // eat the opening paren
        const val = this.parse_expression()
        this.expect(TokenType.CloseParen, '') // eat the closing paren
        return val;
      }
      default :
        console.error(`Unexpected Token found during parsing!!`, this.at())
        Deno.exit(1)
    }
  }
}
