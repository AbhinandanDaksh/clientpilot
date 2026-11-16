import mongoose from "mongoose";
import { env } from "./env.js";

let connecting: Promise<typeof mongoose> | undefined;

export async function getDatabase() {
  if (!env.MONGODB_URI) throw new Error("MONGODB_URI is required for database operations");
  if (mongoose.connection.readyState !== 1) {
    connecting ??= mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      bufferCommands: false,
      autoIndex: env.NODE_ENV !== "production",
    }).finally(() => { connecting = undefined; });
    await connecting;
  }
  const database = mongoose.connection.db;
  if (!database) throw new Error("MongoDB connection unavailable");
  return database;
}

export async function disconnectDatabase() {
  if (connecting) await connecting.catch(() => undefined);
  await mongoose.disconnect();
}
