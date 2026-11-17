import { Schema, model } from "mongoose";

const leadSchema = new Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  website: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  notes: { type: String, default: "" },
  source: { type: String, default: "Manual entry" },
  sourceUrl: { type: String, default: "" },
  sourceId: { type: String },
  status: { type: String, enum: ["New", "Qualified", "Audited", "Contacted", "Rejected"], default: "New" },
  discoveredAt: { type: Date, default: Date.now },
  identity: { type: String, required: true, unique: true, select: false },
}, { timestamps: true, bufferCommands: false });
leadSchema.index({ sourceId: 1 }, { unique: true, sparse: true });
export const Lead = model("Lead", leadSchema);

export function identity(name: string, location: string) {
  const normalize = (value: string) => value.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
  return `${normalize(name)}:${normalize(location)}`;
}
