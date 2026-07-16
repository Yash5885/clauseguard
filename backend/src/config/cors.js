const LOCAL_FRONTEND_ORIGIN = "http://localhost:5173";

function normalizeOrigin(value) {
  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("only http and https origins are supported");
    }

    return url.origin;
  } catch (error) {
    throw new Error(`Invalid CORS origin \"${value}\": ${error.message}`);
  }
}

export function getAllowedOrigins(environment = process.env) {
  const configuredOrigins =
    environment.CORS_ALLOWED_ORIGINS ?? environment.CLIENT_ORIGIN;

  if (!configuredOrigins?.trim()) {
    return environment.NODE_ENV === "production"
      ? []
      : [LOCAL_FRONTEND_ORIGIN];
  }

  return [
    ...new Set(
      configuredOrigins
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
        .map(normalizeOrigin),
    ),
  ];
}

export function createCorsOptions(environment = process.env) {
  const allowedOrigins = new Set(getAllowedOrigins(environment));

  return {
    origin(origin, callback) {
      // Requests without an Origin header are server-to-server calls, health
      // checks, or same-origin navigation and do not need a CORS decision.
      callback(null, !origin || allowedOrigins.has(origin));
    },
  };
}
