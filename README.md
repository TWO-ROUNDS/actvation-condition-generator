# 🔨 actvation-condition-generator
LISP Style Activation Condition Generator & Parser for Two Rounds Application Service

## Installation
```
npm i actvation-condition-generator
```

## Example
```js
import {
  CONDITION_VARIABLES,
  generateConditionWithBoolean,
  generateConditionWithDates,
  generateConditionWithVariable,
  evaluateCondition,
} from "actvation-condition-generator";

// true
console.log(generateConditionWithBoolean(true).value);

// (and (>= u 1640995200000) (<= u 1642204800000))
console.log(generateConditionWithDates(new Date("2022-01-01"), new Date("2022-01-15")).value);

// (and (and (= y 2022) (= M 3)) (= D 13))
console.log(generateConditionWithVariable(CONDITION_VARIABLES.YEAR, "=", 2022)
      .and(generateConditionWithVariable(CONDITION_VARIABLES.MONTH, "=", 3))
      .and(generateConditionWithVariable(CONDITION_VARIABLES.DAY, "=", 13))
      .value);

// true when the current date is 2022-03-13
console.log(evaluateCondition("(and (and (= y 2022) (= M 3)) (= D 13))"));
```