export enum TokenType {
  Number,
  Identifier,
  String,
  Equals,
  Dot,
  Comma,
  Colon,
  OpenBracket, // [
  CloseBracket, // ]
  OpenBrace, // {
  CloseBrace, // }
  OpenParen, // (
  CloseParen, // )
  SemiColon,
  BinaryOperator,
  Let,
  Const,
  EOF, // signified end of the file
}

const RESERVED_KEYWORDS: Record<string, TokenType> = {
  'let': TokenType.Let,
  'const': TokenType.Const,
}

export interface Token {
  value: string;
  type: TokenType;
}


function token(value = '', type: TokenType): Token {
  return {value, type};
}

function isAlpha(src: string) {
  return src.toUpperCase() != src.toLowerCase();
}

function isInt(str: string) {
  const c = str.charCodeAt(0);
  const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
  return (c >= bounds[0] && c <= bounds[1]);
}

function isSkippable(str: string) {
  return str == ' ' || str == '\n' || str == '\t' || str == '\r';
}

export function tokenize(sourceCode: string): Token[] {
  const tokens = new Array<Token>();
  const src = sourceCode.split(''); // getting every single character

  // build each token
  while (src.length > 0) {
    // handle single character token
    if (src[0] == '(') {
      tokens.push(token(src.shift(), TokenType.OpenParen));
    } else if (src[0] == ')') {
      tokens.push(token(src.shift(), TokenType.CloseParen));
    } else if (src[0] == ':') {
      tokens.push(token(src.shift(), TokenType.Colon));
    } else if (src[0] == ',') {
      tokens.push(token(src.shift(), TokenType.Comma));
    } else if (src[0] == '{') {
      tokens.push(token(src.shift(), TokenType.OpenBrace));
    } else if (src[0] == '}') {
      tokens.push(token(src.shift(), TokenType.CloseBrace));
    } else if (src[0] == '[') {
      tokens.push(token(src.shift(), TokenType.OpenBracket));
    } else if (src[0] == ']') {
      tokens.push(token(src.shift(), TokenType.CloseBracket));
    } else if (src[0] == '+' || src[0] == '-' || src[0] == '*' || src[0] == '/' || src[0] == '%') {
      tokens.push(token(src.shift(), TokenType.BinaryOperator));
    } else if (src[0] == '=') {
      tokens.push(token(src.shift(), TokenType.Equals));
    } else if (src[0] == ';') {
      tokens.push(token(src.shift(), TokenType.SemiColon))
    } else if (src[0] == '.') {
      tokens.push(token(src.shift(), TokenType.Dot));
    } else {
      // handle multi character tokens e.x >=, <=

      // build number token
      if (isInt(src[0])) {
        let num = '';
        while (src.length > 0 && isInt(src[0])) {
          num += src.shift();
        }

        tokens.push(token(num, TokenType.Number));
      } else if (isAlpha(src[0])) {
        let ident = '';
        while (src.length > 0 && isAlpha(src[0])) {
          ident += src.shift();
        }

        // check for reserved keywords
        const reserved = RESERVED_KEYWORDS[ident]
        if (typeof reserved == 'number') {
          tokens.push(token(ident, reserved));
        } else {
          tokens.push(token(ident, TokenType.Identifier));
        }
      } else if (isSkippable(src[0])) {
        src.shift(); // skip the current character
      } else {
        console.log(`Unrecognized character found in source: ----> ${src[0]}`);
        Deno.exit(1);
      }
    }
  }

  tokens.push({type: TokenType.EOF, value: 'EndOfFile'})
  return tokens
}


// const source = await Deno.readTextFile('./test.txt');
// for (const token of tokenize(source)) {
//   console.log(token)
// }
