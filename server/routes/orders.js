import express from "express";
import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
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

// Debug endpoint to test restaurant authentication
router.get("/debug", authenticate, requireRestaurant, async (req, res) => {
  try {
    res.json({
      message: "Restaurant authentication working!",
      restaurantId: req.restaurantId,
      restaurant: req.restaurant?.restaurantName || "Unknown"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new order (public - no auth required but rate limited)
router.post(
  "/",
  orderLimiter,
  sanitizeInput,
  validateOrderCreation,
  async (req, res) => {
    try {
      console.log("Order creation request body:", req.body);
      
      const {
        restaurantId,
        tableNumber,
        items,
        specialInstructions,
        totalAmount,
        customerInfo, // { email, name, phone, userId }
      } = req.body;

      const orderData = {
        restaurantId,
        tableNumber,
        items,
        specialInstructions,
        totalAmount,
        status: "placed",
      };

      // Add customer information if provided
      if (customerInfo) {
        console.log("Customer info provided:", customerInfo);
        if (customerInfo.userId) {
          orderData.customerId = customerInfo.userId;
        }
        if (customerInfo.email) {
          orderData.customerEmail = customerInfo.email;
        }
      } else {
        console.log("No customer info provided, creating guest order");
        // For guest orders, create a guest email
        const guestEmail = `guest-${restaurantId}-${tableNumber}@temp.com`;
        orderData.customerEmail = guestEmail;
      }

      console.log("Final order data:", orderData);

      const order = await Order.create(orderData);
      console.log("Order created successfully:", order._id);

      // Create or update customer record
      const emailToUse = customerInfo?.email || `guest-${restaurantId}-${tableNumber}@temp.com`;
      
      try {
        let customer = await Customer.findOne({ email: emailToUse });
        if (!customer) {
          customer = new Customer({
            userId: customerInfo?.userId || null,
            email: emailToUse,
            name: customerInfo?.name || (emailToUse.includes('guest-') ? `Guest (Table ${tableNumber})` : null),
            phone: customerInfo?.phone || null,
            totalFeedbackPoints: 0,
            orderHistory: []
          });
          await customer.save();
          console.log("Customer record created:", customer._id);
        } else {
          console.log("Customer record found:", customer._id);
        }
      } catch (customerError) {
        console.error("Customer record error (non-critical):", customerError);
        // Don't fail the order if customer record creation fails
      }

      await order.populate("restaurantId");
      res.status(201).json(order);
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(500).json({ 
        message: error.message,
        details: error.stack,
        requestBody: req.body
      });
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

// Get all orders with feedback details for a restaurant (requires auth)
router.get("/all-with-feedback", authenticate, requireRestaurant, async (req, res) => {
  try {
    const orders = await Order.find({ restaurantId: req.restaurantId })
      .populate("restaurantId")
      .populate("items.menuItemId", "name imageUrl")
      .sort("-createdAt");

    // Format orders with feedback details
    const formattedOrders = orders.map(order => ({
      orderId: order._id,
      orderDate: order.createdAt,
      status: order.status,
      tableNumber: order.tableNumber,
      customerEmail: order.customerEmail,
      totalAmount: order.totalAmount,
      specialInstructions: order.specialInstructions,
      feedbackSubmitted: order.feedback?.submitted || false,
      totalFeedbackPoints: order.feedback?.totalPoints || 0,
      feedbackDate: order.feedback?.submittedAt,
      items: order.items.map(item => ({
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        rating: item.feedback?.rating,
        description: item.feedback?.description,
        points: item.feedback?.rating ? (item.feedback.rating * 2) * item.quantity : 0,
        feedbackDate: item.feedback?.submittedAt,
        imageUrl: item.menuItemId?.imageUrl
      }))
    }));

    // Calculate summary statistics
    const totalOrders = orders.length;
    const ordersWithFeedbackCount = orders.filter(o => o.feedback?.submitted).length;
    const totalFeedbackPoints = orders.reduce((sum, o) => sum + (o.feedback?.totalPoints || 0), 0);
    const averageRating = orders.length > 0 ? 
      orders.reduce((sum, order) => {
        const orderRatings = order.items.filter(item => item.feedback?.rating).map(item => item.feedback.rating);
        const orderAvg = orderRatings.length > 0 ? orderRatings.reduce((a, b) => a + b, 0) / orderRatings.length : 0;
        return sum + orderAvg;
      }, 0) / orders.length : 0;

    res.json({
      orders: formattedOrders,
      summary: {
        totalOrders,
        ordersWithFeedback: ordersWithFeedbackCount,
        totalFeedbackPoints,
        averageRating: Math.round(averageRating * 10) / 10,
        feedbackRate: totalOrders > 0 ? Math.round((ordersWithFeedbackCount / totalOrders) * 100) : 0
      }
    });
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
