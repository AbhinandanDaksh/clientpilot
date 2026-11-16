import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  name: { type: String, required: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
}, { timestamps: true, bufferCommands: false });

export const User = model("User", userSchema);
