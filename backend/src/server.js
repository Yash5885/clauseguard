import dotenv from "dotenv";

dotenv.config({ path: new URL("../../.env", import.meta.url) });

const { default: app } = await import("./app.js");
const { closeDatabaseConnection } = await import("./config/database.js");
const { ensureDatabaseSchema } = await import("./config/schema.js");

const port = Number(process.env.PORT ?? 3000);
let server;

async function startServer() {
  await ensureDatabaseSchema();

  server = app.listen(port, () => {
    console.log(`ClauseGuard API listening on http://localhost:${port}`);
  });
}

async function shutdown(signal) {
  console.log(`${signal} received, shutting down gracefully`);

  server?.close(async () => {
    await closeDatabaseConnection();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer().catch((error) => {
  console.error("Unable to start ClauseGuard API", error);
  process.exit(1);
});
