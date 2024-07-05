import {RuntimeVal, NumberVal, MK_NULL} from "./values.ts";
import {BinaryExpression, Identifier, NumericLiteral, Program, Statement} from "../frontend/ast.ts";
import Environment from "./environment.ts";

function evaluate_program(program: Program, env: Environment): RuntimeVal {
  let lastEvaluated: RuntimeVal = MK_NULL()
  for (const statement of program.body) {
    lastEvaluated = evaluate(statement, env);
  }
  return lastEvaluated
}

function evaluate_numeric_expression(leftHandSide: NumberVal, rightHandSide: NumberVal, operator: string): NumberVal {
  let result = 0;

  if (operator == '+') {
    result = leftHandSide.value + rightHandSide.value;
  } else if (operator == '-') {
    result = leftHandSide.value - rightHandSide.value;
  } else if (operator == '*') {
    result = leftHandSide.value * rightHandSide.value;
  } else if (operator == '/') {
    // todo division by zero checks
    result = leftHandSide.value / rightHandSide.value;
  } else {
    result = leftHandSide.value % rightHandSide.value;
  }

  return {value: result, type: 'number'}
}

function evaluate_binary_expr(binop: BinaryExpression, env: Environment): RuntimeVal {
  const leftHandSide = evaluate(binop.left, env);
  const rightHandSide = evaluate(binop.right, env);

  if (leftHandSide.type == 'number' && rightHandSide.type == 'number') {
    return evaluate_numeric_expression(leftHandSide as NumberVal, rightHandSide as NumberVal, binop.operator);
  }

  return MK_NULL()
}

function eval_identifier(ident: Identifier, env: Environment): RuntimeVal {
  const val = env.lookUpVar(ident.symbol);
  return val
}

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
    case 'Program':
      return evaluate_program(astNode as Program, env)
    default:
      console.error('This ast node has not yet been setup for interpretation. ', astNode)
      Deno.exit(1)
  }
}
