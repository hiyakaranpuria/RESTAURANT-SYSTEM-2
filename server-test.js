// Simple test to check if basic imports work
console.log("Testing server imports...");

try {
  console.log("1. Testing express import...");
  const express = await import("express");
  console.log("✓ Express imported successfully");

  console.log("2. Testing mongoose import...");
  const mongoose = await import("mongoose");
  console.log("✓ Mongoose imported successfully");

  console.log("3. Testing dotenv import...");
  const dotenv = await import("dotenv");
  console.log("✓ Dotenv imported successfully");

  console.log("4. Testing cors import...");
  const cors = await import("cors");
  console.log("✓ CORS imported successfully");

  console.log("5. Testing helmet import...");
  const helmet = await import("helmet");
  console.log("✓ Helmet imported successfully");

  console.log("6. Testing local middleware imports...");
  const { apiLimiter } = await import("./server/middleware/rateLimiter.js");
  console.log("✓ Rate limiter imported successfully");

  const { sanitizeInput } = await import("./server/middleware/validation.js");
  console.log("✓ Validation middleware imported successfully");

  console.log("7. Testing route imports...");
  const authRoutes = await import("./server/routes/auth.js");
  console.log("✓ Auth routes imported successfully");

  const orderRoutes = await import("./server/routes/orders.js");
  console.log("✓ Order routes imported successfully");

  const feedbackRoutes = await import("./server/routes/feedback.js");
  console.log("✓ Feedback routes imported successfully");

  console.log("\n🎉 All imports successful! Server should be able to start.");

} catch (error) {
  console.error("❌ Import error:", error.message);
  console.error("Stack:", error.stack);
  process.exit(1);
}