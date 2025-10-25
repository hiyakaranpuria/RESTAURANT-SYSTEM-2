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
    isVeg: { type: Boolean, default: true },
    tags: [{ type: String }],

    // Customization options
    sizes: [
      {
        name: { type: String, required: true }, // Small, Medium, Large
        price: { type: Number, required: true },
        isDefault: { type: Boolean, default: false },
      },
    ],
    addOns: [
      {
        name: { type: String, required: true }, // Extra cheese, Bacon, etc.
        price: { type: Number, required: true },
        isVeg: { type: Boolean, default: true },
      },
    ],
    customizationOptions: [
      {
        name: { type: String, required: true }, // Spice Level, Cooking Preference
        type: { type: String, enum: ["single", "multiple"], default: "single" },
        required: { type: Boolean, default: false },
        options: [
          {
            label: { type: String, required: true },
            priceModifier: { type: Number, default: 0 },
          },
        ],
      },
    ],
    excludableIngredients: [{ type: String }], // Onions, Garlic, etc.
    allowSpecialInstructions: { type: Boolean, default: true },
    enableCustomization: { type: Boolean, default: false }, // Toggle to enable/disable customization for this item
  },
  { timestamps: true }
);

menuItemSchema.index({ name: "text", tags: "text" });
menuItemSchema.index({ categoryId: 1, name: 1 });

export default mongoose.model("MenuItem", menuItemSchema);
