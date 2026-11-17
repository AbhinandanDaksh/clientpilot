import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) { res.status(400).json({ error: { message: "Invalid input", issues: error.issues } }); return; }
  if (error?.code === 11000) { res.status(409).json({ error: { message: "This business already exists in this location or source." } }); return; }
  if (error?.status === 429) { res.status(429).json({ error: { message: error.message } }); return; }
  const status = typeof error?.status === "number" && error.status >= 400 && error.status <= 599 ? error.status : 500;
  if (status >= 500) console.error(error);
  res.status(status).json({ error: { message: status === 500 ? "Internal server error" : status === 413 ? "Request body too large" : "Invalid request" } });
};
