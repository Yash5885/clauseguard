import { Link } from "react-router-dom";
import BrandLogo from "../BrandLogo.jsx";
import AuthIllustration from "./AuthIllustration.jsx";

function Brand({ inverse = false }) {
  return (
    <Link
      aria-label="Clause Guard home"
      className={`inline-flex items-center gap-3 text-base font-bold tracking-[-0.02em] ${
        inverse ? "text-white" : "text-[#1c1823]"
      }`}
      to="/"
    >
      <BrandLogo
        className={`h-11 w-11 rounded-xl shadow-sm ${
          inverse ? "ring-1 ring-white/25" : "ring-1 ring-[#2c2140]/10"
        }`}
      />
      <span>Clause Guard</span>
    </Link>
  );
}

const COPY = {
  "sign-in": {
    eyebrow: "Welcome back",
    heading: "Return to your contract clarity.",
    description:
      "Pick up where you left off and review every clause with confidence.",
  },
  "sign-up": {
    eyebrow: "Start with clarity",
    heading: "Know the deal before you sign it.",
    description:
      "Create your secure workspace and turn dense contract language into clear decisions.",
  },
};

export default function AuthShell({ children, mode }) {
  const copy = COPY[mode];

  return (
    <main className="min-h-screen bg-white text-[#1c1823] lg:grid lg:grid-cols-[minmax(0,1.08fr)_minmax(480px,0.92fr)]">
      <aside className="relative flex min-h-[280px] overflow-hidden bg-[linear-gradient(145deg,#35126d_0%,#6930c3_46%,#9f67ef_100%)] px-6 py-7 sm:min-h-[340px] sm:px-10 lg:min-h-screen lg:px-12 lg:py-10 xl:px-16">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full border border-white/15" />
        <div className="pointer-events-none absolute -bottom-40 -right-20 h-[520px] w-[520px] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_78%_72%,rgba(62,15,130,0.28),transparent_34%)]" />

        <div className="relative z-10 flex w-full flex-col">
          <div className="hidden lg:block">
            <Brand inverse />
          </div>

          <div className="mx-auto flex w-full max-w-2xl flex-1 items-center justify-center lg:flex-col">
            <div className="hidden max-w-lg self-start lg:block">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-100/75">
                {copy.eyebrow}
              </p>
              <h1 className="font-display mt-4 text-5xl font-semibold leading-[1.08] tracking-[-0.02em] text-white xl:text-6xl">
                {copy.heading}
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-violet-100/75">
                {copy.description}
              </p>
            </div>

            <div className="w-full max-w-[430px] sm:max-w-[500px] lg:mt-6 lg:max-w-[560px]">
              <AuthIllustration />
            </div>
          </div>
        </div>
      </aside>

      <section className="relative flex min-h-[calc(100vh-280px)] items-center justify-center bg-white px-5 py-10 sm:min-h-[calc(100vh-340px)] sm:px-10 sm:py-14 lg:min-h-screen lg:px-12 xl:px-20">
        <div className="w-full max-w-[430px]">
          <div className="mb-9">
            <Brand />
          </div>
          {children}
          <p className="mt-8 text-center text-xs leading-5 text-[#87808f]">
            Contract insights are informational and are not a substitute for
            advice from a qualified legal professional.
          </p>
        </div>
      </section>
    </main>
  );
}
