import { Link } from "react-router-dom";
import BrandLogo from "../BrandLogo.jsx";

export default function LandingHeader() {
  return (
    <header className="relative z-40 mx-auto flex max-w-[1380px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12 lg:py-7">
      <Link
        aria-label="Clause Guard home"
        className="flex items-center gap-3 text-[17px] font-bold tracking-[-0.03em] text-[#17191f]"
        to="/"
      >
        <BrandLogo className="h-10 w-10 rounded-xl shadow-[0_8px_20px_rgba(19,22,30,0.16)]" />
        Clause Guard
      </Link>

      <nav
        aria-label="Primary navigation"
        className="hidden items-center gap-8 text-sm font-medium text-[#5a5f6b] md:flex"
      >
        <a className="transition hover:text-[#17191f]" href="#why-clause-guard">
          Why Clause Guard
        </a>
        <a className="transition hover:text-[#17191f]" href="#how-it-works">
          How it works
        </a>
        <Link className="transition hover:text-[#17191f]" to="/sign-in">
          Log in
        </Link>
      </nav>

      <Link
        className="group inline-flex items-center gap-2 rounded-full bg-[#17191f] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(18,20,27,0.18)] transition hover:-translate-y-0.5 hover:bg-[#2b2e36] sm:px-5"
        to="/sign-up"
      >
        Get started
        <svg
          aria-hidden="true"
          className="h-4 w-4 transition group-hover:translate-x-0.5"
          fill="none"
          viewBox="0 0 16 16"
        >
          <path
            d="M3 8h9m-3.5-3.5L12 8l-3.5 3.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </Link>
    </header>
  );
}
