import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuCategory",
    },
    imageUrl: { type: String },
    availability: { type: Boolean, default: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

menuItemSchema.index({ name: "text", tags: "text" });
menuItemSchema.index({ categoryId: 1, name: 1 });

export default mongoose.model("MenuItem", menuItemSchema);
