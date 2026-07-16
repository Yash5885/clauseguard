import { UNCATEGORIZED } from "./segmentation.js";

// Calibrated against the stored Gemini embedding distribution: fair clauses in
// the regression corpus cluster at 0.89+, while moderate deviations generally
// land between 0.82 and 0.89. Explicit one-sided wording still overrides score.
export const SAFE_SIMILARITY_THRESHOLD = 0.89;
export const CAUTION_SIMILARITY_THRESHOLD = 0.82;
export const RISK_WEIGHTS = { safe: 0, caution: 1, risky: 3 };

const CLEARLY_ONE_SIDED_PATTERNS = {
  "Payment Terms": [
    /(acceptance|approval).{0,120}(sole|absolute).{0,30}discretion/i,
    /withhold.{0,80}(entire|full) invoice.{0,100}(portion|amount).{0,30}disputed/i,
    /paid only if.{0,100}(client|customer).{0,30}(pays|approves|accepts)/i,
    /payment.{0,60}(90|120|180) days/i,
  ],
  "IP Rights": [
    /all (?:ideas|concepts|work|materials).{0,120}(before|prior|after|future)/i,
    /(perpetual|irrevocable).{0,100}(without|no) (?:additional )?compensation/i,
    /waiv(?:e|es).{0,60}(moral rights|attribution)/i,
  ],
  Termination: [
    /terminate.{0,100}without.{0,50}(payment|compensation)/i,
    /client may terminate.{0,100}(at any time|immediately).{0,100}freelancer may not/i,
    /client may terminate.{0,100}(at any time|without cause).{0,180}(contractor|freelancer).{0,60}(may terminate only|only after|must give)/i,
    /terminate.{0,120}refund.{0,100}(all amounts|completed work|approved work)/i,
  ],
  Liability: [
    /unlimited liability/i,
    /liability.{0,40}(is|will be|remains) unlimited/i,
    /indemnif(?:y|ies).{0,120}(any and all|all claims).{0,100}regardless/i,
    /indemnif(?:y|ies).{0,140}(every|all|any).{0,40}(claim|loss|damage).{0,200}(even when|regardless|caused partly by the client)/i,
    /client.{0,40}(has|assumes) no liability/i,
  ],
  Revisions: [
    /unlimited revisions/i,
    /revisions.{0,80}until.{0,50}(sole|complete|full) satisfaction.{0,80}(no|without) additional/i,
  ],
  Confidentiality: [
    /confidential.{0,100}in perpetuity.{0,100}(whether|including).{0,50}public/i,
    /freelancer.{0,80}confidential.{0,120}client.{0,80}(no obligation|not bound)/i,
  ],
  "Kill Fee": [
    /no (?:kill|cancellation|termination) fee/i,
    /waiv(?:e|es).{0,60}(?:kill|cancellation|termination) fee/i,
    /cancel.{0,100}without.{0,50}(fee|compensation|payment)/i,
  ],
  "Late Payment Penalty": [
    /no (?:late fee|interest|penalty).{0,80}(late|overdue|past due)/i,
    /waiv(?:e|es).{0,60}(?:late fee|interest|penalty)/i,
  ],
};

const NOTABLE_DEVIATION_PATTERNS = {
  "Payment Terms": [
    /\bpay\w*.{0,100}(?:45|60|forty-five|sixty) (?:calendar )?days/i,
  ],
  Termination: [
    /automatically renews?.{0,180}(?:30|45|60|90|thirty|forty-five|sixty|ninety) days?.{0,100}notice/i,
  ],
  Liability: [
    /contractor.{0,120}(?:indemnif|hold harmless).{0,100}client/i,
  ],
  Revisions: [
    /\b(four|five|six|seven|eight|nine|ten|[4-9]|10) (?:included )?revision rounds?\b/i,
    /additional rounds?.{0,100}(half|one-half|50%).{0,50}(normal|standard|usual).{0,30}rate/i,
  ],
};

export function hasClearlyOneSidedLanguage(category, clauseText) {
  const normalizedClause = clauseText?.replace(/\s+/g, " ").trim() ?? "";

  return (CLEARLY_ONE_SIDED_PATTERNS[category] ?? []).some((pattern) =>
    pattern.test(normalizedClause),
  );
}

export function hasNotableDeviation(category, clauseText) {
  const normalizedClause = clauseText?.replace(/\s+/g, " ").trim() ?? "";

  return (NOTABLE_DEVIATION_PATTERNS[category] ?? []).some((pattern) =>
    pattern.test(normalizedClause),
  );
}

export function classifyClauseRisk({ category, clauseText, similarity }) {
  if (
    category === UNCATEGORIZED ||
    similarity === null ||
    similarity === undefined ||
    !Number.isFinite(similarity)
  ) {
    return "risky";
  }

  if (hasClearlyOneSidedLanguage(category, clauseText)) {
    return "risky";
  }

  if (similarity < CAUTION_SIMILARITY_THRESHOLD) {
    return "risky";
  }

  if (hasNotableDeviation(category, clauseText)) {
    return "caution";
  }

  if (similarity >= SAFE_SIMILARITY_THRESHOLD) {
    return "safe";
  }

  return "caution";
}

export function calculateOverallRiskScore(riskLabels) {
  return riskLabels.reduce((score, label) => score + RISK_WEIGHTS[label], 0);
}
