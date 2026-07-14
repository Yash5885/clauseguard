import "dotenv/config";
import app from "./app.js";
import { closeDatabaseConnection } from "./config/database.js";

const port = Number(process.env.PORT ?? 3000);

const server = app.listen(port, () => {
  console.log(`ClauseGuard API listening on http://localhost:${port}`);
});

async function shutdown(signal) {
  console.log(`${signal} received, shutting down gracefully`);

  server.close(async () => {
    await closeDatabaseConnection();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
