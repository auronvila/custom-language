export type ValueType = 'null' | 'number' | 'boolean'

export interface RuntimeVal {
  type: ValueType;
}

export interface NullVal extends RuntimeVal {
  type: 'null';
  value: null;
}

export interface NumberVal extends RuntimeVal {
  type: "number";
  value: number;
}

export interface BoolVal extends RuntimeVal {
  type: "boolean";
  value: boolean;
}

export function MK_NULL() {
  return {type: 'null', value: null} as NullVal
}

export function MK_NUMBER(val = 0) {
  return {type: 'number', value: val} as NumberVal
}

export function MK_BOOL(val = true) {
  return {type: 'boolean', value: val} as BoolVal
}
