import express from "express";
import Order from "../models/Order.js";
import {
  authenticate,
  requireRestaurant,
  optionalAuth,
} from "../middleware/auth.js";
import { orderLimiter } from "../middleware/rateLimiter.js";
import {
  validateOrderCreation,
  sanitizeInput,
} from "../middleware/validation.js";

const router = express.Router();

// Create new order (public - no auth required but rate limited)
router.post(
  "/",
  orderLimiter,
  sanitizeInput,
  validateOrderCreation,
  async (req, res) => {
    try {
      const {
        restaurantId,
        tableNumber,
        items,
        specialInstructions,
        totalAmount,
      } = req.body;

      const order = await Order.create({
        restaurantId,
        tableNumber,
        items,
        specialInstructions,
        totalAmount,
        status: "placed",
      });

      await order.populate("restaurantId");
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Get all orders for a restaurant (requires auth)
router.get("/", authenticate, requireRestaurant, async (req, res) => {
  try {
    const { status } = req.query;

    const query = { restaurantId: req.restaurantId };
    if (status) {
      query.status = { $in: status.split(",") };
    }

    const orders = await Order.find(query)
      .populate("restaurantId")
      .sort("-createdAt");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single order by ID (public - for customer tracking)
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("restaurantId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (requires auth)
router.patch(
  "/:id/status",
  authenticate,
  requireRestaurant,
  sanitizeInput,
  async (req, res) => {
    try {
      const { status, estimatedWaitTime, estimatedReadyTime } = req.body;

      const updateData = { status };

      // Add wait time fields if provided
      if (estimatedWaitTime !== undefined) {
        updateData.estimatedWaitTime = estimatedWaitTime;
      }
      if (estimatedReadyTime !== undefined) {
        updateData.estimatedReadyTime = estimatedReadyTime;
      }

      const order = await Order.findOneAndUpdate(
        { _id: req.params.id, restaurantId: req.restaurantId },
        updateData,
        { new: true }
      ).populate("restaurantId");

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
