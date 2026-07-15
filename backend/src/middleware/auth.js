import { getAuth } from "@clerk/express";

export function createRequireAuthenticatedUser(readAuth = getAuth) {
  return function requireAuthenticatedUser(request, response, next) {
    if (request.clerkConfigured === false) {
      response.status(503).json({
        error: "Clerk authentication is not configured",
      });
      return;
    }

    const auth = readAuth(request);

    if (!auth.isAuthenticated || !auth.userId) {
      response.status(401).json({ error: "Authentication required" });
      return;
    }

    request.clerkAuth = auth;
    next();
  };
}

export const requireAuthenticatedUser = createRequireAuthenticatedUser();
