import FinalCTA from "./FinalCTA.jsx";
import BrandLogo from "../BrandLogo.jsx";
import Hero from "./Hero.jsx";
import HowItWorks from "./HowItWorks.jsx";
import LandingHeader from "./LandingHeader.jsx";
import ProblemSolution from "./ProblemSolution.jsx";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f7f3] text-[#17191f]">
      <LandingHeader />
      <main>
        <Hero />
        <ProblemSolution />
        <HowItWorks />
        <FinalCTA />
      </main>
      <footer className="mx-auto flex max-w-[1380px] flex-col gap-3 border-t border-[#17191f]/10 px-5 py-8 text-xs text-[#747985] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <span className="flex items-center gap-2.5">
          <BrandLogo className="h-8 w-8 rounded-lg" />
          © {new Date().getFullYear()} Clause Guard
        </span>
        <span>Understand the agreement. Own the decision.</span>
      </footer>
    </div>
  );
}
