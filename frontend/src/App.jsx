const foundations = [
  "React + Vite",
  "Express API",
  "PostgreSQL + pgvector",
  "Docker Compose",
];

function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16 lg:px-10">
        <section className="grid w-full gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-sm text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Foundation ready
            </span>
            <h1 className="mt-7 max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-7xl">
              Understand the contract before you sign it.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              ClauseGuard will turn freelance agreements into a clear,
              clause-by-clause risk review. The application foundation is now
              in place for the next incremental build step.
            </p>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-emerald-950/30 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Item 1 scaffold
            </p>
            <ul className="mt-5 space-y-3">
              {foundations.map((foundation) => (
                <li
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3"
                  key={foundation}
                >
                  <span className="text-sm text-slate-200">{foundation}</span>
                  <span className="text-emerald-300" aria-label="configured">
                    &#10003;
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </section>
      </div>
    </main>
  );
}

export default App;
