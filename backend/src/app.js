import cors from "cors";
import express from "express";
import helmet from "helmet";
import { createClerkRequestMiddleware } from "./config/clerk.js";
import { createCorsOptions } from "./config/cors.js";
import documentsRouter from "./routes/documents.js";
import healthRouter from "./routes/health.js";
import usersRouter from "./routes/users.js";

const app = express();
// Clerk must inspect the original request before other middleware changes it.
app.use(createClerkRequestMiddleware());
app.disable("x-powered-by");
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}
app.use(helmet());
app.use(cors(createCorsOptions()));
app.use(express.json({ limit: "1mb" }));

app.get("/", (_request, response) => {
  response.json({
    name: "Clause Guard API",
    health: "/api/health",
  });
});

app.use("/api/health", healthRouter);
app.use("/api", usersRouter);
app.use("/api", documentsRouter);

app.use((_request, response) => {
  response.status(404).json({ error: "Route not found" });
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ error: "Internal server error" });
});

export default app;
