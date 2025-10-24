import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";
import Table from "./models/Table.js";
import MenuCategory from "./models/MenuCategory.js";
import MenuItem from "./models/MenuItem.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/restaurant-qr-menu"
    );
    console.log("MongoDB connected");

    // Clear existing data
    await User.deleteMany({});
    await Table.deleteMany({});
    await MenuCategory.deleteMany({});
    await MenuItem.deleteMany({});

    // Create users
    const adminPassword = await bcrypt.hash("admin123", 10);
    const staffPassword = await bcrypt.hash("staff123", 10);
    const customerPassword = await bcrypt.hash("customer123", 10);

    await User.create([
      {
        name: "Admin User",
        email: "admin@restaurant.com",
        phone: "+1234567890",
        passwordHash: adminPassword,
        role: "admin",
        marketingConsent: false,
      },
      {
        name: "Staff User",
        email: "staff@restaurant.com",
        phone: "+1234567891",
        passwordHash: staffPassword,
        role: "staff",
        marketingConsent: false,
      },
      {
        name: "Customer User",
        email: "customer@restaurant.com",
        phone: "+1234567892",
        passwordHash: customerPassword,
        role: "customer",
        marketingConsent: true,
      },
    ]);
    console.log("Users created");

    // Create tables
    const tables = await Table.create([
      { number: "Table 1", qrSlug: "table-1-" + Date.now() },
      { number: "Table 2", qrSlug: "table-2-" + Date.now() },
      { number: "Table 5", qrSlug: "table-5-" + Date.now() },
      { number: "Table 7", qrSlug: "table-7-" + Date.now() },
      { number: "Table 8", qrSlug: "table-8-" + Date.now() },
      { number: "Table 11", qrSlug: "table-11-" + Date.now() },
      { number: "Table 12", qrSlug: "table-12-" + Date.now() },
      { number: "Table 14", qrSlug: "table-14-" + Date.now() },
    ]);
    console.log("Tables created");

    // Create categories
    const categories = await MenuCategory.create([
      { name: "Appetizers", displayOrder: 1 },
      { name: "Mains", displayOrder: 2 },
      { name: "Desserts", displayOrder: 3 },
      { name: "Drinks", displayOrder: 4 },
      { name: "Specials", displayOrder: 5 },
    ]);
    console.log("Categories created");

    // Create menu items
    await MenuItem.create([
      {
        name: "Grilled Salmon",
        description: "Served with asparagus and lemon butter sauce.",
        price: 24.0,
        categoryId: categories[1]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1467003909585-2f8a72700288",
        availability: true,
        tags: ["fish", "healthy"],
      },
      {
        name: "Ribeye Steak",
        description: "12oz steak with mashed potatoes and gravy.",
        price: 32.0,
        categoryId: categories[1]._id,
        imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462",
        availability: true,
        tags: ["beef", "steak"],
      },
      {
        name: "Chicken Alfredo",
        description: "Creamy pasta with grilled chicken and parmesan.",
        price: 21.5,
        categoryId: categories[1]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1645112411341-6c4fd023714a",
        availability: true,
        tags: ["pasta", "chicken"],
      },
      {
        name: "Vegan Burger",
        description: "Plant-based patty with avocado and fries.",
        price: 18.0,
        categoryId: categories[1]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1520072959219-c595dc870360",
        availability: true,
        tags: ["vegan", "burger"],
      },
      {
        name: "Margherita Pizza",
        description:
          "Classic pizza with fresh mozzarella, San Marzano tomatoes, and basil.",
        price: 14.5,
        categoryId: categories[1]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
        availability: true,
        tags: ["pizza", "vegetarian"],
      },
      {
        name: "Caesar Salad",
        description: "With grilled chicken, croutons, and dressing.",
        price: 16.5,
        categoryId: categories[1]._id,
        imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1",
        availability: true,
        tags: ["salad", "chicken"],
      },
      {
        name: "Classic Cheeseburger",
        description: "Cooked Medium Rare, with extra pickles",
        price: 18.0,
        categoryId: categories[1]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
        availability: true,
        tags: ["burger", "beef"],
      },
      {
        name: "Truffle Fries",
        description: "Side of garlic aioli",
        price: 9.5,
        categoryId: categories[0]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1573080496219-bb080dd4f877",
        availability: true,
        tags: ["fries", "appetizer"],
      },
      {
        name: "Espresso",
        description: "Rich Italian espresso",
        price: 3.5,
        categoryId: categories[3]._id,
        availability: true,
        tags: ["coffee", "hot"],
      },
      {
        name: "Pancakes",
        description: "Fluffy pancakes with maple syrup",
        price: 12.0,
        categoryId: categories[4]._id,
        availability: true,
        tags: ["breakfast", "sweet"],
      },
    ]);
    console.log("Menu items created");

    console.log("\n✅ Database seeded successfully!");
    console.log("\nDefault users:");
    console.log("Admin: admin@restaurant.com / admin123");
    console.log("Staff: staff@restaurant.com / staff123");
    console.log("Customer: customer@restaurant.com / customer123");
    console.log(`\nSample QR URL: http://localhost:3000/m/${tables[0].qrSlug}`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
