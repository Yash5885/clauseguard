import { ClerkProvider } from "@clerk/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

const root = createRoot(document.getElementById("root"));
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkLocalization = {
  signIn: {
    start: {
      title: "Sign in to Clause Guard",
    },
  },
  signUp: {
    start: {
      title: "Create your Clause Guard account",
    },
  },
};

if (!publishableKey) {
  root.render(
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <section className="max-w-xl rounded-2xl border border-amber-300/20 bg-amber-300/10 p-6">
        <h1 className="text-xl font-semibold text-amber-100">
          Clerk is not configured
        </h1>
        <p className="mt-2 text-sm leading-6 text-amber-50/80">
          Add VITE_CLERK_PUBLISHABLE_KEY to the root .env file, then restart
          the frontend server.
        </p>
      </section>
    </main>,
  );
} else {
  root.render(
    <StrictMode>
      <ClerkProvider
        afterSignOutUrl="/"
        localization={clerkLocalization}
        publishableKey={publishableKey}
        signInFallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/dashboard"
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkProvider>
    </StrictMode>,
  );
}
