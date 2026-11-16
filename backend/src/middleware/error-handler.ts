import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const status = typeof error?.status === "number" && error.status >= 400 && error.status <= 599 ? error.status : 500;
  if (status >= 500) console.error(error);
  res.status(status).json({ error: { message: status === 500 ? "Internal server error" : status === 413 ? "Request body too large" : "Invalid request" } });
};
