import { Show, UserButton, useAuth } from "@clerk/react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import LandingPage from "./components/landing/LandingPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
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

function App() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const isAuthPage =
    location.pathname.startsWith("/sign-in") ||
    location.pathname.startsWith("/sign-up");
  const isDashboardPage = location.pathname.startsWith("/dashboard");

  return (
    <div
      className={`min-h-screen ${
        isLandingPage
          ? "bg-[#f7f7f3] text-[#17191f]"
          : isAuthPage || isDashboardPage
            ? "bg-white text-[#1c1823]"
            : "bg-slate-950 text-slate-100"
      }`}
    >
      {!isLandingPage && !isAuthPage && !isDashboardPage && <AppHeader />}
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
