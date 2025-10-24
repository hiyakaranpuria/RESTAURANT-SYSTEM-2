import express from "express";
import MenuItem from "../models/MenuItem.js";
import MenuCategory from "../models/MenuCategory.js";
import Table from "../models/Table.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Get categories for logged-in restaurant
router.get("/categories", authenticate, async (req, res) => {
  try {
    if (!req.restaurantId) {
      return res.status(403).json({ message: "Not a restaurant account" });
    }

    const categories = await MenuCategory.find({
      restaurantId: req.restaurantId,
      active: true,
    }).sort("displayOrder");

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create category
router.post("/categories", authenticate, async (req, res) => {
  try {
    if (!req.restaurantId) {
      return res.status(403).json({ message: "Not a restaurant account" });
    }

    const { name } = req.body;

    // Get the highest display order
    const lastCategory = await MenuCategory.findOne({
      restaurantId: req.restaurantId,
    }).sort("-displayOrder");

    const category = await MenuCategory.create({
      name,
      restaurantId: req.restaurantId,
      displayOrder: lastCategory ? lastCategory.displayOrder + 1 : 0,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update category
router.patch("/categories/:id", authenticate, async (req, res) => {
  try {
    if (!req.restaurantId) {
      return res.status(403).json({ message: "Not a restaurant account" });
    }

    const category = await MenuCategory.findOneAndUpdate(
      { _id: req.params.id, restaurantId: req.restaurantId },
      req.body,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete category
router.delete("/categories/:id", authenticate, async (req, res) => {
  try {
    if (!req.restaurantId) {
      return res.status(403).json({ message: "Not a restaurant account" });
    }

    // Check if category has items
    const itemCount = await MenuItem.countDocuments({
      categoryId: req.params.id,
    });

    if (itemCount > 0) {
      return res.status(400).json({
        message:
          "Cannot delete category with items. Please move or delete items first.",
      });
    }

    const category = await MenuCategory.findOneAndDelete({
      _id: req.params.id,
      restaurantId: req.restaurantId,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reorder categories
router.patch("/categories/reorder", authenticate, async (req, res) => {
  try {
    if (!req.restaurantId) {
      return res.status(403).json({ message: "Not a restaurant account" });
    }

    const { categoryIds } = req.body; // Array of category IDs in new order

    // Update display order for each category
    const updates = categoryIds.map((id, index) =>
      MenuCategory.findOneAndUpdate(
        { _id: id, restaurantId: req.restaurantId },
        { displayOrder: index }
      )
    );

    await Promise.all(updates);

    res.json({ message: "Categories reordered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get items for logged-in restaurant
router.get("/items", authenticate, async (req, res) => {
  try {
    if (!req.restaurantId) {
      return res.status(403).json({ message: "Not a restaurant account" });
    }

    const { search, category, sort, page = 1, limit = 100 } = req.query;

    const query = { restaurantId: req.restaurantId };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "all") {
      query.categoryId = category;
    }

    const items = await MenuItem.find(query)
      .populate("categoryId")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort || "name");

    const count = await MenuItem.countDocuments(query);

    res.json({
      items,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get menu by table QR code (public)
router.get("/by-table/:slug", async (req, res) => {
  try {
    const table = await Table.findOne({ qrSlug: req.params.slug });
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    const categories = await MenuCategory.find({
      restaurantId: table.restaurantId,
      active: true,
    }).sort("displayOrder");

    const items = await MenuItem.find({
      restaurantId: table.restaurantId,
      availability: true,
    }).populate("categoryId");

    res.json({ table, categories, items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create menu item
router.post("/items", authenticate, async (req, res) => {
  try {
    if (!req.restaurantId) {
      return res.status(403).json({ message: "Not a restaurant account" });
    }

    const itemData = {
      ...req.body,
      restaurantId: req.restaurantId,
    };

    const item = await MenuItem.create(itemData);
    const populatedItem = await MenuItem.findById(item._id).populate(
      "categoryId"
    );

    res.status(201).json(populatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update menu item
router.patch("/items/:id", authenticate, async (req, res) => {
  try {
    if (!req.restaurantId) {
      return res.status(403).json({ message: "Not a restaurant account" });
    }

    const item = await MenuItem.findOneAndUpdate(
      { _id: req.params.id, restaurantId: req.restaurantId },
      req.body,
      { new: true }
    ).populate("categoryId");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete menu item
router.delete("/items/:id", authenticate, async (req, res) => {
  try {
    if (!req.restaurantId) {
      return res.status(403).json({ message: "Not a restaurant account" });
    }

    const item = await MenuItem.findOneAndDelete({
      _id: req.params.id,
      restaurantId: req.restaurantId,
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
