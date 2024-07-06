import {MK_NULL, NumberVal, ObjectVal, RuntimeVal} from "../values.ts";
import {AssignmentExpression, BinaryExpression, Identifier, ObjectLiteral} from "../../frontend/ast.ts";
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

export function eval_assignment(node: AssignmentExpression, env: Environment): RuntimeVal {
  if (node.assigne.kind != 'Identifier') {
    throw `Invalid assignment expression ${JSON.stringify(node.assigne)}`
  }

  const varname = (node.assigne as Identifier).symbol
  return env.assignVar(varname, evaluate(node.value, env))
}

export function eval_object_expr(obj: ObjectLiteral, env: Environment): RuntimeVal {
  const object = {type: 'object', properties: new Map()} as ObjectVal;
  for (const {key, value} of obj.properties) {
    const runtimeVal = (value == undefined) ? env.lookUpVar(key) : evaluate(value, env);
    object.properties.set(key, runtimeVal)
  }
  return object
}
