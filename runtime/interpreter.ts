import {RuntimeVal, NumberVal, NullVal} from "./values.ts";
import {BinaryExpression, NumericLiteral, Program, Statement} from "../frontend/ast.ts";

function evaluate_program(program: Program): RuntimeVal {
  let lastEvaluated: RuntimeVal = {type: 'null', value: 'null'} as NullVal
  for (const statement of program.body) {
    lastEvaluated = evaluate(statement);
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

function evaluate_binary_expr(binop: BinaryExpression): RuntimeVal {
  const leftHandSide = evaluate(binop.left);
  const rightHandSide = evaluate(binop.right);

  if (leftHandSide.type == 'number' && rightHandSide.type == 'number') {
    return evaluate_numeric_expression(leftHandSide as NumberVal, rightHandSide as NumberVal, binop.operator);
  }

  return {type: 'null', value: 'null'} as NullVal
}

export function evaluate(astNode: Statement): RuntimeVal {
  switch (astNode.kind) {
    case "NumericLiteral":
      return {
        value: ((astNode as NumericLiteral).value),
        type: "number"
      } as NumberVal
    case 'NullLiteral' : {
      console.log(astNode)
      return {value: 'null', type: 'null'} as NullVal
    }
    case "BinaryExpression":
      return evaluate_binary_expr(astNode as BinaryExpression);
    case 'Program':
      return evaluate_program(astNode as Program)
    default:
      console.error('This ast node has not yet been setup for interpretation. ', astNode)
      Deno.exit(1)
  }
}
