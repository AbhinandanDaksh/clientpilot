import { Router } from "express";
import { z } from "zod";
import { Lead, identity } from "./leads.model.js";
import { runHunter, HunterRun } from "./hunter.js";

export const leadsRouter = Router();
const text = z.string().trim().min(1).max(150);
const url = z.union([z.url().refine(value => /^https?:\/\//.test(value), "Use HTTP or HTTPS"), z.literal("")]);
export const leadInput = z.object({
  name: text, category: text, location: text,
  website: url.optional(), email: z.union([z.email(), z.literal("")]).optional(),
  phone: z.string().trim().max(80).optional(), notes: z.string().max(4000).optional(),
  status: z.enum(["New", "Qualified", "Audited", "Contacted", "Rejected"]).optional(),
}).strict();
const objectId = z.string().regex(/^[a-f\d]{24}$/i);
leadsRouter.get("/hunter/runs", async (_req, res) => {
  res.json({ data: await HunterRun.find().sort({ startedAt: -1 }).limit(10) });
});
leadsRouter.post("/hunter/run", async (req, res) => {
  const input = z.object({ location: z.enum(["Modinagar", "Ghaziabad", "Modinagar + Ghaziabad"]).default("Modinagar + Ghaziabad"), limit: z.number().int().min(1).max(20).default(20) }).strict().parse(req.body ?? {});
  res.json({ data: await runHunter(input.location, input.limit) });
});
leadsRouter.get("/", async (req, res) => {
  const query = z.object({ search: z.string().max(150).optional(), location: text.optional(), category: text.optional(), status: leadInput.shape.status,
    page: z.coerce.number().int().min(1).max(10000).default(1), limit: z.coerce.number().int().min(1).max(100).default(20) }).parse(req.query);
  const filter: Record<string, unknown> = {};
  for (const key of ["location", "category", "status"] as const) if (query[key]) filter[key] = query[key];
  if (query.search) { const regex = query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); filter.$or = ["name", "location", "category"].map(key => ({ [key]: { $regex: regex, $options: "i" } })); }
  const [data, total] = await Promise.all([Lead.find(filter).sort({ discoveredAt: -1, _id: -1 }).skip((query.page - 1) * query.limit).limit(query.limit), Lead.countDocuments(filter)]);
  res.json({ data, total, page: query.page, limit: query.limit, attribution: "© OpenStreetMap contributors — https://www.openstreetmap.org/copyright (ODbL)" });
});
leadsRouter.post("/", async (req, res) => {
  const input = leadInput.parse(req.body);
  res.status(201).json({ data: await Lead.create({ ...input, identity: identity(input.name, input.location) }) });
});
leadsRouter.get("/:id", async (req, res) => {
  const lead = await Lead.findById(objectId.parse(req.params.id));
  if (!lead) { res.status(404).json({ error: { message: "Lead not found" } }); return; }
  res.json({ data: lead });
});
leadsRouter.patch("/:id", async (req, res) => {
  const input = leadInput.partial().refine(value => Object.keys(value).length > 0).parse(req.body);
  const lead = await Lead.findById(objectId.parse(req.params.id));
  if (!lead) { res.status(404).json({ error: { message: "Lead not found" } }); return; }
  lead.set(input); lead.identity = identity(lead.name, lead.location);
  res.json({ data: await lead.save() });
});
leadsRouter.delete("/:id", async (req, res) => {
  const lead = await Lead.findByIdAndDelete(objectId.parse(req.params.id));
  if (!lead) { res.status(404).json({ error: { message: "Lead not found" } }); return; }
  res.status(204).end();
});
