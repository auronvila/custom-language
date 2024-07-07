import Parser from "./frontend/parser.ts";
import {evaluate} from "./runtime/interpreter.ts";
import Environment, {createGlobalEnv} from "./runtime/environment.ts";

async function runFile() {
  const parser = new Parser();
  const env = createGlobalEnv();

  console.log('Repl v0.1')
  const input = await Deno.readTextFile('test.txt')

  // check for no user input
  if (!input || input.includes('exit')) {
    Deno.exit(1)
  }

  // tokenize every character
  const program = parser.produceAst(input);
  // console.log(program);

  // interpret every token that is getting created
  const result = evaluate(program, env);
  console.log(result)
}

function repl() {
  const parser = new Parser();
  const env = createGlobalEnv();

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

runFile()
