import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  HOST: z.string().default("127.0.0.1"),
  FRONTEND_ORIGIN: z.url().default("http://localhost:3000"),
  MONGODB_URI: z.string().regex(/^mongodb(?:\+srv)?:\/\//, "Expected a MongoDB connection string").optional(),
});

export const env = schema.parse(process.env);
