import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import { sanitizeInput } from "../middleware/validation.js";

const router = express.Router();

// Debug endpoint to test server connectivity
router.get("/debug", (req, res) => {
  res.json({ 
    message: "Feedback routes are working!", 
    timestamp: new Date().toISOString(),
    migration: "Migration routes should be available at /api/migration/test"
  });
});

// Temporary migration endpoint in feedback routes
router.post("/migrate-orders", async (req, res) => {
  try {
    console.log("Starting order migration from feedback routes...");
    
    // Get all orders that don't have customer information
    const ordersToUpdate = await Order.find({
      $or: [
        { customerEmail: { $exists: false } },
        { customerEmail: null },
        { customerEmail: "" }
      ]
    });

    console.log(`Found ${ordersToUpdate.length} orders to update`);

    let updatedCount = 0;
    
    for (const order of ordersToUpdate) {
      // Create a guest email based on table and restaurant
      const guestEmail = `guest-${order.restaurantId}-${order.tableNumber}@temp.com`;
      
      order.customerEmail = guestEmail;
      await order.save();
      
      // Create a guest customer record if it doesn't exist
      let customer = await Customer.findOne({ email: guestEmail });
      if (!customer) {
        customer = new Customer({
          email: guestEmail,
          name: `Guest (Table ${order.tableNumber})`,
          totalFeedbackPoints: 0,
          orderHistory: []
        });
        await customer.save();
      }
      
      updatedCount++;
    }

    console.log(`Updated ${updatedCount} orders`);

    res.json({
      message: "Migration completed successfully",
      ordersUpdated: updatedCount,
      totalOrders: ordersToUpdate.length
    });

  } catch (error) {
    console.error("Migration error:", error);
    res.status(500).json({ message: "Migration failed", error: error.message });
  }
});

// Submit feedback for an order
router.post("/order/:orderId", sanitizeInput, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { itemFeedbacks, customerEmail } = req.body;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if feedback already submitted
    if (order.feedback && order.feedback.submitted) {
      return res.status(400).json({ 
        message: "Feedback already submitted for this order",
        code: "FEEDBACK_ALREADY_SUBMITTED"
      });
    }

    let totalPoints = 0;
    
    // Update order items with feedback
    order.items.forEach((item, index) => {
      const feedback = itemFeedbacks.find(f => f.itemIndex === index);
      if (feedback) {
        item.feedback = {
          rating: feedback.rating,
          description: feedback.description || "",
          submittedAt: new Date()
        };
        
        // Calculate points: 1 star = 2 points, 2 stars = 4 points, etc.
        const points = feedback.rating * 2;
        totalPoints += points * item.quantity;
      }
    });

    // Update order feedback status
    order.feedback = {
      submitted: true,
      submittedAt: new Date(),
      totalPoints
    };

    await order.save();

    // Update customer record - create guest email if none exists
    let email = customerEmail || order.customerEmail;
    if (!email) {
      // Create a guest email for orders without customer info
      email = `guest-${order.restaurantId}-${order.tableNumber}@temp.com`;
      order.customerEmail = email;
      await order.save();
    }

    let customer = await Customer.findOne({ email });
    
    if (!customer) {
      customer = new Customer({
        userId: order.customerId || null,
        email: email,
        name: email.includes('guest-') ? `Guest (Table ${order.tableNumber})` : null,
        totalFeedbackPoints: 0,
        orderHistory: []
      });
    }

    // Add to order history
    const orderHistoryItem = {
      orderId: order._id,
      restaurantId: order.restaurantId,
      tableNumber: order.tableNumber,
      items: order.items.map(item => ({
        menuItemId: item.menuItemId,
        name: item.name,
        rating: item.feedback?.rating,
        description: item.feedback?.description,
        points: item.feedback?.rating ? (item.feedback.rating * 2) * item.quantity : 0,
        feedbackDate: item.feedback?.submittedAt
      })).filter(item => item.rating),
      orderDate: order.createdAt,
      totalPoints
    };

    customer.orderHistory.push(orderHistoryItem);
    customer.totalFeedbackPoints += totalPoints;

    await customer.save();

    res.json({
      message: "Feedback submitted successfully",
      pointsEarned: totalPoints,
      totalPoints: customer.totalFeedbackPoints
    });

  } catch (error) {
    console.error("Feedback submission error:", error);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
});

// Get customer feedback history
router.get("/customer/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const customer = await Customer.findOne({ sessionId })
      .populate('orderHistory.items.menuItemId', 'name imageUrl');
    
    if (!customer) {
      return res.json({
        totalPoints: 0,
        orderHistory: []
      });
    }

    res.json({
      totalPoints: customer.totalFeedbackPoints,
      orderHistory: customer.orderHistory
    });

  } catch (error) {
    console.error("Error fetching customer feedback:", error);
    res.status(500).json({ message: "Failed to fetch feedback history" });
  }
});

// Get customer orders by email
router.get("/customer/email/:email/orders", async (req, res) => {
  try {
    const { email } = req.params;
    
    console.log("Debug - Customer email:", email);
    
    // Get customer record
    const customer = await Customer.findOne({ email });
    const totalPoints = customer?.totalFeedbackPoints || 0;
    console.log("Debug - Customer found:", !!customer, "Total points:", totalPoints);
    
    // Get all orders for this customer
    const orders = await Order.find({
      customerEmail: email
    })
    .populate('items.menuItemId', 'name imageUrl')
    .populate('restaurantId', 'restaurantName')
    .sort({ createdAt: -1 });

    console.log("Debug - Orders found for customer:", orders.length);

    // Format orders for response
    const orderHistory = orders.map(order => ({
      orderId: order._id,
      orderDate: order.createdAt,
      status: order.status,
      totalAmount: order.totalAmount,
      tableNumber: order.tableNumber,
      restaurantName: order.restaurantId?.restaurantName || 'Unknown Restaurant',
      feedbackSubmitted: order.feedback?.submitted || false,
      totalPoints: order.feedback?.totalPoints || 0,
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

    res.json({
      totalPoints,
      orderHistory,
      debug: {
        email,
        customerFound: !!customer,
        ordersCount: orders.length
      }
    });

  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res.status(500).json({ message: "Failed to fetch customer orders" });
  }
});

// Get all customer orders (including those without feedback) - Legacy route for table sessions
router.get("/customer/:sessionId/orders", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const [restaurantId, tableNumber] = sessionId.split('-');
    
    console.log("Debug - SessionId:", sessionId);
    console.log("Debug - RestaurantId:", restaurantId);
    console.log("Debug - TableNumber:", tableNumber);
    
    // Try to find customer by session (old way) or by guest email (new way)
    let customer = await Customer.findOne({ sessionId });
    if (!customer) {
      const guestEmail = `guest-${restaurantId}-${tableNumber}@temp.com`;
      customer = await Customer.findOne({ email: guestEmail });
    }
    
    const totalPoints = customer?.totalFeedbackPoints || 0;
    console.log("Debug - Customer found:", !!customer, "Total points:", totalPoints);
    
    // First, let's see all orders for this restaurant
    const allOrders = await Order.find({ restaurantId: new mongoose.Types.ObjectId(restaurantId) });
    console.log("Debug - All orders for restaurant:", allOrders.length);
    console.log("Debug - Sample order tableNumbers:", allOrders.slice(0, 3).map(o => o.tableNumber));
    
    // Get all orders for this session (convert restaurantId to ObjectId)
    const orders = await Order.find({
      restaurantId: new mongoose.Types.ObjectId(restaurantId),
      tableNumber: tableNumber
    })
    .populate('items.menuItemId', 'name imageUrl')
    .sort({ createdAt: -1 });

    console.log("Debug - Orders found for session:", orders.length);

    // Calculate total points from orders if no customer record exists
    let calculatedPoints = totalPoints;
    if (!customer) {
      calculatedPoints = orders.reduce((sum, order) => {
        return sum + (order.feedback?.totalPoints || 0);
      }, 0);
    }

    // Format orders for response
    const orderHistory = orders.map(order => ({
      orderId: order._id,
      orderDate: order.createdAt,
      status: order.status,
      totalAmount: order.totalAmount,
      feedbackSubmitted: order.feedback?.submitted || false,
      totalPoints: order.feedback?.totalPoints || 0,
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

    res.json({
      totalPoints: calculatedPoints,
      orderHistory,
      debug: {
        sessionId,
        restaurantId,
        tableNumber,
        allOrdersCount: allOrders.length,
        matchingOrdersCount: orders.length,
        customerFound: !!customer,
        calculatedPoints
      }
    });

  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res.status(500).json({ message: "Failed to fetch customer orders" });
  }
});

export default router;