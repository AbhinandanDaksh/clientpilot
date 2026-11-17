import { Schema, model } from "mongoose";
import { Lead, identity } from "./leads.model.js";

export const HunterRun = model("HunterRun", new Schema({
  _id: String, startedAt: Date, finishedAt: Date, location: String,
  status: String, saved: { type: Number, default: 0 }, duplicates: { type: Number, default: 0 }, error: String,
}, { bufferCommands: false }));
const Lock = model("HunterLock", new Schema({ _id: String, until: Date }, { bufferCommands: false }));
const cities = { Modinagar: [28.83, 77.54, 28.94, 77.64], Ghaziabad: [28.61, 77.36, 28.74, 77.51] };
type Element = { type: "node" | "way" | "relation"; id: number; tags: Record<string, string> };
export function candidate(element: Element, city: string) {
  const t = element.tags;
  if (!t?.name?.trim()) return null;
  const website = t.website || t["contact:website"] || "";
  return { name: t.name.trim(), location: city, category: t.shop || t.amenity || t.tourism || "Business",
    website: /^https?:\/\//i.test(website) ? website : "", phone: t.phone || t["contact:phone"] || "",
    email: t.email || t["contact:email"] || "", source: "OpenStreetMap", sourceId: `${element.type}/${element.id}`,
    sourceUrl: `https://www.openstreetmap.org/${element.type}/${element.id}`,
    identity: identity(t.name, city), status: "New" as const };
}
export async function runHunter(location = "Modinagar + Ghaziabad", limit = 20, scheduledId?: string) {
  const now = new Date();
  try {
    await Lock.findOneAndUpdate({ _id: "discovery", until: { $lte: now } }, { $set: { until: new Date(now.getTime() + 10 * 60_000) } }, { upsert: true });
  } catch (error) {
    if ((error as { code?: number }).code === 11000) throw Object.assign(new Error("Discovery is running or cooling down. Try again in ten minutes."), { status: 429 });
    throw error;
  }
  const run = await HunterRun.create({ _id: scheduledId ?? crypto.randomUUID(), startedAt: now, location, status: "running" });
  try {
    for (const [city, bounds] of Object.entries(cities)) {
      if (location !== "Modinagar + Ghaziabad" && location !== city) continue;
      const bbox = bounds.join(",");
      const query = `[out:json][timeout:25][maxsize:16777216];(nwr["name"]["shop"](${bbox});nwr["name"]["amenity"~"^(restaurant|cafe|clinic|dentist|hospital|pharmacy)$"](${bbox});nwr["name"]["tourism"~"^(hotel|guest_house)$"](${bbox}););out tags 200;`;
      const response = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: new URLSearchParams({ data: query }), headers: { "User-Agent": "ClientPilot-local-lead-hunter/0.1", "Content-Type": "application/x-www-form-urlencoded" }, signal: AbortSignal.timeout(45_000) });
      if (!response.ok) throw new Error(`OpenStreetMap discovery unavailable (${response.status}); retry later.`);
      const payload = await response.json() as { elements?: Element[]; remark?: string };
      if (payload.remark || !Array.isArray(payload.elements)) throw new Error("Discovery returned incomplete data; retry later.");
      for (const element of payload.elements) {
        if (run.saved >= limit) break;
        const lead = candidate(element, city);
        if (!lead) continue;
        try { await Lead.create(lead); run.saved++; }
        catch (error) { if ((error as { code?: number }).code === 11000) run.duplicates++; else throw error; }
      }
      if (run.saved >= limit) break;
    }
    run.status = "completed";
  } catch (error) { run.status = "failed"; run.error = error instanceof Error ? error.message : "Discovery failed"; }
  run.finishedAt = new Date(); await run.save();
  return run;
}
export function startHunterSchedule() {
  // IST has no daylight-saving transitions. A persisted date key prevents reruns after restarts.
  const tick = async () => {
    const ist = new Date(Date.now() + 330 * 60_000);
    if (ist.getUTCHours() !== 9 || ist.getUTCMinutes() !== 0) return;
    const id = `daily-${ist.toISOString().slice(0, 10)}`;
    if (await HunterRun.exists({ _id: id })) return;
    await runHunter("Modinagar + Ghaziabad", 20, id);
  };
  const timer = setInterval(() => { void tick().catch(error => console.error("Lead Hunter schedule:", error.message)); }, 30_000);
  timer.unref();
  return () => clearInterval(timer);
}
