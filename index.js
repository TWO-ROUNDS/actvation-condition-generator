const generator = require("./src/evaluator/condition-generator");
const evaluator = require("./src/evaluator/condition-evaluator");

modules.exports = {
    CONDITION_VARIABLES: generator.CONDITION_VARIABLES,
    generateConditionWithBoolean: generator.generateConditionWithBoolean,
    generateConditionWithDates: generator.generateConditionWithDates,
    generateConditionWithVariable: generator.generateConditionWithVariable,
    evaluateCondition: evaluator.evaluateCondition,
};