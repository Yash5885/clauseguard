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
  assert.equal(classifyClauseRisk({ ...base, similarity: 0.85 }), "caution");
  assert.equal(classifyClauseRisk({ ...base, similarity: 0.78 }), "risky");
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
  assert.equal(
    classifyClauseRisk({
      category: "Liability",
      clauseText:
        "The Contractor's liability is unlimited and includes lost profits and all legal fees.",
      similarity: 0.96,
    }),
    "risky",
  );
  assert.equal(
    classifyClauseRisk({
      category: "Liability",
      clauseText:
        "The Contractor will indemnify the Client from every claim or loss, even when caused partly by the Client.",
      similarity: 0.94,
    }),
    "risky",
  );
  assert.equal(
    classifyClauseRisk({
      category: "Termination",
      clauseText:
        "The Client may terminate at any time without cause, while the Contractor may terminate only after sixty days' notice.",
      similarity: 0.92,
    }),
    "risky",
  );
  assert.equal(
    classifyClauseRisk({
      category: "Liability",
      clauseText:
        "10. Indemnity\nThe Contractor will indemnify the Client from every claim or loss,\neven when caused partly by the Client.",
      similarity: 0.94,
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
  assert.equal(
    classifyClauseRisk({
      category: "Payment Terms",
      clauseText: "The Client will pay each invoice within 60 calendar days.",
      similarity: 0.93,
    }),
    "caution",
  );
  assert.equal(
    classifyClauseRisk({
      category: "Termination",
      clauseText:
        "The agreement automatically renews for one year unless either party gives sixty days' notice.",
      similarity: 0.92,
    }),
    "caution",
  );
});

test("overall risk score uses risky=3, caution=1, safe=0", () => {
  assert.equal(calculateOverallRiskScore(["safe", "caution", "risky"]), 4);
});
