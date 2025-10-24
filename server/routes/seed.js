import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// Seed admin user (only for development)
router.post("/admin", async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@123.com" });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Create admin user
    const passwordHash = await bcrypt.hash("admin69", 10);
    const admin = await User.create({
      name: "System Admin",
      email: "admin@123.com",
      passwordHash,
      role: "admin",
      phone: "0000000000",
    });

    res.json({
      message: "Admin user created successfully",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
