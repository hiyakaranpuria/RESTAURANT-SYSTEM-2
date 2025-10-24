import express from "express";
import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { tableId, items } = req.body;

    let subtotal = 0;
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (menuItem) {
        subtotal += menuItem.price * item.qty;
      }
    }

    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const order = await Order.create({
      tableId,
      items,
      subtotal,
      tax,
      total,
    });

    await order.populate("tableId items.menuItemId");
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", authenticate, authorize("staff", "admin"), async (req, res) => {
  try {
    const { status, table } = req.query;

    const query = {};
    if (status) {
      query.status = { $in: status.split(",") };
    }
    if (table) {
      query.tableId = table;
    }

    const orders = await Order.find(query)
      .populate("tableId items.menuItemId")
      .sort("-createdAt");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "tableId items.menuItemId"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch(
  "/:id/status",
  authenticate,
  authorize("staff", "admin"),
  async (req, res) => {
    try {
      const { status } = req.body;
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      ).populate("tableId items.menuItemId");

      res.json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
