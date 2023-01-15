/**
 * @fileoverview condition generator
 */

/**
 * condition variables for generate condition
 */
export const CONDITION_VARIABLES = {
  UNIX: "u",
  YEAR: "y",
  MONTH: "M",
  DAY: "D",
  HOUR: "h",
  MINUTE: "m",
  SECOND: "s",
  WEEK: "w",
  DAY_OF_WEEK: "d",
};
Object.freeze(CONDITION_VARIABLES);

/**
 * condition class
 * @param {string} value string value of the condition
 */
export let Condition = class {
  #value = "";

  /**
   * condition's constructor
   * @param {string} value string value of the condition
   */
  constructor(value) {
    this.#value = value;
  }

  get value() {
    return this.#value;
  }

  /**
   * combine two conditions with and operation
   * @param {Condition} anotherCondition another condition to combine
   * @returns {Condition} result of the operation
   */
  and(anotherCondition) {
    return new Condition(`(and ${this.value} ${anotherCondition.value})`);
  }

  /**
   * combine two conditions with or operation
   * @param {Condition} anotherCondition another condition to combine
   * @returns {Condition} result of the operation
   */
  or(anotherCondition) {
    return new Condition(`(or ${this.value} ${anotherCondition.value})`);
  }

  /**
   * reverse the condition
   * @returns {Condition} result of the operation
   */
  not() {
    return new Condition(`(not ${this.value})`);
  }
};

/**
 * generate activate condition with boolean
 * @param {boolean} boolean is activated
 * @returns {Condition} generated condition
 */
export function generateConditionWithBoolean(boolean) {
  return new Condition(boolean ? "true" : "false");
}

/**
 * generate activate condition with start date and end date.
 * @param {Date} startDate start date of activation
 * @param {Date} endDate end date of activation
 * @returns {Condition} generated condition
 */
export function generateConditionWithDates(startDate, endDate) {
  if (startDate > endDate) {
    throw "The startDate must be prior than the endDate.";
  }

  const variable = CONDITION_VARIABLES.UNIX;

  return new Condition(
    `(and (>= ${variable} ${startDate.getTime()}) (<= ${variable} ${endDate.getTime()}))`
  );
}

/**
 * generate activate condition with variable, operation, and value
 * @param {string} variable one of CONDITION_VARIABLES
 * @param {string} operation =, <=, >=, <, or >
 * @param {number} value value to use operation
 * @returns {Condition} generated condition
 */
export function generateConditionWithVariable(variable, operation, value) {
  if (!Object.values(CONDITION_VARIABLES).includes(variable)) {
    throw `Variable ${variable} is not defined. Please check the 'CONDITION_VARIABLES'.`;
  } else if (!["=", "<=", ">=", "<", ">"].includes(operation)) {
    throw `Operation ${operation} is not defined. Only '=', '<=', '>=', '<', '>' can be used.`;
  }
  return new Condition(`(${operation} ${variable} ${value})`);
}
