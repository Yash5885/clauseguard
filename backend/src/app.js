import cors from "cors";
import express from "express";
import helmet from "helmet";
import healthRouter from "./routes/health.js";

const app = express();
const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: clientOrigin }));
app.use(express.json({ limit: "1mb" }));

app.get("/", (_request, response) => {
  response.json({
    name: "ClauseGuard API",
    health: "/api/health",
  });
});

app.use("/api/health", healthRouter);

app.use((_request, response) => {
  response.status(404).json({ error: "Route not found" });
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ error: "Internal server error" });
});

export default app;
