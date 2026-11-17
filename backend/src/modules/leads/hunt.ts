import { getDatabase, disconnectDatabase } from "../../config/database.js";
import { Lead } from "./leads.model.js";
import { runHunter } from "./hunter.js";

try {
  await getDatabase();
  await Lead.createIndexes();
  const run = await runHunter();
  console.log(JSON.stringify({ status: run.status, saved: run.saved, duplicates: run.duplicates, error: run.error }));
  if (run.status === "failed") process.exitCode = 1;
} catch (error) {
  console.error(error instanceof Error && "status" in error ? error.message : "Discovery could not start. Check MongoDB and network access.");
  process.exitCode = 1;
} finally { await disconnectDatabase(); }
