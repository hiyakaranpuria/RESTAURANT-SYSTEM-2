import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional for guest customers
    },
    email: {
      type: String,
      required: true,
      index: true
    },
    name: {
      type: String,
      required: false
    },
    phone: {
      type: String,
      required: false
    },
    totalFeedbackPoints: { type: Number, default: 0 },
    orderHistory: [
      {
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
        },
        restaurantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Restaurant",
        },
        tableNumber: { type: String },
        items: [
          {
            menuItemId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "MenuItem",
            },
            name: { type: String },
            rating: { type: Number, min: 1, max: 5 },
            description: { type: String },
            points: { type: Number, default: 0 },
            feedbackDate: { type: Date }
          }
        ],
        orderDate: { type: Date },
        totalPoints: { type: Number, default: 0 }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);