import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { env } from "./config/env.js";
import { getDatabase } from "./config/database.js";
import { errorHandler } from "./middleware/error-handler.js";
import { leadsRouter } from "./modules/leads/leads.routes.js";

export const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_ORIGIN }));
app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: "draft-8", legacyHeaders: false }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/v1/health", (_req, res) => {
  res.json({ status: "ok", service: "clientpilot-backend" });
});

app.get("/api/v1/health/ready", async (_req, res) => {
  try {
    const database = await getDatabase();
    await database.command({ ping: 1 }, { timeoutMS: 5000 });
    res.json({ status: "ready" });
  } catch {
    res.status(503).json({ status: "not_ready", error: { message: "Database unavailable" } });
  }
});

app.use("/api/leads", leadsRouter);
app.use("/api/v1/leads", leadsRouter);
app.use((_req, res) => { res.status(404).json({ error: { message: "Route not found" } }); });
app.use(errorHandler);
