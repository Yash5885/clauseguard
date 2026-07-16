import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateOverallRiskScore,
  classifyClauseRisk,
} from "../src/services/riskScoring.js";

test("similarity thresholds map clauses to safe, caution, and risky", () => {
  const base = {
    category: "Payment Terms",
    clauseText: "Payment is due after delivery.",
  };

  assert.equal(classifyClauseRisk({ ...base, similarity: 0.9 }), "safe");
  assert.equal(classifyClauseRisk({ ...base, similarity: 0.78 }), "caution");
  assert.equal(classifyClauseRisk({ ...base, similarity: 0.6 }), "risky");
  assert.equal(
    classifyClauseRisk({ ...base, category: "Uncategorized", similarity: null }),
    "risky",
  );
});

test("clearly one-sided terms override a high semantic similarity", () => {
  assert.equal(
    classifyClauseRisk({
      category: "Revisions",
      clauseText: "The freelancer will provide unlimited revisions at no additional fee.",
      similarity: 0.95,
    }),
    "risky",
  );
  assert.equal(
    classifyClauseRisk({
      category: "Kill Fee",
      clauseText: "No cancellation fee is payable if the client ends the project.",
      similarity: 0.91,
    }),
    "risky",
  );
  assert.equal(
    classifyClauseRisk({
      category: "Payment Terms",
      clauseText:
        "Payment is due after acceptance, which is determined in the Client's sole and absolute discretion.",
      similarity: 0.93,
    }),
    "risky",
  );
});

test("notable but non-extreme deviations become caution", () => {
  assert.equal(
    classifyClauseRisk({
      category: "Revisions",
      clauseText: "The fixed fee includes six revision rounds.",
      similarity: 0.94,
    }),
    "caution",
  );
});

test("overall risk score uses risky=3, caution=1, safe=0", () => {
  assert.equal(calculateOverallRiskScore(["safe", "caution", "risky"]), 4);
});
