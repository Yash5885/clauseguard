import { useState } from "react";

const RISK_STYLES = {
  safe: {
    badge: "bg-[#e5f3eb] text-[#317356]",
    border: "border-[#d7e8df]",
    accent: "bg-[#4f9b78]",
  },
  caution: {
    badge: "bg-[#fff1cf] text-[#966c18]",
    border: "border-[#ead8ab]",
    accent: "bg-[#d2a33f]",
  },
  risky: {
    badge: "bg-[#fbe2df] text-[#b94f55]",
    border: "border-[#ecc8c8]",
    accent: "bg-[#d46470]",
  },
};

function Chevron({ open }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 20 20"
    >
      <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function RiskBadge({ riskLabel }) {
  const label = riskLabel?.charAt(0).toUpperCase() + riskLabel?.slice(1);
  return (
    <span className={`rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] ${RISK_STYLES[riskLabel].badge}`}>
      {label}
    </span>
  );
}

function ClauseBody({ clause }) {
  const hasComparableCategory = clause.category !== "Uncategorized";

  return (
    <div className="mt-5">
      <blockquote className="text-base font-semibold leading-7 text-[#28222e] sm:text-[1.05rem]">
        “{clause.clauseText}”
      </blockquote>

      {clause.riskLabel !== "safe" && hasComparableCategory && (
        <>
          <div className="my-5 h-px bg-[#e8e3e9]" />
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#8891a6]">
            Why it matters
          </p>
          <p className="mt-2 text-sm leading-7 text-[#676170] sm:text-[0.95rem]">
            {clause.explanation ||
              "No plain-language explanation was returned for this clause. Review it manually before signing."}
          </p>
        </>
      )}
    </div>
  );
}

export default function ClauseCard({ clause }) {
  const isSafe = clause.riskLabel === "safe";
  const [isExpanded, setIsExpanded] = useState(!isSafe);
  const style = RISK_STYLES[clause.riskLabel] ?? RISK_STYLES.risky;

  return (
    <article className={`relative overflow-hidden rounded-[1.55rem] border bg-white p-5 shadow-[0_14px_36px_rgba(64,47,82,0.06)] sm:p-6 ${style.border}`}>
      <span className={`absolute inset-y-0 left-0 w-1 ${style.accent}`} />

      {isSafe ? (
        <button
          aria-expanded={isExpanded}
          className="w-full text-left"
          onClick={() => setIsExpanded((expanded) => !expanded)}
          type="button"
        >
          <span className="flex items-center justify-between gap-4">
            <span className="text-[0.7rem] font-bold uppercase tracking-[0.17em] text-[#7f889d]">
              {clause.category}
            </span>
            <span className="flex items-center gap-3 text-[#8a8391]">
              <RiskBadge riskLabel={clause.riskLabel} />
              <Chevron open={isExpanded} />
            </span>
          </span>
          {!isExpanded && (
            <span className="mt-3 block truncate text-sm text-[#756e7c]">
              {clause.clauseText}
            </span>
          )}
        </button>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.17em] text-[#7f889d]">
            {clause.category}
          </span>
          <RiskBadge riskLabel={clause.riskLabel} />
        </div>
      )}

      {isExpanded && <ClauseBody clause={clause} />}
    </article>
  );
}
