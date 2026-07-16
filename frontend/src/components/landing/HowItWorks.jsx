import Reveal from "./Reveal.jsx";

function UploadIcon() {
  return (
    <svg fill="none" viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
      <path
        d="M7 20.5V25h18v-4.5M16 22V6m0 0-6 6m6-6 6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function AnalyzeIcon() {
  return (
    <svg fill="none" viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
      <circle cx="14" cy="14" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m19 19 6 6M11 14h6m-3-3v6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ReviewIcon() {
  return (
    <svg fill="none" viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
      <path
        d="M8 5.5h12l4 4V26H8z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path d="M20 5.5V10h4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 14h8m-8 4h8m-8 4h5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ConfidenceIcon() {
  return (
    <svg fill="none" viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
      <path
        d="m16 4 10 3.7v8.2c0 6.9-4.2 11.1-10 13.3-5.8-2.2-10-6.4-10-13.3V7.7z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="m11.2 16 3.2 3.2 6.5-6.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

const steps = [
  {
    description: "Drop in a PDF or DOCX. Your contract stays tied to your secure account.",
    icon: UploadIcon,
    title: "Upload",
  },
  {
    description: "Clause Guard separates the agreement into clauses and compares each one fairly.",
    icon: AnalyzeIcon,
    title: "Analyze",
  },
  {
    description: "See safe, caution, and risky terms with a plain-language explanation.",
    icon: ReviewIcon,
    title: "Review risks",
  },
  {
    description: "Ask better questions, negotiate clearly, and move forward on your terms.",
    icon: ConfidenceIcon,
    title: "Sign with confidence",
  },
];

export default function HowItWorks() {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8" id="how-it-works">
      <div className="mx-auto max-w-[1380px] overflow-hidden rounded-[2rem] bg-[#e8ebf3] px-6 py-20 sm:px-10 lg:rounded-[2.75rem] lg:px-14 lg:py-28 xl:px-20">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#74809e]">
              How it works
            </p>
            <h2 className="font-display mt-5 max-w-3xl text-4xl font-semibold leading-[1.06] tracking-[-0.02em] text-[#17191f] sm:text-6xl">
              From fine print to a clear next step.
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-[#636a78]">
            A focused review in four simple steps—without burying you in more
            legal language.
          </p>
        </Reveal>

        <div className="relative mt-16 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="absolute left-[12%] right-[12%] top-10 hidden border-t border-dashed border-[#8f99b2]/50 xl:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <Reveal
                className="relative rounded-[1.5rem] border border-[#17191f]/10 bg-[#f8f8f4] p-6 shadow-[0_16px_35px_rgba(43,49,64,0.07)]"
                delay={index * 110}
                key={step.title}
              >
                <div className="relative flex items-center justify-between">
                  <span className="grid h-20 w-20 place-items-center rounded-[1.35rem] border border-[#17191f]/15 bg-white text-[#17191f] shadow-[0_9px_22px_rgba(29,32,41,0.08)]">
                    <Icon />
                  </span>
                  <span className="text-sm font-bold tracking-[0.12em] text-[#a0a7b6]">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-10 text-xl font-semibold tracking-[-0.03em] text-[#17191f]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#686e79]">
                  {step.description}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
