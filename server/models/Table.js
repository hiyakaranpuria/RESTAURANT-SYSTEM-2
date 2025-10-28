import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    number: { type: String, required: true },
    qrSlug: { type: String, required: true, unique: true },
    activeSessionId: { type: String },
  },
  { timestamps: true }
);

// Compound index to ensure unique table numbers per restaurant
tableSchema.index({ restaurantId: 1, number: 1 }, { unique: true });

export default mongoose.model("Table", tableSchema);
