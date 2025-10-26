import express from "express";
import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Test endpoint to verify migration routes are working
router.get("/test", (req, res) => {
  res.json({ message: "Migration routes are working!" });
});

// Simple migration route without authentication (for testing)
router.post("/update-orders-simple", async (req, res) => {
  try {
    console.log("Starting simple order migration...");
    
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

// Migration route to update existing orders (Admin only)
router.post("/update-orders", authenticate, requireAdmin, async (req, res) => {
  try {
    console.log("Starting order migration...");
    
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
      // For now, we'll create a guest email based on table and restaurant
      // In a real scenario, you might want to prompt users to claim their orders
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

// Route to link guest orders to a real customer account
router.post("/claim-orders", async (req, res) => {
  try {
    const { customerEmail, guestEmail } = req.body;

    if (!customerEmail || !guestEmail) {
      return res.status(400).json({ message: "Both customerEmail and guestEmail are required" });
    }

    // Find all orders with the guest email
    const guestOrders = await Order.find({ customerEmail: guestEmail });
    
    if (guestOrders.length === 0) {
      return res.status(404).json({ message: "No guest orders found" });
    }

    // Update all guest orders to the real customer email
    await Order.updateMany(
      { customerEmail: guestEmail },
      { customerEmail: customerEmail }
    );

    // Find or create the real customer record
    let realCustomer = await Customer.findOne({ email: customerEmail });
    if (!realCustomer) {
      realCustomer = new Customer({
        email: customerEmail,
        totalFeedbackPoints: 0,
        orderHistory: []
      });
    }

    // Find the guest customer record
    const guestCustomer = await Customer.findOne({ email: guestEmail });
    
    if (guestCustomer) {
      // Transfer points and order history
      realCustomer.totalFeedbackPoints += guestCustomer.totalFeedbackPoints;
      realCustomer.orderHistory.push(...guestCustomer.orderHistory);
      
      // Delete the guest customer record
      await Customer.deleteOne({ email: guestEmail });
    }

    await realCustomer.save();

    res.json({
      message: "Orders claimed successfully",
      ordersTransferred: guestOrders.length,
      pointsTransferred: guestCustomer?.totalFeedbackPoints || 0
    });

  } catch (error) {
    console.error("Claim orders error:", error);
    res.status(500).json({ message: "Failed to claim orders", error: error.message });
  }
});

export default router;