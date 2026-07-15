import {
  Show,
  SignIn,
  SignUp,
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
          ClauseGuard
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

function LandingPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl items-center px-6 py-16 lg:px-10">
      <section className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-sm text-emerald-200">
          <span className="h-2 w-2 rounded-full bg-emerald-300" />
          Managed authentication ready
        </span>
        <h1 className="mt-7 text-5xl font-semibold tracking-tight text-white sm:text-7xl">
          Understand the contract before you sign it.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          This build step proves secure signup, login, logout, protected frontend
          routing, and an authenticated API request backed by PostgreSQL.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Show when="signed-out">
            <Link
              className="rounded-xl bg-emerald-300 px-5 py-3 font-medium text-slate-950 transition hover:bg-emerald-200"
              to="/sign-up"
            >
              Create an account
            </Link>
            <Link
              className="rounded-xl border border-white/15 px-5 py-3 font-medium text-white transition hover:bg-white/5"
              to="/sign-in"
            >
              Log in
            </Link>
          </Show>

          <Show when="signed-in">
            <Link
              className="rounded-xl bg-emerald-300 px-5 py-3 font-medium text-slate-950 transition hover:bg-emerald-200"
              to="/dashboard"
            >
              Open dashboard
            </Link>
          </Show>
        </div>
      </section>
    </main>
  );
}

function AuthPage({ mode }) {
  return (
    <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-12">
      {mode === "sign-in" ? (
        <SignIn
          fallbackRedirectUrl="/dashboard"
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
        />
      ) : (
        <SignUp
          fallbackRedirectUrl="/dashboard"
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
        />
      )}
    </main>
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
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
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
    </main>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AppHeader />
      <Routes>
        <Route element={<LandingPage />} path="/" />
        <Route element={<AuthPage mode="sign-in" />} path="/sign-in/*" />
        <Route element={<AuthPage mode="sign-up" />} path="/sign-up/*" />
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
