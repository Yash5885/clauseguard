import { Router } from "express";
import { checkDatabaseConnection } from "../config/database.js";

const healthRouter = Router();

healthRouter.get("/", (_request, response) => {
  response.json({
    status: "ok",
    service: "clauseguard-api",
    timestamp: new Date().toISOString(),
  });
});

healthRouter.get("/database", async (_request, response) => {
  try {
    const database = await checkDatabaseConnection();

    response.json({ status: "ok", database });
  } catch (error) {
    response.status(503).json({
      status: "unavailable",
      message: error.message,
    });
  }
});

export default healthRouter;
