import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Restaurant from "../models/Restaurant.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Register new restaurant
router.post("/register", async (req, res) => {
  try {
    const {
      restaurantName,
      businessType,
      cuisineType,
      description,
      address,
      phone,
      owner,
      verification,
      website,
      socialMedia,
      operatingHours,
      numberOfTables,
    } = req.body;

    // Check if email already exists
    const existingEmail = await Restaurant.findOne({
      "owner.email": owner.email,
    });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(owner.password, 10);

    // Create restaurant
    const restaurant = await Restaurant.create({
      restaurantName,
      businessType,
      cuisineType,
      description,
      address,
      phone,
      owner: {
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        passwordHash,
      },
      verification: {
        businessLicense: verification.businessLicense,
        taxId: verification.taxId,
        documents: verification.documents || [],
        status: "pending",
      },
      website,
      socialMedia,
      operatingHours,
      numberOfTables,
    });

    res.status(201).json({
      message: "Restaurant registration submitted successfully",
      restaurantId: restaurant._id,
      status: "pending",
    });
  } catch (error) {
    console.error("Restaurant registration error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Restaurant login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const restaurant = await Restaurant.findOne({ "owner.email": email });
    if (!restaurant) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(
      password,
      restaurant.owner.passwordHash
    );
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { restaurantId: restaurant._id, type: "restaurant" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      restaurant: {
        _id: restaurant._id,
        restaurantName: restaurant.restaurantName,
        email: restaurant.owner.email,
        verificationStatus: restaurant.verification.status,
        isActive: restaurant.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get restaurant profile
router.get("/me", authenticate, async (req, res) => {
  try {
    // Check if this is a restaurant token
    if (!req.restaurantId) {
      return res.status(403).json({ message: "Not a restaurant account" });
    }

    const restaurant = await Restaurant.findById(req.restaurantId).select(
      "-owner.passwordHash"
    );
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update restaurant profile
router.patch("/profile", authenticate, async (req, res) => {
  try {
    if (!req.restaurantId) {
      return res.status(403).json({ message: "Not a restaurant account" });
    }

    const updates = req.body;
    delete updates.verification; // Can't update verification directly
    delete updates.owner.passwordHash; // Can't update password this way

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.restaurantId,
      updates,
      { new: true }
    ).select("-owner.passwordHash");

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all restaurants
router.get("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { "verification.status": status } : {};

    const restaurants = await Restaurant.find(query)
      .select("-owner.passwordHash")
      .sort("-createdAt");

    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get pending applications
router.get("/pending", authenticate, authorize("admin"), async (req, res) => {
  try {
    const restaurants = await Restaurant.find({
      "verification.status": "pending",
    })
      .select("-owner.passwordHash")
      .sort("-createdAt");

    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get restaurant by ID
router.get("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).select(
      "-owner.passwordHash"
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Approve/Reject restaurant
router.patch(
  "/:id/verify",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const { status, rejectionReason, notes } = req.body;

      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const restaurant = await Restaurant.findByIdAndUpdate(
        req.params.id,
        {
          "verification.status": status,
          "verification.reviewedBy": req.user._id,
          "verification.reviewedAt": new Date(),
          "verification.rejectionReason": rejectionReason,
          "verification.notes": notes,
          isActive: status === "approved",
        },
        { new: true }
      ).select("-owner.passwordHash");

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      res.json(restaurant);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
