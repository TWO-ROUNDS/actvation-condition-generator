import * as generator from "./src/generator/condition-generator.js";
import * as evaluator from "./src/evaluator/condition-evaluator.js";

modules.export = {
    CONDITION_VARIABLES: generator.CONDITION_VARIABLES,
    generateConditionWithBoolean: generator.generateConditionWithBoolean,
    generateConditionWithDates: generator.generateConditionWithDates,
    generateConditionWithVariable: generator.generateConditionWithVariable,
    evaluateCondition: evaluator.evaluateCondition,
};