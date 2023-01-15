const evaluator = require("./condition-evaluator");

// Case 1: True or False
test("Case #1-1: True", () => {
  expect(evaluator.evaluateCondition(true)).toBe(true);
});

test("Case #1-2: False", () => {
  expect(evaluator.evaluateCondition(false)).toBe(false);
});

// Case 2: Unix Time
const nowDate = new Date();

test("Case #2-1: Unix Time (Variable First)", () => {
  expect(
    evaluator.evaluateCondition(
      "(and (>= u 1640995200000) (<= u 2410371560000))"
    )
  ).toBe(nowDate >= 1640995200000 && nowDate <= 2410371560000);
});

test("Case #2-2: Unix Time (Number First)", () => {
  expect(
    evaluator.evaluateCondition(
      "(and (<= 1640995991000 u) (>= 1642256530000 u))"
    )
  ).toBe(nowDate >= 1640995991000 && nowDate <= 1642256530000);
});

test("Case #2-3: Exceptional Case - Wrong Expression", () => {
  expect(() =>
    evaluator.evaluateCondition(
      "(and (>= 1640995991000 u ok) (<= 1642256530000 u))"
    )
  ).toThrow();
});

// Case 3: Using Variables
test("Case #3-1: Specific Year", () => {
  expect(evaluator.evaluateCondition("(= y 2023)")).toBe(
    nowDate.getFullYear() === 2023
  );
});

test("Case #3-2: Specific Week", () => {
  expect(evaluator.evaluateCondition("(= w 1)")).toBe(
    evaluator.getWeekNumOfMonth(nowDate) === 1
  );
});

test("Case #3-3: Every Weekends", () => {
  expect(evaluator.evaluateCondition("(>= d 5)")).toBe(nowDate.getDay() >= 5);
});

test("Case #3-4: Exceptional Case - Wrong Variable Expression", () => {
  expect(() => evaluator.evaluateCondition("(day == 130)")).toThrow();
});

// Case 4: Complex Condition
test("Case #4-1: Specific Date", () => {
  expect(
    evaluator.evaluateCondition("(and (and (= y 2022) (= M 3)) (= D 13))")
  ).toBe(
    nowDate.getFullYear === 2022 &&
      nowDate.getMonth() === 3 &&
      nowDate.getDate() === 13
  );
});

test("Case #4-2: Specific Season with Exception", () => {
  expect(
    evaluator.evaluateCondition("(and (and (>= M 3) (< M 6)) (not (= w 2)))")
  ).toBe(
    nowDate >= 3 && nowDate < 6 && evaluator.getWeekNumOfMonth(nowDate) !== 2
  );
});

// (2월과 8월의 둘째 주 금요일)과 (2022년 7월 8일 3시 44분 3초부터 2022년 9월 2일 4시 24분 5초 사이에서 금요일을 뺀 날)
test("Case #4-3: Very Complex Condition", () => {
  expect(
    evaluator.evaluateCondition(
      "(or (and (or (= M 2) (= M 8)) (and (= w 2) (= d 5))) (and (and (>= u 1657219443000) (<= u 1662060245000)) (not (= d 5))))"
    )
  ).toBe(
    ((nowDate.getMonth() === 2 || nowDate.getMonth() === 8) &&
      evaluator.getWeekNumOfMonth(nowDate) === 2 &&
      nowDate.getDay() === 5) ||
      (nowDate >= 1657219443000 &&
        nowDate <= 1662060245000 &&
        nowDate.getDay() !== 5)
  );
});
