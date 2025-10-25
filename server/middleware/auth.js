import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";

// Main authentication middleware
export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
        code: "NO_TOKEN",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check token expiration
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return res.status(401).json({
        message: "Token expired",
        code: "TOKEN_EXPIRED",
      });
    }

    // Check if it's a restaurant token
    if (decoded.restaurantId) {
      const restaurant = await Restaurant.findById(decoded.restaurantId).select(
        "-owner.passwordHash"
      );

      if (!restaurant) {
        return res.status(401).json({
          message: "Restaurant not found",
          code: "INVALID_RESTAURANT",
        });
      }

      // Check if restaurant is active
      if (!restaurant.isActive) {
        return res.status(403).json({
          message: "Restaurant account is inactive",
          code: "RESTAURANT_INACTIVE",
        });
      }

      // Check verification status
      if (restaurant.verification.status === "rejected") {
        return res.status(403).json({
          message: "Restaurant verification was rejected",
          code: "RESTAURANT_REJECTED",
        });
      }

      req.restaurant = restaurant;
      req.restaurantId = restaurant._id;
      req.userType = "restaurant";
      req.isVerified = restaurant.verification.status === "approved";
    } else if (decoded.userId) {
      // Regular user token
      const user = await User.findById(decoded.userId).select("-passwordHash");

      if (!user) {
        return res.status(401).json({
          message: "User not found",
          code: "INVALID_USER",
        });
      }

      req.user = user;
      req.userId = user._id;
      req.userType = "user";
      req.userRole = user.role;
    } else {
      return res.status(401).json({
        message: "Invalid token format",
        code: "INVALID_TOKEN",
      });
    }

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token",
        code: "INVALID_TOKEN",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired",
        code: "TOKEN_EXPIRED",
      });
    }
    return res.status(401).json({
      message: "Authentication failed",
      code: "AUTH_FAILED",
    });
  }
};

// Role-based authorization for users
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({
        message: "User authentication required",
        code: "USER_AUTH_REQUIRED",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Insufficient permissions",
        code: "INSUFFICIENT_PERMISSIONS",
        required: roles,
        current: req.user.role,
      });
    }

    next();
  };
};

// Restaurant-only middleware
export const requireRestaurant = (req, res, next) => {
  if (!req.restaurantId) {
    return res.status(403).json({
      message: "Restaurant authentication required",
      code: "RESTAURANT_AUTH_REQUIRED",
    });
  }
  next();
};

// Verified restaurant middleware
export const requireVerifiedRestaurant = (req, res, next) => {
  if (!req.restaurantId) {
    return res.status(403).json({
      message: "Restaurant authentication required",
      code: "RESTAURANT_AUTH_REQUIRED",
    });
  }

  if (!req.isVerified) {
    return res.status(403).json({
      message: "Restaurant verification required",
      code: "RESTAURANT_NOT_VERIFIED",
      status: req.restaurant.verification.status,
    });
  }

  next();
};

// Admin-only middleware
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
      code: "ADMIN_ACCESS_REQUIRED",
    });
  }
  next();
};

// Staff or Admin middleware
export const requireStaffOrAdmin = (req, res, next) => {
  if (!req.user || !["staff", "admin"].includes(req.user.role)) {
    return res.status(403).json({
      message: "Staff or admin access required",
      code: "STAFF_ACCESS_REQUIRED",
    });
  }
  next();
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.restaurantId) {
      const restaurant = await Restaurant.findById(decoded.restaurantId).select(
        "-owner.passwordHash"
      );
      if (restaurant) {
        req.restaurant = restaurant;
        req.restaurantId = restaurant._id;
        req.userType = "restaurant";
      }
    } else if (decoded.userId) {
      const user = await User.findById(decoded.userId).select("-passwordHash");
      if (user) {
        req.user = user;
        req.userId = user._id;
        req.userType = "user";
        req.userRole = user.role;
      }
    }

    next();
  } catch (error) {
    // Ignore errors and continue without auth
    next();
  }
};
