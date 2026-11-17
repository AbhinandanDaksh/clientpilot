import { app } from "./app.js";
import { env } from "./config/env.js";
import { disconnectDatabase, getDatabase } from "./config/database.js";
import { Lead } from "./modules/leads/leads.model.js";
import { startHunterSchedule } from "./modules/leads/hunter.js";

console.log("Connecting to MongoDB...");
try {
  const database = await getDatabase();
  await database.command({ ping: 1 }, { timeoutMS: 5000 });
  await Lead.createIndexes();
  console.log("MongoDB connected successfully");
} catch (error) {
  const message = error instanceof Error ? error.message : "";
  const reason = !env.MONGODB_URI
    ? "MONGODB_URI is missing in backend/.env."
    : /auth|credential|password/i.test(message)
      ? "Authentication failed. Check the database username, password and URL encoding in MONGODB_URI."
      : "Database unavailable. Check MONGODB_URI, network access and whether MongoDB is running.";
  console.error(`MongoDB connection failed: ${reason}`);
  await disconnectDatabase().catch(() => undefined);
  process.exit(1);
}

const server = app.listen(env.PORT, env.HOST, () => {
  console.log(`ClientPilot API listening on http://localhost:${env.PORT}`);
});
const stopSchedule = startHunterSchedule();

server.on("error", (error) => { console.error(error); process.exitCode = 1; });

function shutdown() {
  stopSchedule();
  const timeout = setTimeout(() => process.exit(1), 10_000);
  timeout.unref();
  server.close(async () => {
    try { await disconnectDatabase(); }
    catch (error) { console.error(error); process.exitCode = 1; }
    finally { clearTimeout(timeout); }
  });
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
