import express from "express";
import QRCode from "qrcode";
import Table from "../models/Table.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, authorize("admin", "staff"), async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { number } = req.body;
    const qrSlug = `table-${number}-${Date.now()}`;

    const table = await Table.create({ number, qrSlug });
    res.status(201).json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id/qr", authenticate, authorize("admin"), async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    const url = `${process.env.FRONTEND_URL || "http://localhost:3000"}/m/${
      table.qrSlug
    }`;
    const qrCode = await QRCode.toDataURL(url);

    res.json({ qrCode, url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    await Table.findByIdAndDelete(req.params.id);
    res.json({ message: "Table deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
