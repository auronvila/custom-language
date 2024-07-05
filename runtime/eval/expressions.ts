import {MK_NULL, NumberVal, RuntimeVal} from "../values.ts";
import {BinaryExpression, Identifier} from "../../frontend/ast.ts";
import Environment from "../environment.ts";
import {evaluate} from "../interpreter.ts";

export function evaluate_numeric_expression(leftHandSide: NumberVal, rightHandSide: NumberVal, operator: string): NumberVal {
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

export function evaluate_binary_expr(binop: BinaryExpression, env: Environment): RuntimeVal {
  const leftHandSide = evaluate(binop.left, env);
  const rightHandSide = evaluate(binop.right, env);

  if (leftHandSide.type == 'number' && rightHandSide.type == 'number') {
    return evaluate_numeric_expression(leftHandSide as NumberVal, rightHandSide as NumberVal, binop.operator);
  }

  return MK_NULL()
}

export function eval_identifier(ident: Identifier, env: Environment): RuntimeVal {
  const val = env.lookUpVar(ident.symbol);
  return val
}
