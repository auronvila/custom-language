import {RuntimeVal} from "./values.ts";

export default class Environment {
  private parent?: Environment
  private variables: Map<string, RuntimeVal>;
  private constants: Set<string>;

  constructor(parentEnv?: Environment) {
    this.parent = parentEnv;
    this.variables = new Map()
    this.constants = new Set();
  }

  public declareVar(varName: string, value: RuntimeVal, constant: boolean): RuntimeVal {
    if (this.variables.has(varName)) {
      throw `Cannot declare variable ${varName}. As it already is defined`
    }

    if (constant) {
      this.constants.add(varName)
    }
    this.variables.set(varName, value);
    return value;
  }

  public assignVar(varName: string, value: RuntimeVal): RuntimeVal {
    // Cannot assign to a constant
    if (this.constants.has(varName)) {
      throw `Cannot reassign to a ${varName} as it was declared as a constant`;
    }

    const env = this.resolve(varName);
    env.variables.set(varName, value);
    return value
  }

  public lookUpVar(varName: string): RuntimeVal {
    const env = this.resolve(varName);
    return env.variables.get(varName) as RuntimeVal;
  }

  public resolve(varName: string): Environment {
    if (this.variables.has(varName)) {
      return this;
    }
    if (this.parent == undefined) {
      throw `Cannot resolve ${varName} it does not exist`
    }

    return this.parent.resolve(varName)
  }
}
