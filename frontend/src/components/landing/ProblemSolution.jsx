import Reveal from "./Reveal.jsx";

function ConfusionIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 40 40" className="h-8 w-8">
      <path
        d="M8 5.5h15l6 6V34H8z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path d="M23 5.5V12h6M13 16h9M13 21h6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <circle cx="25.5" cy="27" r="5" fill="#17191f" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m29 30.5 4.5 4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 40 40" className="h-8 w-8">
      <path
        d="m20 5 12 4.4v9.8c0 8.3-5 13.3-12 16-7-2.7-12-7.7-12-16V9.4z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="m14.2 20.3 3.8 3.8 7.8-8.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

const problemSignals = [
  "Dense legal wording hides the real trade-offs",
  "One-sided payment and IP terms look ordinary",
  "Professional review can be slow or out of reach",
];

export default function ProblemSolution() {
  return (
    <section
      className="mx-auto max-w-[1380px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32"
      id="why-clause-guard"
      aria-labelledby="problem-solution-heading"
    >
      <Reveal className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a849f]">
            The problem, made visible
          </p>
          <h2
            className="font-display mt-5 text-4xl font-semibold leading-[1.06] tracking-[-0.02em] text-[#17191f] sm:text-6xl"
            id="problem-solution-heading"
          >
            Contracts shouldn&apos;t need a law degree.
          </h2>
        </div>
        <p className="max-w-2xl text-base leading-7 text-[#636873] lg:justify-self-end lg:text-lg lg:leading-8">
          Freelancers deserve to see the balance of a deal before they commit—not
          after a payment dispute or surprise ownership clause.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-5 lg:grid-cols-2">
        <Reveal
          className="relative min-h-[520px] overflow-hidden rounded-[2rem] border border-transparent bg-[#17191f] p-7 text-white sm:p-10"
          delay={80}
        >
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full border border-[#929dbc]/30" />

          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between">
              <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-white/5 text-[#c4cada]">
                <ConfusionIcon />
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
                Without clarity
              </span>
            </div>

            <div className="mt-12">
              <p className="text-sm font-semibold text-[#aeb7ce]">The problem</p>
              <h3 className="font-display mt-3 max-w-md text-3xl font-semibold leading-[1.14] tracking-[-0.015em] sm:text-4xl">
                Unfair terms are easiest to miss when they sound official.
              </h3>
            </div>

            <div className="mt-auto space-y-3 pt-12">
              {problemSignals.map((signal, index) => (
                <div
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white/70"
                  key={signal}
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-[11px] font-bold text-white/75">
                    0{index + 1}
                  </span>
                  {signal}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal
          className="relative min-h-[520px] overflow-hidden rounded-[2rem] border border-[#17191f]/70 bg-[#dfe4f0] p-7 text-[#17191f] sm:p-10"
          delay={170}
        >
          <div className="absolute right-8 top-20 h-44 w-44 rounded-full border border-[#8e99b8]/40" />
          <div className="absolute right-20 top-32 h-44 w-44 rounded-full border border-[#8e99b8]/25" />

          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between">
              <span className="grid h-14 w-14 place-items-center rounded-2xl border border-[#17191f]/15 bg-white/50 text-[#17191f]">
                <ShieldIcon />
              </span>
              <span className="rounded-full border border-[#17191f]/20 bg-white/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5f6675]">
                With Clause Guard
              </span>
            </div>

            <div className="mt-12 max-w-md">
              <p className="text-sm font-semibold text-[#65708c]">The solution</p>
              <h3 className="font-display mt-3 text-3xl font-semibold leading-[1.14] tracking-[-0.015em] sm:text-4xl">
                Every clause, translated into a clear decision.
              </h3>
            </div>

            <div className="mt-auto pt-9">
              <div className="rotate-[-1deg] rounded-[1.5rem] border border-[#17191f]/20 bg-[#f8f8f4] p-5 shadow-[0_20px_45px_rgba(41,46,60,0.14)] sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#6c7280]">
                    Kill fee
                  </span>
                  <span className="rounded-full bg-[#f0d6d1] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#9b3f39]">
                    Risky
                  </span>
                </div>
                <p className="mt-4 text-lg font-semibold leading-7 tracking-[-0.02em]">
                  “No cancellation fee applies after work begins.”
                </p>
                <div className="mt-5 border-t border-[#17191f]/10 pt-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7b849a]">
                    Why it matters
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#5d636f]">
                    Fair agreements protect reserved time with a reasonable kill
                    fee. This clause leaves completed preparation unpaid.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
