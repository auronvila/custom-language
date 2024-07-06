import {
  AssignmentExpression,
  BinaryExpression,
  Expression,
  Identifier,
  NumericLiteral, ObjectLiteral,
  Program, Property,
  Statement,
  VariableDeclaration
} from "./ast.ts";
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
    switch (this.at().type) {
      case TokenType.Let:
        return this.parse_var_declaration()
      case TokenType.Const:
        return this.parse_var_declaration()

      default:
        return this.parse_expression()
    }
    // skip to parse expression
  }

  private parse_expression(): Expression {
    return this.parse_assignment_expression()
  }

  private parse_assignment_expression(): Expression {
    const left = this.parse_object_expression();

    if (this.at().type == TokenType.Equals) {
      this.eat();
      const value = this.parse_assignment_expression();
      return {value, assigne: left, kind: 'AssignmentExpression'} as AssignmentExpression
    }

    return left;
  }

  private parse_object_expression(): Expression {
    if (this.at().type !== TokenType.OpenBrace) {
      return this.parse_additive_expression();
    }

    this.eat()
    const properties = new Array<Property>()
    while (this.not_eof() && this.at().type != TokenType.CloseBrace) {
      const key = this.expect(TokenType.Identifier, 'Object literal key expected.').value;
      if (this.at().type == TokenType.Comma) {
        this.eat();
        properties.push({key, kind: 'Property'} as Property);
        continue
      } else if (this.at().type == TokenType.CloseBrace) {
        properties.push({key, kind: 'Property'});
        continue
      }

      this.expect(TokenType.Colon, 'Missing colon following in ObjectExpr');
      const value = this.parse_expression();

      properties.push({kind: 'Property', value, key})
      if (this.at().type !== TokenType.CloseBrace) {
        this.expect(TokenType.Comma, 'Expected comma or closing bracket following property')
      }
    }

    this.expect(TokenType.CloseBrace, 'Object literal missing an closing brace.');
    return {kind: 'ObjectLiteral', properties} as ObjectLiteral
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

  parse_var_declaration(): Statement {
    const isConstant = this.eat().type == TokenType.Const;
    const identifier = this.expect(TokenType.Identifier, 'Expected identifier name following let | const keywords').value;

    if (this.at().type == TokenType.SemiColon) {
      this.eat();
      if (isConstant) {
        throw 'Must assign a value to a constant expression. No value provided'
      }
      return {kind: 'VariableDeclaration', identifier, constant: false} as VariableDeclaration
    }
    this.expect(TokenType.Equals, 'Expected equals token following identifier in var declaration.')
    const declaration = {
      kind: 'VariableDeclaration',
      value: this.parse_expression(),
      identifier,
      constant: isConstant
    } as VariableDeclaration

    this.expect(TokenType.SemiColon, 'Variable declaration must end with a semicolon')
    return declaration
  }
}
