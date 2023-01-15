/**
 * @fileoverview condition evaluator
 * @author CaChiJ
 * @originalcode https://github.com/TWO-ROUNDS/two-rounds-api-server/blob/main/app/util/condition-evaluator.js
 */

const lisp = require("./lisp-parser");

const values = {
  true: () => true,
  false: () => false,
  u: () => new Date().getTime(),
  y: () => new Date().getFullYear(),
  M: () => new Date().getMonth() + 1,
  D: () => new Date().getDate(),
  h: () => new Date().getHours(),
  m: () => new Date().getMinutes(),
  s: () => new Date().getSeconds(),
  w: () => getWeekNumOfMonth(new Date()),
  d: () => new Date().getDay(),
};

/**
 * get week number of month
 * @param {Date} date date to get week number
 * @returns {number} result
 */
function getWeekNumOfMonth(date) {
  var THURSDAY_NUM = 4; // 첫째주의 기준은 목요일(4)이다. (https://info.singident.com/60)

  var firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
  var firstDayOfWeek = firstDate.getDay();

  var firstThursday = 1 + THURSDAY_NUM - firstDayOfWeek; // 첫째주 목요일
  if (firstThursday <= 0) {
    firstThursday = firstThursday + 7; // 한주는 7일
  }
  var untilDateOfFirstWeek = firstThursday - 7 + 3; // 월요일기준으로 계산 (월요일부터 한주의 시작)
  var weekNum = Math.ceil((date.getDate() - untilDateOfFirstWeek) / 7) - 1;

  if (weekNum < 0) {
    // 첫째주 이하일 경우 전월 마지막주 계산
    var lastDateOfMonth = new Date(date.getFullYear(), date.getMonth(), 0);
    var result = Util.Date.weekNumOfMonth(lastDateOfMonth);
    return result;
  }

  return weekNum + 1;
}

const binary_operators = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
  "%": (a, b) => a % b,
  "=": (a, b) => a === b,
  "<=": (a, b) => a <= b,
  "<": (a, b) => a < b,
  ">=": (a, b) => a >= b,
  ">": (a, b) => a > b,
  and: (a, b) => a && b,
  or: (a, b) => a || b,
};

const unary_operators = {
  not: (a) => !a,
};

function evaluateParts(parts) {
  if (Array.isArray(parts)) {
    if (parts.length === 1) {
      return values[parts[0]]();
    } else if (parts.length === 2) {
      const operator = unary_operators[parts[0]];
      return operator(evaluateParts(parts[1]));
    } else if (parts.length === 3) {
      const operator = binary_operators[parts[0]];
      return operator(evaluateParts(parts[1]), evaluateParts(parts[2]));
    }
    throw `condition-evaluator: unexpected expression : too many parts`;
  } else {
    if (values[parts] !== undefined) {
      return values[parts]();
    }
    return parts;
  }
}

/**
 * evaluate activate condition expression to boolean
 * @param {string} expression string expression
 * @throws {string} unexpected expression
 * @returns {boolean} evaluated result
 */
function evaluateCondition(expression) {
  const parent = RegExp(/^\s*\(/).exec(expression);

  if (parent === null) {
    return values[expression]();
  }

  const parts = lisp.parser(lisp.tokenizer(lisp.rules))(expression);
  return evaluateParts(parts);
}

module.exports = {
  getWeekNumOfMonth: getWeekNumOfMonth,
  evaluateCondition: evaluateCondition,
};
