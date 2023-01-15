const generator = require("./src/generator/condition-generator");
const evaluator = require("./src/evaluator/condition-evaluator");

module.exports = {
    CONDITION_VARIABLES: generator.CONDITION_VARIABLES,
    generateConditionWithBoolean: generator.generateConditionWithBoolean,
    generateConditionWithDates: generator.generateConditionWithDates,
    generateConditionWithVariable: generator.generateConditionWithVariable,
    evaluateCondition: evaluator.evaluateCondition,
};