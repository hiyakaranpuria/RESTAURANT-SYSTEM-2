import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, unique: true },
    qrSlug: { type: String, required: true, unique: true },
    activeSessionId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Table", tableSchema);
