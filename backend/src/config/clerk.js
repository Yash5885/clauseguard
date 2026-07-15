import { clerkMiddleware, createClerkClient } from "@clerk/express";

let clerkClient;

export function createClerkRequestMiddleware() {
  if (!process.env.CLERK_SECRET_KEY) {
    return function clerkNotConfigured(request, _response, next) {
      request.clerkConfigured = false;
      next();
    };
  }

  return clerkMiddleware({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  });
}

export function getClerkClient() {
  if (!process.env.CLERK_SECRET_KEY) {
    throw new Error("CLERK_SECRET_KEY is not configured");
  }

  if (!clerkClient) {
    clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });
  }

  return clerkClient;
}
