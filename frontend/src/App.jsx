import {
  Show,
  UserButton,
  useAuth,
  useUser,
} from "@clerk/react";
import { useEffect, useState } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import LandingPage from "./components/landing/LandingPage.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";

function LoadingState({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-400">
      {label}
    </div>
  );
}

function AppHeader() {
  return (
    <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-10">
        <Link className="text-lg font-semibold tracking-tight text-white" to="/">
          Clause Guard
        </Link>

        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <Link
              className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
              to="/sign-in"
            >
              Log in
            </Link>
            <Link
              className="rounded-lg bg-emerald-300 px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-200"
              to="/sign-up"
            >
              Sign up
            </Link>
          </Show>

          <Show when="signed-in">
            <Link
              className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
              to="/dashboard"
            >
              Dashboard
            </Link>
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}

function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return <LoadingState label="Checking your session..." />;
  }

  if (!isSignedIn) {
    const returnTo = `${location.pathname}${location.search}`;
    return (
      <Navigate
        replace
        to={`/sign-in?redirect_url=${encodeURIComponent(returnTo)}`}
      />
    );
  }

  return children;
}

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const RISK_BADGE_CLASSES = {
  safe: "bg-emerald-300/15 text-emerald-200",
  caution: "bg-amber-300/15 text-amber-200",
  risky: "bg-red-400/15 text-red-200",
};

function ContractUploadPanel({ getToken }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadResult, setUploadResult] = useState(null);
  const [inputKey, setInputKey] = useState(0);

  useEffect(() => {
    if (!uploadResult?.id || uploadResult.status !== "processing") {
      return undefined;
    }

    const controller = new AbortController();
    let timeoutId;

    async function pollAnalysis() {
      try {
        const token = await getToken();
        const response = await fetch(`/api/documents/${uploadResult.id}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        const body = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(body.error ?? "Unable to load the contract analysis");
        }

        setUploadResult(body.document);
        if (body.document.status === "processing") {
          timeoutId = window.setTimeout(pollAnalysis, 1500);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setUploadError(error.message);
        }
      }
    }

    timeoutId = window.setTimeout(pollAnalysis, 1000);
    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [getToken, uploadResult?.id, uploadResult?.status]);

  function selectFile(event) {
    const file = event.target.files?.[0] ?? null;
    setUploadError("");
    setUploadResult(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!/\.(pdf|docx)$/i.test(file.name)) {
      setSelectedFile(null);
      setUploadError("Choose a PDF or DOCX file.");
      return;
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      setSelectedFile(null);
      setUploadError("The selected file exceeds the 10 MB limit.");
      return;
    }

    setSelectedFile(file);
  }

  async function uploadDocument(event) {
    event.preventDefault();

    if (!selectedFile) {
      setUploadError("Choose a PDF or DOCX file first.");
      return;
    }

    setIsUploading(true);
    setUploadError("");
    setUploadResult(null);

    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(body.error ?? "The document could not be uploaded");
      }

      setUploadResult(body.document);
      setSelectedFile(null);
      setInputKey((key) => key + 1);
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <section className="mt-8 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-emerald-300">
          Contract analysis
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">
          Upload a contract
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          PDF and DOCX files up to 10 MB. Segmentation, similarity analysis,
          risk scoring, and flagged-clause explanations run in the background.
        </p>
      </div>

      <form className="mt-6" onSubmit={uploadDocument}>
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-slate-950/40 px-6 py-10 text-center transition hover:border-emerald-300/50 hover:bg-emerald-300/[0.03]">
          <span className="font-medium text-white">
            {selectedFile ? selectedFile.name : "Choose a contract"}
          </span>
          <span className="mt-1 text-sm text-slate-500">
            {selectedFile
              ? `${(selectedFile.size / 1024).toFixed(1)} KB selected`
              : "Click to browse for a PDF or DOCX"}
          </span>
          <input
            key={inputKey}
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="sr-only"
            disabled={isUploading}
            name="file"
            onChange={selectFile}
            type="file"
          />
        </label>

        <button
          className="mt-4 w-full rounded-xl bg-emerald-300 px-5 py-3 font-medium text-slate-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!selectedFile || isUploading}
          type="submit"
        >
          {isUploading ? "Uploading contract..." : "Upload and analyze contract"}
        </button>
      </form>

      {uploadError && (
        <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
          {uploadError}
        </div>
      )}

      {uploadResult?.status === "processing" && (
        <div className="mt-4 rounded-xl border border-sky-300/20 bg-sky-300/10 p-4 text-sky-100">
          <p className="font-medium">Analysis in progress</p>
          <p className="mt-1 text-sm text-sky-100/80">
            Text extracted from {uploadResult.filename}. Gemini is segmenting
            clauses, comparing them with the fair baseline, and explaining
            anything flagged.
          </p>
        </div>
      )}

      {uploadResult?.status === "failed" && (
        <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-red-200">
          <p className="font-medium">Analysis failed</p>
          <p className="mt-1 text-sm">
            {uploadResult.analysisError ?? "The contract could not be analyzed."}
          </p>
        </div>
      )}

      {uploadResult?.status === "complete" && (
        <div className="mt-4 rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-emerald-100">
          <p className="font-medium">Contract analysis complete</p>
          <p className="mt-1 text-sm text-emerald-100/80">
            {uploadResult.filename} · {uploadResult.extractedCharacters} characters
            · risk score: {uploadResult.overallRiskScore}
          </p>
          <div className="mt-4 space-y-3">
            {uploadResult.clauses?.map((clause) => (
              <article
                className="rounded-lg border border-white/10 bg-slate-950/40 p-3"
                key={clause.id}
              >
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-400">{clause.category}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-medium uppercase tracking-wide ${RISK_BADGE_CLASSES[clause.riskLabel]}`}
                  >
                    {clause.riskLabel}
                  </span>
                  {clause.similarity !== null && (
                    <span className="text-slate-500">
                      similarity {clause.similarity.toFixed(3)}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {clause.clauseText}
                </p>
                {clause.explanation && (
                  <div className="mt-3 rounded-md border border-amber-300/15 bg-amber-300/[0.06] p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-amber-200">
                      Why this was flagged
                    </p>
                    <p className="mt-1 text-sm leading-6 text-amber-50/80">
                      {clause.explanation}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function DashboardPage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [databaseUser, setDatabaseUser] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDatabaseUser() {
      try {
        const token = await getToken();
        const response = await fetch("/api/me", {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        const body = await response.json();

        if (!response.ok) {
          throw new Error(body.error ?? "Unable to load your account");
        }

        setDatabaseUser(body.user);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadDatabaseUser();
    return () => controller.abort();
  }, [getToken]);

  return (
    <main className="mx-auto min-h-[calc(100vh-73px)] max-w-6xl px-6 py-14 lg:px-10">
      <p className="text-sm font-medium text-emerald-300">Protected route</p>
      <h1 className="font-display mt-2 text-4xl font-semibold tracking-[-0.02em] text-white">
        Welcome{user?.firstName ? `, ${user.firstName}` : ""}.
      </h1>
      <p className="mt-3 max-w-2xl text-slate-400">
        Clerk verified the browser session. The card below is loaded from the
        protected Express endpoint and synced to PostgreSQL on first login.
      </p>

      <section className="mt-10 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        {isLoading && <p className="text-slate-400">Syncing your account...</p>}

        {error && (
          <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-red-200">
            <p className="font-medium">Account sync failed</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {databaseUser && (
          <dl className="grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500">
                Database user ID
              </dt>
              <dd className="mt-1 text-white">{databaseUser.id}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500">
                Name
              </dt>
              <dd className="mt-1 text-white">{databaseUser.name}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500">
                Email
              </dt>
              <dd className="mt-1 break-all text-white">{databaseUser.email}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500">
                Created
              </dt>
              <dd className="mt-1 text-white">
                {new Date(databaseUser.createdAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        )}
      </section>

      <ContractUploadPanel getToken={getToken} />
    </main>
  );
}

function App() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const isAuthPage =
    location.pathname.startsWith("/sign-in") ||
    location.pathname.startsWith("/sign-up");

  return (
    <div
      className={`min-h-screen ${
        isLandingPage
          ? "bg-[#f7f7f3] text-[#17191f]"
          : isAuthPage
            ? "bg-white text-[#1c1823]"
          : "bg-slate-950 text-slate-100"
      }`}
    >
      {!isLandingPage && !isAuthPage && <AppHeader />}
      <Routes>
        <Route element={<LandingPage />} path="/" />
        <Route element={<SignInPage />} path="/sign-in/*" />
        <Route element={<SignUpPage />} path="/sign-up/*" />
        <Route
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
          path="/dashboard"
        />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </div>
  );
}

export default App;
