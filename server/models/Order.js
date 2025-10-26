import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional for guest orders
    },
    customerEmail: {
      type: String,
      required: false, // For guest orders or logged-in customers
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
        feedback: {
          rating: { type: Number, min: 1, max: 5 },
          description: { type: String },
          submittedAt: { type: Date }
        }
      },
    ],
    specialInstructions: { type: String },
    totalAmount: { type: Number, required: true },
    originalAmount: { type: Number }, // Amount before discount
    pointsRedeemed: { type: Number, default: 0 }, // Points used for discount
    discountAmount: { type: Number, default: 0 }, // Discount applied
    status: {
      type: String,
      enum: ["placed", "preparing", "ready", "delivered", "cancelled"],
      default: "placed",
    },
    estimatedWaitTime: { type: Number }, // in minutes
    estimatedReadyTime: { type: Date },
    feedback: {
      submitted: { type: Boolean, default: false },
      submittedAt: { type: Date },
      totalPoints: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
