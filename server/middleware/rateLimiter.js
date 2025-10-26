import rateLimit from "express-rate-limit";

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased for development - Limit each IP to 1000 requests per windowMs
  message: {
    message: "Too many requests from this IP, please try again later",
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Increased for development - Limit each IP to 100 login attempts per 15 minutes
  message: {
    message: "Too many login attempts, please try again after 15 minutes",
    code: "AUTH_RATE_LIMIT_EXCEEDED",
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  standardHeaders: true,
  legacyHeaders: false,
});

// Registration rate limiter
export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Increased for development - Limit each IP to 50 registration attempts per 15 minutes
  message: {
    message:
      "Too many registration attempts, please try again after 15 minutes",
    code: "REGISTER_RATE_LIMIT_EXCEEDED",
  },
  skipSuccessfulRequests: true, // Don't count successful registrations
  standardHeaders: true,
  legacyHeaders: false,
});

// Order creation rate limiter
export const orderLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // Increased for development - Limit each IP to 100 orders per 5 minutes
  message: {
    message: "Too many orders, please wait a moment",
    code: "ORDER_RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
