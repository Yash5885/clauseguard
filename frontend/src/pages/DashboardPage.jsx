import { useAuth, useUser } from "@clerk/react";
import { useCallback, useEffect, useState } from "react";
import ClauseCard from "../components/dashboard/ClauseCard.jsx";
import DashboardShell from "../components/dashboard/DashboardShell.jsx";
import UploadBox from "../components/dashboard/UploadBox.jsx";
import { getApiUrl } from "../config/api.js";

function FeatureIcon({ type }) {
  const paths = {
    explain: (
      <>
        <path d="M7 7.5h10M7 11h7M7 14.5h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
        <path d="M5 3.5h14v14H9l-4 3z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
      </>
    ),
    history: (
      <>
        <path d="M12 7v5l3 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        <path d="M5.2 7.1A8 8 0 1 1 4 14M3.5 6v4h4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      </>
    ),
    risk: (
      <>
        <path d="M12 3.5 19 6v5.2c0 4.2-2.8 7.7-7 9.3-4.2-1.6-7-5.1-7-9.3V6z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
        <path d="m8.8 12 2 2 4.4-4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      {paths[type]}
    </svg>
  );
}

const FEATURES = [
  {
    accent: "bg-[#efe9ff] text-[#6b45c2]",
    description:
      "See one-sided payment, ownership, cancellation, and liability terms before they become a problem.",
    eyebrow: "Risk detection",
    icon: "risk",
    title: "Spot risky clauses before you sign",
  },
  {
    accent: "bg-[#e8f4f0] text-[#397d63]",
    description:
      "Turn dense contract language into a short explanation grounded in a fair baseline clause.",
    eyebrow: "Plain language",
    icon: "explain",
    title: "Understand why each term matters",
  },
  {
    accent: "bg-[#fff1dc] text-[#9a6a24]",
    description:
      "Return to every completed review, compare outcomes, and keep contract decisions organized.",
    eyebrow: "Review history",
    icon: "history",
    title: "Track every contract you review",
  },
];

async function readResponse(response, fallbackMessage) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error ?? fallbackMessage);
  }
  return body;
}

function mergeHistoryDocument(document) {
  return {
    id: document.id,
    filename: document.filename,
    uploadDate: document.uploadDate,
    overallRiskScore: document.overallRiskScore,
    status: document.status,
    analysisError: document.analysisError,
    extractedCharacters: document.extractedCharacters,
    riskSummary: document.riskSummary ?? { safe: 0, caution: 0, risky: 0 },
  };
}

function ErrorBanner({ children }) {
  return (
    <div className="mb-6 rounded-2xl border border-[#efc9ce] bg-[#fff5f6] px-4 py-3 text-sm text-[#a64451]" role="alert">
      {children}
    </div>
  );
}

function WelcomePanel({ error, firstName, isUploading, onUpload, resetKey }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 pb-8 pt-10 sm:px-8 sm:pb-12 sm:pt-14 xl:px-12">
      <div className="relative overflow-hidden rounded-[2rem] border border-[#e1dce5] bg-[radial-gradient(circle_at_78%_18%,rgba(205,192,240,0.72),transparent_27%),linear-gradient(135deg,#ffffff_0%,#f5f3fb_47%,#eef2fb_100%)] px-6 py-9 shadow-[0_22px_60px_rgba(66,49,86,0.08)] sm:px-10 sm:py-12 lg:px-12">
        <div className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full border border-[#b8a9d6]/30" />
        <div className="pointer-events-none absolute right-10 top-14 h-28 w-28 rounded-full border border-[#b8a9d6]/25" />
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#77698b]">
          Your contract workspace
        </p>
        <h1 className="font-display mt-4 max-w-3xl text-4xl font-semibold leading-[1.13] tracking-[-0.015em] text-[#211c27] sm:text-5xl lg:text-[3.5rem]">
          Hi {firstName}, ready to review a contract?
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#706978] sm:text-base">
          Upload an agreement and Clause Guard will separate the clauses, compare
          them with fair freelance terms, and explain anything worth a closer look.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {FEATURES.map((feature) => (
          <article
            className="rounded-[1.6rem] border border-[#e2dde6] bg-white p-5 shadow-[0_16px_42px_rgba(61,45,78,0.06)] sm:p-6"
            key={feature.title}
          >
            <span className={`grid h-12 w-12 place-items-center rounded-2xl ${feature.accent}`}>
              <FeatureIcon type={feature.icon} />
            </span>
            <p className="mt-5 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#90889a]">
              {feature.eyebrow}
            </p>
            <h2 className="mt-2 text-lg font-bold leading-6 tracking-[-0.02em] text-[#28222e]">
              {feature.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#77707f]">
              {feature.description}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-auto pt-8 sm:pt-10">
        <div className="mb-3 flex items-center justify-between px-1">
          <div>
            <p className="text-sm font-bold text-[#342d3b]">Start a new review</p>
            <p className="mt-0.5 text-xs text-[#918a98]">Your document stays linked to your secure account.</p>
          </div>
          <span className="hidden text-xs font-medium text-[#938a9d] sm:block">PDF + DOCX</span>
        </div>
        <UploadBox
          error={error}
          isUploading={isUploading}
          onUpload={onUpload}
          resetKey={resetKey}
        />
      </div>
    </div>
  );
}

function LoadingDocument() {
  return (
    <div className="mx-auto min-h-screen max-w-5xl px-5 py-12 sm:px-8 lg:py-16">
      <div className="h-5 w-32 animate-pulse rounded-full bg-[#e6e0ea]" />
      <div className="mt-5 h-12 w-3/5 animate-pulse rounded-2xl bg-[#e6e0ea]" />
      <div className="mt-10 h-40 animate-pulse rounded-[1.7rem] bg-white shadow-sm" />
      <div className="mt-5 h-56 animate-pulse rounded-[1.7rem] bg-white shadow-sm" />
    </div>
  );
}

function ProcessingPanel({ document, onNewReview }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl items-center px-5 py-12 sm:px-8">
      <section className="w-full rounded-[2rem] border border-[#ded7e5] bg-white p-7 text-center shadow-[0_24px_70px_rgba(64,46,82,0.1)] sm:p-12">
        <span className="relative mx-auto grid h-20 w-20 place-items-center rounded-[1.5rem] bg-[#eee8ff] text-[#6841c0]">
          <svg aria-hidden="true" className="h-9 w-9" fill="none" viewBox="0 0 24 24">
            <path d="M7 3.5h7l4 4v13H7z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.6" />
            <path d="M14 3.5V8h4M9.5 12h6M9.5 15.5h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
          </svg>
          <span className="absolute -right-2 -top-2 h-6 w-6 animate-spin rounded-full border-2 border-[#7e5bc9] border-t-transparent motion-reduce:animate-none" />
        </span>
        <p className="mt-6 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#7b6d8e]">Analysis in progress</p>
        <h1 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-[#27212d] sm:text-3xl">
          Reviewing {document.filename}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#77707f] sm:text-base">
          The text is extracted. Clause Guard is now segmenting clauses, comparing fair
          baselines, scoring risk, and writing grounded explanations.
        </p>
        <div className="mx-auto mt-8 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
          {["Text extracted", "Clauses compared", "Explanations prepared"].map((label, index) => (
            <div className="rounded-2xl bg-[#f7f4fa] px-4 py-4" key={label}>
              <span className="text-xs font-bold text-[#6f50b1]">0{index + 1}</span>
              <p className="mt-1 text-sm font-semibold text-[#4b4352]">{label}</p>
            </div>
          ))}
        </div>
        <button className="mt-8 text-sm font-bold text-[#6a43bf] hover:text-[#4e2d9d]" onClick={onNewReview} type="button">
          Start another review
        </button>
      </section>
    </div>
  );
}

function FailedPanel({ document, onNewReview }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl items-center px-5 py-12 sm:px-8">
      <section className="w-full rounded-[2rem] border border-[#efc9ce] bg-white p-8 text-center shadow-[0_24px_70px_rgba(103,48,57,0.08)] sm:p-12">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#fbe5e7] text-2xl font-bold text-[#b94f5b]">!</span>
        <p className="mt-6 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#a45c65]">Analysis failed</p>
        <h1 className="mt-3 text-2xl font-bold text-[#30252b]">{document.filename}</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#766a70]">
          {document.analysisError || "The contract could not be analyzed. Try uploading a clean PDF or DOCX copy."}
        </p>
        <button className="mt-7 rounded-2xl bg-[#211a2b] px-6 py-3 text-sm font-bold text-white" onClick={onNewReview} type="button">
          Try a new review
        </button>
      </section>
    </div>
  );
}

function SummaryStat({ label, tone, value }) {
  const tones = {
    caution: "bg-[#fff3d9] text-[#956a19]",
    risky: "bg-[#fbe5e4] text-[#b54f56]",
    safe: "bg-[#e7f3ec] text-[#337358]",
  };

  return (
    <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-4 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-[#625b69]">{label}</span>
        <span className={`grid h-8 min-w-8 place-items-center rounded-xl px-2 text-sm font-bold ${tones[tone]}`}>{value}</span>
      </div>
    </div>
  );
}

function ResultsPanel({ document, onNewReview }) {
  const summary = document.riskSummary ?? { safe: 0, caution: 0, risky: 0 };
  const total = summary.safe + summary.caution + summary.risky;
  const uncategorizedCount =
    document.clauses?.filter((clause) => clause.category === "Uncategorized").length ?? 0;
  const riskLabel = summary.risky
    ? "Priority review recommended"
    : summary.caution
      ? "A few terms need attention"
      : "No major deviations found";

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-5 pb-16 pt-9 sm:px-8 sm:pt-12 xl:px-12">
      <button className="inline-flex items-center gap-2 text-sm font-bold text-[#6b46b7] hover:text-[#4d2b94]" onClick={onNewReview} type="button">
        <span aria-hidden="true">←</span>
        New review
      </button>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#82758f]">Contract review</p>
          <h1 className="mt-2 truncate text-3xl font-bold tracking-[-0.04em] text-[#27212d] sm:text-4xl">{document.filename}</h1>
          <p className="mt-2 text-sm text-[#827a89]">
            {total} clauses reviewed · {document.extractedCharacters?.toLocaleString() ?? 0} characters extracted
          </p>
        </div>
        <button className="shrink-0 rounded-2xl border border-[#d9d1e1] bg-white px-5 py-3 text-sm font-bold text-[#3f3548] shadow-sm hover:border-[#bbaad3]" onClick={onNewReview} type="button">
          Review another contract
        </button>
      </div>

      <section className="mt-8 overflow-hidden rounded-[1.8rem] border border-[#ddd6e3] bg-[linear-gradient(135deg,#f4efff_0%,#f2f5fb_54%,#fff7ec_100%)] p-5 shadow-[0_18px_50px_rgba(65,48,82,0.08)] sm:p-7">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#82758f]">Overall risk summary</p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-[#2a2330]">{riskLabel}</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#746c7b]">
              Risk score <strong className="text-[#332b3a]">{document.overallRiskScore ?? 0}</strong>. Flagged clauses are expanded below; safe clauses stay condensed until you open them.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <SummaryStat label="Safe" tone="safe" value={summary.safe} />
            <SummaryStat label="Caution" tone="caution" value={summary.caution} />
            <SummaryStat label="Risky" tone="risky" value={summary.risky} />
          </div>
        </div>
      </section>

      <div className="mt-7 flex items-center justify-between gap-4 px-1">
        <div>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-[#2e2734]">Clause-by-clause review</h2>
          <p className="mt-1 text-sm text-[#837b8a]">Compare each term with the fair baseline before you sign.</p>
        </div>
        <span className="hidden rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#756c7e] shadow-sm sm:block">{total} total</span>
      </div>

      {uncategorizedCount > 0 && (
        <aside className="mt-5 rounded-2xl border border-[#e4d9b8] bg-[#fff9e8] px-5 py-4 text-[#70613d]" role="note">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#967b35]">Note</p>
          <p className="mt-1.5 text-sm leading-6">
            {uncategorizedCount === 1
              ? "This is an unusual or unsupported clause type that could not be compared with Clause Guard's fair baseline. Review it manually or with a qualified professional because no standard comparison is available."
              : `${uncategorizedCount} clauses use unusual or unsupported clause types that could not be compared with Clause Guard's fair baseline. Review them manually or with a qualified professional because no standard comparison is available.`}
          </p>
        </aside>
      )}

      <div className="mt-5 space-y-4">
        {document.clauses?.length ? (
          document.clauses.map((clause) => <ClauseCard clause={clause} key={clause.id} />)
        ) : (
          <div className="rounded-[1.5rem] border border-[#ddd7e2] bg-white p-8 text-center text-sm text-[#7a7380]">
            No clause results were returned for this document.
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [databaseUser, setDatabaseUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [activeDocument, setActiveDocument] = useState(null);
  const [historyError, setHistoryError] = useState("");
  const [pageError, setPageError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [isDocumentLoading, setIsDocumentLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResetKey, setUploadResetKey] = useState(0);

  const authenticatedFetch = useCallback(
    async (url, options = {}) => {
      const token = await getToken();
      return fetch(getApiUrl(url), {
        ...options,
        headers: {
          ...(options.headers ?? {}),
          Authorization: `Bearer ${token}`,
        },
      });
    },
    [getToken],
  );

  const loadHistory = useCallback(
    async ({ signal, showLoading = false } = {}) => {
      if (showLoading) {
        setIsHistoryLoading(true);
      }
      setHistoryError("");

      try {
        const response = await authenticatedFetch("/api/documents", { signal });
        const body = await readResponse(response, "Unable to load your review history");
        setDocuments(body.documents ?? []);
      } catch (error) {
        if (error.name !== "AbortError") {
          setHistoryError(error.message);
        }
      } finally {
        if (showLoading && !signal?.aborted) {
          setIsHistoryLoading(false);
        }
      }
    },
    [authenticatedFetch],
  );

  useEffect(() => {
    const controller = new AbortController();

    async function initializeDashboard() {
      try {
        const response = await authenticatedFetch("/api/me", {
          signal: controller.signal,
        });
        const body = await readResponse(response, "Unable to sync your account");
        setDatabaseUser(body.user);
        await loadHistory({ signal: controller.signal, showLoading: true });
      } catch (error) {
        if (error.name !== "AbortError") {
          setPageError(error.message);
          setIsHistoryLoading(false);
        }
      }
    }

    initializeDashboard();
    return () => controller.abort();
  }, [authenticatedFetch, loadHistory]);

  useEffect(() => {
    if (!activeDocument?.id || activeDocument.status !== "processing") {
      return undefined;
    }

    let cancelled = false;
    let timeoutId;

    async function pollDocument() {
      try {
        const response = await authenticatedFetch(`/api/documents/${activeDocument.id}`);
        const body = await readResponse(response, "Unable to load the contract analysis");
        if (cancelled) {
          return;
        }

        setActiveDocument(body.document);
        if (body.document.status === "processing") {
          timeoutId = window.setTimeout(pollDocument, 1500);
        } else {
          await loadHistory();
        }
      } catch (error) {
        if (!cancelled) {
          setUploadError(error.message);
        }
      }
    }

    timeoutId = window.setTimeout(pollDocument, 1000);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [activeDocument?.id, activeDocument?.status, authenticatedFetch, loadHistory]);

  async function selectDocument(document) {
    setIsDocumentLoading(true);
    setPageError("");
    setUploadError("");

    try {
      const response = await authenticatedFetch(`/api/documents/${document.id}`);
      const body = await readResponse(response, "Unable to open this contract review");
      setActiveDocument(body.document);
    } catch (error) {
      setPageError(error.message);
    } finally {
      setIsDocumentLoading(false);
    }
  }

  function startNewReview() {
    setActiveDocument(null);
    setIsDocumentLoading(false);
    setPageError("");
    setUploadError("");
    setUploadResetKey((key) => key + 1);
  }

  async function uploadDocument(file) {
    setIsUploading(true);
    setUploadError("");
    setPageError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await authenticatedFetch("/api/documents", {
        body: formData,
        method: "POST",
      });
      const body = await readResponse(response, "The document could not be uploaded");
      const nextDocument = {
        ...body.document,
        clauses: [],
        riskSummary: { safe: 0, caution: 0, risky: 0 },
      };

      setActiveDocument(nextDocument);
      setDocuments((current) => [
        mergeHistoryDocument(nextDocument),
        ...current.filter((document) => String(document.id) !== String(nextDocument.id)),
      ]);
      setUploadResetKey((key) => key + 1);
      await loadHistory();
      return true;
    } catch (error) {
      setUploadError(error.message);
      return false;
    } finally {
      setIsUploading(false);
    }
  }

  const syncedName = databaseUser?.name?.trim();
  const friendlySyncedName =
    syncedName && syncedName.length <= 30 && !syncedName.includes("+")
      ? syncedName.split(" ")[0]
      : "";
  const firstName = user?.firstName || friendlySyncedName || "there";

  let content;
  if (isDocumentLoading) {
    content = <LoadingDocument />;
  } else if (activeDocument?.status === "processing") {
    content = <ProcessingPanel document={activeDocument} onNewReview={startNewReview} />;
  } else if (activeDocument?.status === "failed") {
    content = <FailedPanel document={activeDocument} onNewReview={startNewReview} />;
  } else if (activeDocument?.status === "complete") {
    content = <ResultsPanel document={activeDocument} onNewReview={startNewReview} />;
  } else {
    content = (
      <WelcomePanel
        error={uploadError}
        firstName={firstName}
        isUploading={isUploading}
        onUpload={uploadDocument}
        resetKey={uploadResetKey}
      />
    );
  }

  return (
    <DashboardShell
      activeDocumentId={activeDocument?.id}
      documents={documents}
      historyError={historyError}
      isHistoryLoading={isHistoryLoading}
      onNewReview={startNewReview}
      onSelectDocument={selectDocument}
    >
      <div className="min-h-[calc(100vh-4rem)] lg:min-h-screen">
        {pageError && (
          <div className="mx-auto max-w-6xl px-5 pt-5 sm:px-8 xl:px-12">
            <ErrorBanner>{pageError}</ErrorBanner>
          </div>
        )}
        {content}
      </div>
    </DashboardShell>
  );
}
