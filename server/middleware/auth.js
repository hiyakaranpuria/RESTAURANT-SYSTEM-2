import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if it's a restaurant token
    if (decoded.restaurantId) {
      const restaurant = await Restaurant.findById(decoded.restaurantId).select(
        "-owner.passwordHash"
      );
      if (!restaurant) {
        return res.status(401).json({ message: "Restaurant not found" });
      }
      req.restaurant = restaurant;
      req.restaurantId = restaurant._id;
      req.userType = "restaurant";
    } else {
      // Regular user token
      const user = await User.findById(decoded.userId).select("-passwordHash");
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      req.user = user;
      req.userType = "user";
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
