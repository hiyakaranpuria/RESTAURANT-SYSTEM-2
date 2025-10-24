// Run this script with: node create-admin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String,
  role: String,
  phone: String,
});

const User = mongoose.model("User", userSchema);

async function createAdmin() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/restaurant-qr-menu"
    );
    console.log("Connected to MongoDB");

    // Check if admin exists
    const existing = await User.findOne({ email: "admin@123.com" });
    if (existing) {
      console.log("Admin already exists!");
      console.log("Email: admin@123.com");
      console.log("Password: admin69");
      process.exit(0);
    }

    // Create admin
    const passwordHash = await bcrypt.hash("admin69", 10);
    const admin = await User.create({
      name: "System Admin",
      email: "admin@123.com",
      passwordHash,
      role: "admin",
      phone: "0000000000",
    });

    console.log("✅ Admin user created successfully!");
    console.log("Email: admin@123.com");
    console.log("Password: admin69");
    console.log("Admin ID:", admin._id);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

createAdmin();
