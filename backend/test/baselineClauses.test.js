import assert from "node:assert/strict";
import test from "node:test";
import {
  BASELINE_CATEGORIES,
  baselineClauses,
  baselineClausesByCategory,
} from "../src/data/baselineClauses.js";

test("baseline catalog contains 15-20 complete clauses in every required category", () => {
  assert.deepEqual(Object.keys(baselineClausesByCategory), BASELINE_CATEGORIES);

  for (const category of BASELINE_CATEGORIES) {
    const clauses = baselineClausesByCategory[category];
    assert.ok(clauses.length >= 15 && clauses.length <= 20, category);

    for (const clause of clauses) {
      assert.ok(clause.clauseText.length >= 80, `${category}: clause is too short`);
      assert.ok(clause.principle.length >= 20, `${category}: principle is too short`);
      assert.doesNotMatch(clause.clauseText, /TODO|placeholder/i);
    }
  }
});

test("baseline catalog has 128 unique category/clause pairs", () => {
  const uniqueClauses = new Set(
    baselineClauses.map(
      ({ category, clauseText }) => `${category}\u0000${clauseText}`,
    ),
  );

  assert.equal(baselineClauses.length, 128);
  assert.equal(uniqueClauses.size, baselineClauses.length);
});
