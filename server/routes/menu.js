import express from "express";
import jwt from "jsonwebtoken";
import MenuItem from "../models/MenuItem.js";
import MenuCategory from "../models/MenuCategory.js";
import Table from "../models/Table.js";
import {
  authenticate,
  requireRestaurant,
  optionalAuth,
} from "../middleware/auth.js";
import { sanitizeInput } from "../middleware/validation.js";

const router = express.Router();

// Get categories (public or authenticated)
router.get("/categories", async (req, res) => {
  try {
    const { restaurantId } = req.query;

    // If restaurantId is provided in query (public access)
    if (restaurantId) {
      const categories = await MenuCategory.find({
        restaurantId: restaurantId,
        active: true,
      }).sort("displayOrder");
      return res.json(categories);
    }

    // Otherwise require authentication (restaurant owner)
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.restaurantId) {
      return res.status(403).json({ message: "Not a restaurant account" });
    }

    const categories = await MenuCategory.find({
      restaurantId: decoded.restaurantId,
      active: true,
    }).sort("displayOrder");

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create category
router.post(
  "/categories",
  authenticate,
  requireRestaurant,
  sanitizeInput,
  async (req, res) => {
    try {
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
  }
);

// Update category
router.patch(
  "/categories/:id",
  authenticate,
  requireRestaurant,
  sanitizeInput,
  async (req, res) => {
    try {
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
  }
);

// Delete category
router.delete(
  "/categories/:id",
  authenticate,
  requireRestaurant,
  async (req, res) => {
    try {
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
  }
);

// Reorder categories
router.patch(
  "/categories/reorder",
  authenticate,
  requireRestaurant,
  sanitizeInput,
  async (req, res) => {
    try {
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
  }
);

// Get items (public or authenticated)
router.get("/items", async (req, res) => {
  try {
    const {
      restaurantId,
      search,
      category,
      sort,
      page = 1,
      limit = 100,
    } = req.query;

    let queryRestaurantId;

    // If restaurantId is provided in query (public access)
    if (restaurantId) {
      queryRestaurantId = restaurantId;
    } else {
      // Otherwise require authentication (restaurant owner)
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded.restaurantId) {
        return res.status(403).json({ message: "Not a restaurant account" });
      }
      queryRestaurantId = decoded.restaurantId;
    }

    const query = { restaurantId: queryRestaurantId };

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
router.post(
  "/items",
  authenticate,
  requireRestaurant,
  sanitizeInput,
  async (req, res) => {
    try {
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
  }
);

// Update menu item
router.patch(
  "/items/:id",
  authenticate,
  requireRestaurant,
  sanitizeInput,
  async (req, res) => {
    try {
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
  }
);

// Delete menu item
router.delete(
  "/items/:id",
  authenticate,
  requireRestaurant,
  async (req, res) => {
    try {
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
  }
);

export default router;
