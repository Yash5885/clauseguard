import { SignUp } from "@clerk/react";
import AuthShell from "../components/auth/AuthShell.jsx";
import { clerkAppearance } from "../components/auth/clerkAppearance.js";

export default function SignUpPage() {
  return (
    <AuthShell mode="sign-up">
      <SignUp
        appearance={clerkAppearance}
        fallbackRedirectUrl="/dashboard"
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
      />
    </AuthShell>
  );
}
