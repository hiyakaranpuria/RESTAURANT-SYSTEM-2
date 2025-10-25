import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    tableNumber: {
      type: String,
      required: true,
    },
    items: [
      {
        menuItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    specialInstructions: { type: String },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["placed", "preparing", "ready", "delivered", "cancelled"],
      default: "placed",
    },
    estimatedWaitTime: { type: Number }, // in minutes
    estimatedReadyTime: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
