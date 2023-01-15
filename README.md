# 🔨 actvation-condition-generator
LISP Style Activation Condition Generator & Parser for Two Rounds Application Service

## Installation
```
npm i actvation-condition-generator
```

## Example
```js
const condition = require("actvation-condition-generator");

// true
console.log(condition.generateConditionWithBoolean(true).value);

// (and (>= u 1640995200000) (<= u 1642204800000))
console.log(condition.generateConditionWithDates(new Date("2022-01-01"), new Date("2022-01-15")).value);

// (and (and (= y 2022) (= M 3)) (= D 13))
console.log(condition.generateConditionWithVariable(condition.CONDITION_VARIABLES.YEAR, "=", 2022)
      .and(condition.generateConditionWithVariable(condition.CONDITION_VARIABLES.MONTH, "=", 3))
      .and(condition.generateConditionWithVariable(condition.CONDITION_VARIABLES.DAY, "=", 13))
      .value);

// true when the current date is 2022-03-13
console.log(condition.evaluateCondition("(and (and (= y 2022) (= M 3)) (= D 13))"));
```