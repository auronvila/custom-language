import {Program, VariableDeclaration} from "../../frontend/ast.ts";
import Environment from "../environment.ts";
import {MK_NULL, RuntimeVal} from "../values.ts";
import {evaluate} from "../interpreter.ts";


export function evaluate_var_declaration(declaration: VariableDeclaration, env: Environment): RuntimeVal {
  const value = declaration.value ? evaluate(declaration.value, env) : MK_NULL();
  return env.declareVar(declaration.identifier, value, declaration.constant)
}

export function evaluate_program(program: Program, env: Environment): RuntimeVal {
  let lastEvaluated: RuntimeVal = MK_NULL()
  for (const statement of program.body) {
    lastEvaluated = evaluate(statement, env);
  }
  return lastEvaluated
}
