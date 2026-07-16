import { SignIn } from "@clerk/react";
import AuthShell from "../components/auth/AuthShell.jsx";
import { clerkAppearance } from "../components/auth/clerkAppearance.js";

export default function SignInPage() {
  return (
    <AuthShell mode="sign-in">
      <SignIn
        appearance={clerkAppearance}
        fallbackRedirectUrl="/dashboard"
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
      />
    </AuthShell>
  );
}
