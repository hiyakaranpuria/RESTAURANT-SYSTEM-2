import express from "express";
import Table from "../models/Table.js";
import { authenticate, requireRestaurant } from "../middleware/auth.js";
import { sanitizeInput } from "../middleware/validation.js";
import crypto from "crypto";

const router = express.Router();

// Test route to verify table model
router.get("/test", async (req, res) => {
  try {
    console.log("Testing table model...");
    const testTable = new Table({
      restaurantId: "507f1f77bcf86cd799439011", // dummy ObjectId
      number: "test",
      qrSlug: "test-slug"
    });
    console.log("Test table created:", testTable);
    res.json({ message: "Table model test successful", table: testTable });
  } catch (error) {
    console.error("Table model test failed:", error);
    res.status(500).json({ message: "Table model test failed", error: error.message });
  }
});

// Get all tables for a restaurant
router.get("/:restaurantId/tables", authenticate, requireRestaurant, async (req, res) => {
  try {
    const { restaurantId } = req.params;
    
    const tables = await Table.find({ restaurantId }).sort({ number: 1 });
    res.json(tables);
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ message: "Failed to fetch tables" });
  }
});

// Generate tables for a restaurant
router.post("/:restaurantId/generate-tables", authenticate, requireRestaurant, sanitizeInput, async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { numberOfTables } = req.body;

    console.log(`Generating ${numberOfTables} tables for restaurant ${restaurantId}`);
    console.log("Request user:", req.user);
    console.log("Request restaurant:", req.restaurant);

    if (!numberOfTables || numberOfTables < 1 || numberOfTables > 50) {
      return res.status(400).json({ message: "Number of tables must be between 1 and 50" });
    }

    // Debug: Log the restaurant ID being received
    console.log("Received restaurant ID:", restaurantId);
    console.log("Restaurant ID type:", typeof restaurantId);
    console.log("Restaurant ID length:", restaurantId?.length);
    
    // Verify restaurantId is valid ObjectId format
    if (!restaurantId || !restaurantId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log("Invalid restaurant ID format:", restaurantId);
      return res.status(400).json({ 
        message: "Invalid restaurant ID format",
        receivedId: restaurantId,
        expectedFormat: "24 hexadecimal characters"
      });
    }

    // Delete existing tables for this restaurant
    console.log(`Deleting existing tables for restaurant ${restaurantId}`);
    const deleteResult = await Table.deleteMany({ restaurantId });
    console.log(`Deleted ${deleteResult.deletedCount} existing tables`);

    // Generate new tables (bulk insert for better performance)
    const tablesToInsert = [];
    for (let i = 1; i <= numberOfTables; i++) {
      const qrSlug = crypto.randomBytes(16).toString('hex');
      tablesToInsert.push({
        restaurantId,
        number: i.toString(),
        qrSlug
      });
    }

    // Bulk insert all tables at once
    const tables = await Table.insertMany(tablesToInsert);
    console.log(`Successfully created ${tables.length} tables for restaurant ${restaurantId}`);

    res.json({ 
      message: `Successfully generated ${numberOfTables} tables`,
      tables 
    });
  } catch (error) {
    console.error("Error generating tables:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Provide more specific error messages
    let errorMessage = "Failed to generate tables";
    if (error.name === 'ValidationError') {
      errorMessage = "Validation error: " + error.message;
    } else if (error.code === 11000) {
      errorMessage = "Duplicate key error - tables may already exist";
    } else if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      errorMessage = "Database error: " + error.message;
    }
    
    res.status(500).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete a specific table
router.delete("/:restaurantId/tables/:tableId", authenticate, requireRestaurant, async (req, res) => {
  try {
    const { restaurantId, tableId } = req.params;
    
    const table = await Table.findOneAndDelete({ 
      _id: tableId, 
      restaurantId 
    });

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.json({ message: "Table deleted successfully" });
  } catch (error) {
    console.error("Error deleting table:", error);
    res.status(500).json({ message: "Failed to delete table" });
  }
});

// Get table info by QR slug (public route)
router.get("/qr/:qrSlug", async (req, res) => {
  try {
    const { qrSlug } = req.params;
    
    const table = await Table.findOne({ qrSlug }).populate('restaurantId', 'restaurantName');
    
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.json({
      tableNumber: table.number,
      restaurantId: table.restaurantId._id,
      restaurantName: table.restaurantId.restaurantName
    });
  } catch (error) {
    console.error("Error fetching table by QR:", error);
    res.status(500).json({ message: "Failed to fetch table information" });
  }
});

export default router;