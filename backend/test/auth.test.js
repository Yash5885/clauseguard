import assert from "node:assert/strict";
import test from "node:test";
import { createRequireAuthenticatedUser } from "../src/middleware/auth.js";

function createResponse() {
  return {
    body: undefined,
    statusCode: 200,
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

test("auth middleware rejects requests without a Clerk session", () => {
  const middleware = createRequireAuthenticatedUser(() => ({
    isAuthenticated: false,
    userId: null,
  }));
  const response = createResponse();
  let nextCalled = false;

  middleware({}, response, () => {
    nextCalled = true;
  });

  assert.equal(response.statusCode, 401);
  assert.deepEqual(response.body, { error: "Authentication required" });
  assert.equal(nextCalled, false);
});

test("auth middleware passes a verified Clerk session to the route", () => {
  const auth = {
    isAuthenticated: true,
    userId: "user_clerk_123",
    sessionId: "sess_123",
  };
  const middleware = createRequireAuthenticatedUser(() => auth);
  const requestObject = {};
  const response = createResponse();
  let nextCalled = false;

  middleware(requestObject, response, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(requestObject.clerkAuth, auth);
  assert.equal(response.statusCode, 200);
});

test("auth middleware reports missing Clerk configuration clearly", () => {
  const middleware = createRequireAuthenticatedUser(() => {
    throw new Error("auth should not be read without configuration");
  });
  const response = createResponse();

  middleware({ clerkConfigured: false }, response, () => {
    throw new Error("next should not be called");
  });

  assert.equal(response.statusCode, 503);
  assert.deepEqual(response.body, {
    error: "Clerk authentication is not configured",
  });
});
