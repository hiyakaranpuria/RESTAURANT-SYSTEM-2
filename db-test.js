// Test MongoDB connection
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

console.log("Testing MongoDB connection...");
console.log("MongoDB URI:", process.env.MONGODB_URI || "mongodb://localhost:27017/restaurant-qr-menu");

try {
  await mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/restaurant-qr-menu"
  );
  console.log("✅ MongoDB connected successfully!");
  
  // Test a simple query
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("📊 Available collections:", collections.map(c => c.name));
  
  await mongoose.disconnect();
  console.log("✅ MongoDB disconnected successfully!");
  
} catch (error) {
  console.error("❌ MongoDB connection error:", error.message);
  
  if (error.message.includes("ECONNREFUSED")) {
    console.error("💡 Suggestion: Make sure MongoDB is running on your system");
    console.error("   - On Windows: Start MongoDB service");
    console.error("   - On Mac: brew services start mongodb-community");
    console.error("   - On Linux: sudo systemctl start mongod");
  }
  
  process.exit(1);
}