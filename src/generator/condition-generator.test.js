const generator = require("./condition-generator");

// Case 1: True or False
test("Case #1-1: True", () => {
  expect(generator.generateConditionWithBoolean(true).value).toBe("true");
});

test("Case #1-2: False", () => {
  expect(generator.generateConditionWithBoolean(false).value).toBe("false");
});

// Case 2: Date Range
test("Case #2-1: Date Range In Same Month", () => {
  expect(
    generator.generateConditionWithDates(
      new Date("2022-01-01"),
      new Date("2022-01-15")
    ).value
  ).toBe("(and (>= u 1640995200000) (<= u 1642204800000))");
});

test("Case #2-2: DateTime Range", () => {
  expect(
    generator.generateConditionWithDates(
      new Date("2022-01-01 09:13:11"),
      new Date("2022-01-15 23:22:10")
    ).value
  ).toBe("(and (>= u 1640995991000) (<= u 1642256530000))");
});

test("Case #2-3: Exceptional Case - End Before Start", () => {
  expect(
    () =>
      generator.generateConditionWithDates(
        new Date("2022-02-01 09:13:11"),
        new Date("2022-01-15 23:22:10")
      ).value
  ).toThrow();
});

// Case 3: Using Variables
test("Case #3-1: Specific Year", () => {
  expect(
    generator.generateConditionWithVariable(
      generator.CONDITION_VARIABLES.YEAR,
      "=",
      2021
    ).value
  ).toBe("(= y 2021)");
});

test("Case #3-2: Specific Week", () => {
  expect(
    generator.generateConditionWithVariable(
      generator.CONDITION_VARIABLES.WEEK,
      "=",
      1
    ).value
  ).toBe("(= w 1)");
});

test("Case #3-3: Every Fridays and Saturdays", () => {
  expect(
    generator.generateConditionWithVariable(
      generator.CONDITION_VARIABLES.DAY_OF_WEEK,
      ">=",
      5
    ).value
  ).toBe("(>= d 5)");
});

test("Case #3-4: Exceptional Case - Wrong Variable/Operator", () => {
  expect(
    () => generator.generateConditionWithVariable("day", "==", 0).value
  ).toThrow();
});

// Case 4: Complex Condition
test("Case #4-1: Specific Date", () => {
  expect(
    generator
      .generateConditionWithVariable(
        generator.CONDITION_VARIABLES.YEAR,
        "=",
        2022
      )
      .and(
        generator.generateConditionWithVariable(
          generator.CONDITION_VARIABLES.MONTH,
          "=",
          3
        )
      )
      .and(
        generator.generateConditionWithVariable(
          generator.CONDITION_VARIABLES.DAY,
          "=",
          13
        )
      ).value
  ).toBe("(and (and (= y 2022) (= M 3)) (= D 13))");
});

test("Case #4-2: Specific Season with Exception", () => {
  expect(
    generator
      .generateConditionWithVariable(
        generator.CONDITION_VARIABLES.MONTH,
        ">=",
        3
      )
      .and(
        generator.generateConditionWithVariable(
          generator.CONDITION_VARIABLES.MONTH,
          "<",
          6
        )
      )
      .and(
        generator
          .generateConditionWithVariable(
            generator.CONDITION_VARIABLES.WEEK,
            "=",
            2
          )
          .not()
      ).value
  ).toBe("(and (and (>= M 3) (< M 6)) (not (= w 2)))");
});

// (2월과 8월의 둘째 주 금요일)과 (2022년 7월 8일 3시 44분 3초부터 2022년 9월 2일 4시 24분 5초 사이에서 금요일을 뺀 날)
test("Case #4-3: Very Complex Condition", () => {
  const left = generator
    .generateConditionWithVariable(generator.CONDITION_VARIABLES.MONTH, "=", 2)
    .or(
      generator.generateConditionWithVariable(
        generator.CONDITION_VARIABLES.MONTH,
        "=",
        8
      )
    )
    .and(
      generator
        .generateConditionWithVariable(
          generator.CONDITION_VARIABLES.WEEK,
          "=",
          2
        )
        .and(
          generator.generateConditionWithVariable(
            generator.CONDITION_VARIABLES.DAY_OF_WEEK,
            "=",
            5
          )
        )
    );

  const right = generator
    .generateConditionWithVariable(
      generator.CONDITION_VARIABLES.UNIX,
      ">=",
      new Date("2022-07-08 03:44:03").getTime()
    )
    .and(
      generator.generateConditionWithVariable(
        generator.CONDITION_VARIABLES.UNIX,
        "<=",
        new Date("2022-09-02 04:24:05").getTime()
      )
    )
    .and(
      generator
        .generateConditionWithVariable(
          generator.CONDITION_VARIABLES.DAY_OF_WEEK,
          "=",
          5
        )
        .not()
    );

  expect(left.value).toBe("(and (or (= M 2) (= M 8)) (and (= w 2) (= d 5)))");
  expect(right.value).toBe(
    "(and (and (>= u 1657219443000) (<= u 1662060245000)) (not (= d 5)))"
  );
  expect(left.or(right).value).toBe(
    "(or (and (or (= M 2) (= M 8)) (and (= w 2) (= d 5))) (and (and (>= u 1657219443000) (<= u 1662060245000)) (not (= d 5))))"
  );
});
