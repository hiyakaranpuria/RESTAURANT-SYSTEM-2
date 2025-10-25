import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authenticate } from "../middleware/auth.js";
import { authLimiter, registerLimiter } from "../middleware/rateLimiter.js";
import {
  validateRegistration,
  validateLogin,
  sanitizeInput,
} from "../middleware/validation.js";

const router = express.Router();

router.post(
  "/register",
  registerLimiter,
  sanitizeInput,
  validateRegistration,
  async (req, res) => {
    try {
      const { name, email, phone, password, role, marketingConsent } = req.body;

      // Check if email already exists
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Check if phone already exists
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        return res
          .status(400)
          .json({ message: "Phone number already registered" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        phone,
        passwordHash,
        role: role || "customer",
        marketingConsent: marketingConsent || false,
      });

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(201).json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Registration failed",
        code: "REGISTRATION_ERROR",
      });
    }
  }
);

router.post(
  "/login",
  authLimiter,
  sanitizeInput,
  validateLogin,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          message: "Invalid credentials",
          code: "INVALID_CREDENTIALS",
        });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({
          message: "Invalid credentials",
          code: "INVALID_CREDENTIALS",
        });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Login failed",
        code: "LOGIN_ERROR",
      });
    }
  }
);

router.get("/me", authenticate, async (req, res) => {
  try {
    if (req.user) {
      res.json({
        user: req.user,
        type: "user",
      });
    } else if (req.restaurant) {
      res.json({
        restaurant: req.restaurant,
        type: "restaurant",
      });
    } else {
      res.status(401).json({
        message: "Not authenticated",
        code: "NOT_AUTHENTICATED",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user data",
      code: "FETCH_ERROR",
    });
  }
});

// Logout endpoint
router.post("/logout", authenticate, async (req, res) => {
  try {
    res.json({
      message: "Logged out successfully",
      code: "LOGOUT_SUCCESS",
    });
  } catch (error) {
    res.status(500).json({
      message: "Logout failed",
      code: "LOGOUT_ERROR",
    });
  }
});

// Token refresh endpoint
router.post("/refresh", authenticate, async (req, res) => {
  try {
    let newToken;

    if (req.userId) {
      newToken = jwt.sign({ userId: req.userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
    } else if (req.restaurantId) {
      newToken = jwt.sign(
        { restaurantId: req.restaurantId, type: "restaurant" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
    } else {
      return res.status(401).json({
        message: "Invalid token",
        code: "INVALID_TOKEN",
      });
    }

    res.json({
      token: newToken,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Token refresh failed",
      code: "REFRESH_ERROR",
    });
  }
});

export default router;
