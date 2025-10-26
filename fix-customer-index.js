// Fix Customer collection index issue
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function fixCustomerIndex() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/restaurant-qr-menu"
    );
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const customersCollection = db.collection('customers');

    console.log("\n📊 Checking current indexes...");
    const indexes = await customersCollection.indexes();
    console.log("Current indexes:", indexes.map(idx => ({ name: idx.name, key: idx.key })));

    // Check if sessionId index exists
    const sessionIdIndex = indexes.find(idx => idx.key && idx.key.sessionId);
    
    if (sessionIdIndex) {
      console.log("\n🔍 Found sessionId index:", sessionIdIndex.name);
      
      // Drop the problematic sessionId index
      console.log("🗑️  Dropping sessionId index...");
      await customersCollection.dropIndex(sessionIdIndex.name);
      console.log("✅ sessionId index dropped successfully");
    } else {
      console.log("\n✅ No sessionId index found - this is good!");
    }

    // Check for customers with null sessionId
    console.log("\n🔍 Checking for customers with null sessionId...");
    const nullSessionCustomers = await customersCollection.find({ sessionId: null }).toArray();
    console.log(`Found ${nullSessionCustomers.length} customers with null sessionId`);

    if (nullSessionCustomers.length > 0) {
      console.log("🧹 Cleaning up null sessionId fields...");
      await customersCollection.updateMany(
        { sessionId: null },
        { $unset: { sessionId: "" } }
      );
      console.log("✅ Removed null sessionId fields");
    }

    // Check for duplicate customers
    console.log("\n🔍 Checking for duplicate customers by email...");
    const duplicates = await customersCollection.aggregate([
      { $group: { _id: "$email", count: { $sum: 1 }, docs: { $push: "$_id" } } },
      { $match: { count: { $gt: 1 } } }
    ]).toArray();

    if (duplicates.length > 0) {
      console.log(`⚠️  Found ${duplicates.length} duplicate email groups`);
      for (const dup of duplicates) {
        console.log(`  - Email: ${dup._id}, Count: ${dup.count}`);
        // Keep the first document, remove the rest
        const docsToRemove = dup.docs.slice(1);
        if (docsToRemove.length > 0) {
          await customersCollection.deleteMany({ _id: { $in: docsToRemove } });
          console.log(`    Removed ${docsToRemove.length} duplicate documents`);
        }
      }
    } else {
      console.log("✅ No duplicate customers found");
    }

    console.log("\n📊 Final index check...");
    const finalIndexes = await customersCollection.indexes();
    console.log("Final indexes:", finalIndexes.map(idx => ({ name: idx.name, key: idx.key })));

    console.log("\n🎉 Database cleanup completed successfully!");
    
  } catch (error) {
    console.error("❌ Error fixing customer index:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("📡 Disconnected from MongoDB");
  }
}

fixCustomerIndex();