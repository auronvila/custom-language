import {RuntimeVal, NumberVal} from "./values.ts";
import {
  AssignmentExpression,
  BinaryExpression,
  Identifier,
  NumericLiteral, ObjectLiteral,
  Program,
  Statement,
  VariableDeclaration
} from "../frontend/ast.ts";
import Environment from "./environment.ts";
import {eval_assignment, eval_identifier, eval_object_expr, evaluate_binary_expr} from "./eval/expressions.ts";
import {evaluate_program, evaluate_var_declaration} from "./eval/statements.ts";


export function evaluate(astNode: Statement, env: Environment): RuntimeVal {
  switch (astNode.kind) {
    case "NumericLiteral":
      return {
        value: ((astNode as NumericLiteral).value),
        type: "number"
      } as NumberVal
    case "BinaryExpression":
      return evaluate_binary_expr(astNode as BinaryExpression, env);
    case 'Identifier':
      return eval_identifier(astNode as Identifier, env)
    case "ObjectLiteral":
      return eval_object_expr(astNode as ObjectLiteral, env);
    case 'Program':
      return evaluate_program(astNode as Program, env)
    case 'AssignmentExpression':
      return eval_assignment(astNode as AssignmentExpression, env)
    case 'VariableDeclaration':
      return evaluate_var_declaration(astNode as VariableDeclaration, env)
    default:
      console.error('This ast node has not yet been setup for interpretation. ', astNode)
      Deno.exit(1)
  }
}

