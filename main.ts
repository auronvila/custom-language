import Parser from "./frontend/parser.ts";
import {evaluate} from "./runtime/interpreter.ts";
import Environment from "./runtime/environment.ts";
import {MK_BOOL, MK_NULL, MK_NUMBER} from "./runtime/values.ts";

function repl() {
  const parser = new Parser();
  const env = new Environment();
  env.declareVar('x', MK_NUMBER(100), true)
  env.declareVar('true', MK_BOOL(true), true)
  env.declareVar('false', MK_BOOL(false), true)
  env.declareVar('null', MK_NULL(), true)
  console.log('Repl v0.1')
  while (true) {
    const input = prompt('> ')

    // check for no user input
    if (!input || input.includes('exit')) {
      Deno.exit(1)
    }

    // tokenize every character
    const program = parser.produceAst(input);
    console.log(program);

    // interpret every token that is getting created
    const result = evaluate(program, env);
    console.log(result)
  }
}

repl()
