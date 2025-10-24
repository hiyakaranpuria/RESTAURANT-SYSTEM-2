import express from "express";
import MenuItem from "../models/MenuItem.js";
import MenuCategory from "../models/MenuCategory.js";
import Table from "../models/Table.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/categories", async (req, res) => {
  try {
    const categories = await MenuCategory.find({ active: true }).sort(
      "displayOrder"
    );
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/items", async (req, res) => {
  try {
    const { search, category, sort, page = 1, limit = 20 } = req.query;

    const query = {};
    if (search) {
      query.$text = { $search: search };
    }
    if (category) {
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

router.get("/by-table/:slug", async (req, res) => {
  try {
    const table = await Table.findOne({ qrSlug: req.params.slug });
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    const categories = await MenuCategory.find({ active: true }).sort(
      "displayOrder"
    );
    const items = await MenuItem.find({ availability: true }).populate(
      "categoryId"
    );

    res.json({ table, categories, items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/items", authenticate, authorize("admin"), async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch(
  "/items/:id",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.delete(
  "/items/:id",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      await MenuItem.findByIdAndDelete(req.params.id);
      res.json({ message: "Item deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
