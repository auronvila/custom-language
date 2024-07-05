import Parser from "./frontend/parser.ts";

function repl() {
  const parser = new Parser();
  console.log('Repl v0.1')
  while (true) {
    const input = prompt('> ')

    // check for no user input
    if (!input || input.includes('exit')) {
      Deno.exit(1)
    }

    const program = parser.produceAst(input);
    console.log(program);
  }
}

repl()
