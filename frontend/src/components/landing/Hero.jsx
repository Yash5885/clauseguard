import { Link } from "react-router-dom";
import ContractIllustration from "./ContractIllustration.jsx";
import Reveal from "./Reveal.jsx";

function ArrowIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 18 18" className="h-4 w-4">
      <path
        d="M3.75 9h10.5m-4-4 4 4-4 4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="px-4 pb-6 sm:px-6 lg:px-8" aria-labelledby="hero-heading">
      <div className="relative mx-auto grid min-h-[720px] max-w-[1380px] overflow-hidden rounded-[2rem] border border-[#1b1d24]/80 bg-[#eef1f8] lg:grid-cols-[1.02fr_0.98fr] lg:rounded-[2.75rem]">
        <div className="pointer-events-none absolute -left-20 top-[30%] h-64 w-64 rounded-full border border-[#aeb7ce]/70" />
        <div className="pointer-events-none absolute left-[40%] top-[-18%] h-[420px] w-[420px] rounded-full border border-[#ccd2e0]/70" />
        <div className="relative z-10 flex items-center px-6 py-16 sm:px-10 lg:px-14 xl:px-20">
          <Reveal className="max-w-[720px]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#424753]">
              <span className="grid h-6 w-6 place-items-center rounded-full border border-[#17191f]/25">
                <ArrowIcon />
              </span>
              Contract clarity for independent work
            </div>

            <h1
              className="font-display mt-8 text-[clamp(4rem,7.25vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.025em] text-[#15171d]"
              id="hero-heading"
            >
              Know what
              <br />
              <span className="lg:inline-block lg:whitespace-nowrap">
                you&apos;re{" "}
                <span className="relative inline-block whitespace-nowrap">
                  <span className="absolute -inset-x-4 inset-y-1 -rotate-2 rounded-[50%] border-[1.5px] border-[#7f8cad]/75 sm:-inset-x-6" />
                  <span className="relative">signing</span>
                </span>
                <span className="text-[#8e99b8]">.</span>
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-7 text-[#5b606b] sm:text-lg sm:leading-8">
              Clause Guard reviews freelance contracts clause by clause, compares
              them with fair industry terms, and explains every risk in plain
              language.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#17191f] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(20,22,29,0.2)] transition hover:-translate-y-0.5 hover:bg-[#2b2e36]"
                to="/sign-up"
              >
                Get started
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-[#17191f] transition group-hover:translate-x-0.5">
                  <ArrowIcon />
                </span>
              </Link>
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#17191f]/40 bg-white/30 px-6 py-3.5 text-sm font-semibold text-[#17191f] transition hover:-translate-y-0.5 hover:bg-white/70"
                to="/sign-up"
              >
                Try for free
                <ArrowIcon />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#707682]">
              <span>PDF + DOCX</span>
              <span className="h-1 w-1 rounded-full bg-[#9aa3b8]" />
              <span>Plain-language risks</span>
              <span className="h-1 w-1 rounded-full bg-[#9aa3b8]" />
              <span>Free to start</span>
            </div>
          </Reveal>
        </div>

        <Reveal
          className="relative flex min-h-[500px] items-center justify-center px-2 pb-8 lg:min-h-0 lg:px-4 lg:py-14"
          delay={140}
        >
          <ContractIllustration />
        </Reveal>
      </div>
    </section>
  );
}
