import { Link } from "react-router-dom";
import Reveal from "./Reveal.jsx";

export default function FinalCTA() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <Reveal className="relative mx-auto max-w-[1380px] overflow-hidden rounded-[2rem] bg-[#17191f] px-6 py-20 text-white sm:px-10 lg:rounded-[2.75rem] lg:px-16 lg:py-24 xl:px-20">
        <div className="pointer-events-none absolute -right-20 -top-32 h-[430px] w-[430px] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-4 -top-10 h-[300px] w-[300px] rounded-full border border-[#929dbc]/25" />
        <svg
          aria-hidden="true"
          className="absolute bottom-[-40px] right-[6%] hidden h-72 w-72 opacity-80 md:block"
          fill="none"
          viewBox="0 0 280 280"
        >
          <path
            d="m43 110 91-52 86 47-92 54z"
            fill="#F7F7F2"
            stroke="#F7F7F2"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="m43 110 85 49v38l-85-48z"
            fill="#7E8AA8"
            stroke="#F7F7F2"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="m128 159 92-54v38l-92 54z"
            fill="#AAB3CB"
            stroke="#F7F7F2"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="m76 112 54-31m-39 53 72-41m-52 63 66-38"
            stroke="#17191F"
            strokeLinecap="round"
            strokeWidth="5"
          />
          <circle cx="195" cy="62" r="30" fill="#8E99B8" stroke="#F7F7F2" strokeWidth="2" />
          <path
            d="m182 62 9 9 17-19"
            stroke="#F7F7F2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />
        </svg>

        <div className="relative z-10 max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#aeb7ce]">
            Your next contract can feel different
          </p>
          <h2 className="font-display mt-5 text-4xl font-semibold leading-[1.18] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
            Read the fine print.
            <br />
            Keep the confidence.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/60 sm:text-lg">
            Get a clear, clause-by-clause view before you commit to the work.
          </p>
          <Link
            className="group mt-9 inline-flex items-center gap-3 rounded-full bg-[#f8f8f4] px-6 py-3.5 text-sm font-bold text-[#17191f] shadow-[0_14px_35px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-white"
            to="/sign-up"
          >
            Get started free
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#17191f] text-white transition group-hover:translate-x-0.5">
              <svg aria-hidden="true" fill="none" viewBox="0 0 18 18" className="h-4 w-4">
                <path
                  d="M3.75 9h10.5m-4-4 4 4-4 4"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                />
              </svg>
            </span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
