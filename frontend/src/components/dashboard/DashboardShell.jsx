import { UserButton, useClerk } from "@clerk/react";
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

function Icon({ children, className = "" }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-5 w-5 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      {children}
    </svg>
  );
}

function NewReviewIcon() {
  return (
    <Icon>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </Icon>
  );
}

function SearchIcon() {
  return (
    <Icon>
      <circle cx="10.5" cy="10.5" r="5.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="m15 15 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </Icon>
  );
}

function HomeIcon() {
  return (
    <Icon>
      <path d="m4 11 8-7 8 7v8.5H8v-6h8v6" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
    </Icon>
  );
}

function SettingsIcon() {
  return (
    <Icon>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M19 13.5v-3l-2.2-.7-.6-1.4 1.1-2-2.1-2.1-2 1.1-1.4-.6L10.5 3h-3L6.8 5.2l-1.4.6-2-1.1-2.1 2.1 1.1 2-.6 1.4L0 10.5v3l1.8.7.6 1.4-1.1 2 2.1 2.1 2-1.1 1.4.6.7 1.8h3l.7-1.8 1.4-.6 2 1.1 2.1-2.1-1.1-2 .6-1.4Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.4" transform="translate(1.5) scale(.88)" />
    </Icon>
  );
}

function MenuIcon({ close = false }) {
  return (
    <Icon>
      {close ? (
        <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      )}
    </Icon>
  );
}

function FileIcon() {
  return (
    <Icon className="h-4 w-4">
      <path d="M6 3.5h8l4 4v13H6z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.6" />
      <path d="M14 3.5V8h4" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.6" />
    </Icon>
  );
}

function LogoMark({ inverse = false }) {
  return (
    <span
      className={`grid h-10 w-10 place-items-center rounded-xl border ${
        inverse
          ? "border-white/15 bg-white/10 text-white"
          : "border-[#3f2a70]/10 bg-[#eee8ff] text-[#5e37b5]"
      }`}
    >
      <Icon>
        <path d="M6 3.5h8l4 4v13H6z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
        <path d="M14 3.5V8h4M8.8 14l2 2 4.4-4.6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      </Icon>
    </span>
  );
}

function RailButton({ active = false, children, label, onClick }) {
  return (
    <button
      aria-label={label}
      className={`grid h-11 w-11 place-items-center rounded-2xl transition ${
        active
          ? "bg-white text-[#201a2b] shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
          : "text-white/65 hover:bg-white/10 hover:text-white"
      }`}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

function IconRail({ activeDocumentId, onNewReview, onSearch }) {
  const { openUserProfile } = useClerk();

  return (
    <div className="flex h-full w-[76px] flex-col items-center bg-[#191620] px-3 py-5">
      <RailButton label="New review" onClick={onNewReview}>
        <NewReviewIcon />
      </RailButton>

      <div className="mt-6 flex flex-col gap-2">
        <RailButton label="Search past reviews" onClick={onSearch}>
          <SearchIcon />
        </RailButton>
        <RailButton active={!activeDocumentId} label="Dashboard home" onClick={onNewReview}>
          <HomeIcon />
        </RailButton>
        <RailButton label="Account settings" onClick={() => openUserProfile()}>
          <SettingsIcon />
        </RailButton>
      </div>

      <div className="mt-auto flex flex-col items-center gap-4">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-9 w-9 ring-2 ring-white/15",
            },
          }}
        />
        <Link aria-label="Clause Guard home" title="Clause Guard home" to="/">
          <LogoMark inverse />
        </Link>
      </div>
    </div>
  );
}

function formatReviewDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: date.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  }).format(date);
}

function getReviewStatus(document) {
  if (document.status === "processing") {
    return { dot: "bg-[#7c54d8]", label: "Analyzing" };
  }

  if (document.status === "failed") {
    return { dot: "bg-[#d46470]", label: "Needs retry" };
  }

  if (document.riskSummary?.risky > 0) {
    return { dot: "bg-[#d46470]", label: `${document.riskSummary.risky} risky` };
  }

  if (document.riskSummary?.caution > 0) {
    return { dot: "bg-[#d6a646]", label: `${document.riskSummary.caution} caution` };
  }

  return { dot: "bg-[#4f9b78]", label: "Reviewed" };
}

function HistoryPanel({
  activeDocumentId,
  documents,
  error,
  isLoading,
  inputRef,
  onNewReview,
  onSelectDocument,
  searchTerm,
  setSearchTerm,
}) {
  const filteredDocuments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return query
      ? documents.filter((document) => document.filename.toLowerCase().includes(query))
      : documents;
  }, [documents, searchTerm]);

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col border-r border-[#e5e0e9] bg-[#f6f3f8]">
      <div className="border-b border-[#e5e0e9] px-5 pb-5 pt-6">
        <Link className="flex items-center gap-3 text-[#201b27]" to="/">
          <LogoMark />
          <span className="font-bold tracking-[-0.02em]">Clause Guard</span>
        </Link>
        <button
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#211a2b] px-4 py-3 text-sm font-bold text-white shadow-[0_12px_26px_rgba(33,26,43,0.14)] transition hover:bg-[#342843]"
          onClick={onNewReview}
          type="button"
        >
          <NewReviewIcon />
          New Review
        </button>
      </div>

      <div className="px-4 pt-4">
        <label className="flex items-center gap-2 rounded-xl border border-[#ded8e3] bg-white px-3 py-2.5 text-[#746d7c] focus-within:border-[#8b70c7]">
          <SearchIcon />
          <input
            aria-label="Search past reviews"
            className="min-w-0 flex-1 bg-transparent text-sm text-[#28222f] outline-none placeholder:text-[#a29ba8]"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search reviews"
            ref={inputRef}
            type="search"
            value={searchTerm}
          />
        </label>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-5 pt-5">
        <div className="flex items-center justify-between px-2">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#8d8595]">
            Recent reviews
          </p>
          <span className="text-xs text-[#9a93a1]">{documents.length}</span>
        </div>

        {isLoading && (
          <div className="mt-4 space-y-2" aria-label="Loading review history">
            {[0, 1, 2].map((item) => (
              <div className="h-[74px] animate-pulse rounded-2xl bg-white/80" key={item} />
            ))}
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-xl border border-[#efc9ce] bg-[#fff4f5] p-3 text-sm leading-5 text-[#a64451]">
            {error}
          </p>
        )}

        {!isLoading && !error && filteredDocuments.length === 0 && (
          <div className="mt-8 px-3 text-center">
            <span className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-white text-[#7c6d8b] shadow-sm">
              <FileIcon />
            </span>
            <p className="mt-3 text-sm font-semibold text-[#4a4351]">
              {documents.length ? "No matching reviews" : "No reviews yet"}
            </p>
            <p className="mt-1 text-xs leading-5 text-[#918a98]">
              {documents.length
                ? "Try a different filename."
                : "Your analyzed contracts will appear here."}
            </p>
          </div>
        )}

        <div className="mt-3 space-y-1.5">
          {filteredDocuments.map((document) => {
            const status = getReviewStatus(document);
            const isActive = String(activeDocumentId) === String(document.id);

            return (
              <button
                className={`w-full rounded-2xl border px-3.5 py-3 text-left transition ${
                  isActive
                    ? "border-[#c9bce8] bg-white shadow-[0_10px_24px_rgba(73,52,103,0.08)]"
                    : "border-transparent hover:border-[#e3dce8] hover:bg-white/75"
                }`}
                key={document.id}
                onClick={() => onSelectDocument(document)}
                type="button"
              >
                <div className="flex items-start gap-2.5">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${status.dot}`} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-[#302936]">
                      {document.filename}
                    </span>
                    <span className="mt-1 flex items-center justify-between gap-2 text-xs text-[#918a98]">
                      <span>{status.label}</span>
                      <span>{formatReviewDate(document.uploadDate)}</span>
                    </span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function DashboardShell({
  activeDocumentId,
  children,
  documents,
  historyError,
  isHistoryLoading,
  onNewReview,
  onSelectDocument,
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  function startNewReview() {
    setIsDrawerOpen(false);
    onNewReview();
  }

  function selectDocument(document) {
    setIsDrawerOpen(false);
    onSelectDocument(document);
  }

  function revealSearch() {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      desktopSearchRef.current?.focus();
      return;
    }

    setIsDrawerOpen(true);
    window.requestAnimationFrame(() => mobileSearchRef.current?.focus());
  }

  const historyProps = {
    activeDocumentId,
    documents,
    error: historyError,
    isLoading: isHistoryLoading,
    onNewReview: startNewReview,
    onSelectDocument: selectDocument,
    searchTerm,
    setSearchTerm,
  };

  return (
    <div className="min-h-screen bg-[#f7f6f9] text-[#211c27] lg:grid lg:grid-cols-[76px_300px_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-screen lg:block">
        <IconRail
          activeDocumentId={activeDocumentId}
          onNewReview={startNewReview}
          onSearch={revealSearch}
        />
      </aside>
      <aside className="sticky top-0 hidden h-screen lg:flex">
        <HistoryPanel {...historyProps} inputRef={desktopSearchRef} />
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#e6e1e9] bg-white/90 px-4 backdrop-blur lg:hidden">
          <button
            aria-label="Open review navigation"
            className="grid h-10 w-10 place-items-center rounded-xl border border-[#e1dbe6] text-[#3b3344]"
            onClick={() => setIsDrawerOpen(true)}
            type="button"
          >
            <MenuIcon />
          </button>
          <Link className="flex items-center gap-2 text-sm font-bold" to="/">
            <LogoMark />
            Clause Guard
          </Link>
          <UserButton />
        </header>
        {children}
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            aria-label="Dismiss review navigation"
            className="absolute inset-0 bg-[#17131d]/45 backdrop-blur-[2px]"
            onClick={() => setIsDrawerOpen(false)}
            type="button"
          />
          <aside className="relative flex h-full w-[min(92vw,360px)] shadow-2xl">
            <IconRail
              activeDocumentId={activeDocumentId}
              onNewReview={startNewReview}
              onSearch={() => mobileSearchRef.current?.focus()}
            />
            <HistoryPanel {...historyProps} inputRef={mobileSearchRef} />
            <button
              aria-label="Close review navigation"
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-xl bg-white text-[#3b3344] shadow-sm"
              onClick={() => setIsDrawerOpen(false)}
              type="button"
            >
              <MenuIcon close />
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
