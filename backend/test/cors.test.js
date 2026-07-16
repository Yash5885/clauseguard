import assert from "node:assert/strict";
import test from "node:test";
import { createCorsOptions, getAllowedOrigins } from "../src/config/cors.js";

function checkOrigin(options, origin) {
  return new Promise((resolve, reject) => {
    options.origin(origin, (error, allowed) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(allowed);
    });
  });
}

test("CORS accepts a comma-separated production allowlist", async () => {
  const environment = {
    NODE_ENV: "production",
    CORS_ALLOWED_ORIGINS:
      "https://clauseguard.example, https://preview.example/",
  };
  const options = createCorsOptions(environment);

  assert.deepEqual(getAllowedOrigins(environment), [
    "https://clauseguard.example",
    "https://preview.example",
  ]);
  assert.equal(
    await checkOrigin(options, "https://clauseguard.example"),
    true,
  );
  assert.equal(await checkOrigin(options, "https://unknown.example"), false);
  assert.equal(await checkOrigin(options, undefined), true);
});

test("CORS defaults to the local Vite origin outside production", () => {
  assert.deepEqual(getAllowedOrigins({ NODE_ENV: "development" }), [
    "http://localhost:5173",
  ]);
});

test("CORS fails closed when production origins are not configured", () => {
  assert.deepEqual(getAllowedOrigins({ NODE_ENV: "production" }), []);
});
