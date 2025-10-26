// Input validation middleware
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ""));
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  return password && password.length >= 8;
};

export const validateRegistration = (req, res, next) => {
  const { name, email, phone, password } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      message: "Name must be at least 2 characters",
      code: "INVALID_NAME",
    });
  }

  if (!email || !validateEmail(email)) {
    return res.status(400).json({
      message: "Invalid email format",
      code: "INVALID_EMAIL",
    });
  }

  if (!phone || !validatePhone(phone)) {
    return res.status(400).json({
      message: "Invalid phone number (must be 10 digits)",
      code: "INVALID_PHONE",
    });
  }

  if (!password || !validatePassword(password)) {
    return res.status(400).json({
      message: "Password must be at least 8 characters",
      code: "INVALID_PASSWORD",
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !validateEmail(email)) {
    return res.status(400).json({
      message: "Invalid email format",
      code: "INVALID_EMAIL",
    });
  }

  if (!password) {
    return res.status(400).json({
      message: "Password is required",
      code: "PASSWORD_REQUIRED",
    });
  }

  next();
};

export const validateRestaurantRegistration = (req, res, next) => {
  const { restaurantName, owner, phone, address, verification } = req.body;

  if (!restaurantName || restaurantName.trim().length < 2) {
    return res.status(400).json({
      message: "Restaurant name must be at least 2 characters",
      code: "INVALID_RESTAURANT_NAME",
    });
  }

  if (!owner || !owner.name || !owner.email || !owner.password) {
    return res.status(400).json({
      message: "Owner information is incomplete",
      code: "INVALID_OWNER_INFO",
    });
  }

  if (!validateEmail(owner.email)) {
    return res.status(400).json({
      message: "Invalid owner email format",
      code: "INVALID_EMAIL",
    });
  }

  if (!validatePassword(owner.password)) {
    return res.status(400).json({
      message: "Password must be at least 8 characters",
      code: "INVALID_PASSWORD",
    });
  }

  if (!phone || !validatePhone(phone)) {
    return res.status(400).json({
      message: "Invalid restaurant phone number",
      code: "INVALID_PHONE",
    });
  }

  if (!address || !address.street || !address.city || !address.state) {
    return res.status(400).json({
      message: "Complete address is required",
      code: "INVALID_ADDRESS",
    });
  }

  if (!verification || !verification.businessLicense || !verification.taxId) {
    return res.status(400).json({
      message: "Business verification documents are required",
      code: "INVALID_VERIFICATION",
    });
  }

  next();
};

export const validateOrderCreation = (req, res, next) => {
  const { restaurantId, tableNumber, items, totalAmount, customerInfo } = req.body;

  if (!restaurantId) {
    return res.status(400).json({
      message: "Restaurant ID is required",
      code: "RESTAURANT_ID_REQUIRED",
    });
  }

  if (!tableNumber) {
    return res.status(400).json({
      message: "Table number is required",
      code: "TABLE_NUMBER_REQUIRED",
    });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      message: "Order must contain at least one item",
      code: "EMPTY_ORDER",
    });
  }

  if (!totalAmount || totalAmount <= 0) {
    return res.status(400).json({
      message: "Invalid total amount",
      code: "INVALID_AMOUNT",
    });
  }

  // Validate each item
  for (const item of items) {
    if (!item.menuItemId || !item.quantity || item.quantity <= 0) {
      return res.status(400).json({
        message: "Invalid item in order",
        code: "INVALID_ORDER_ITEM",
      });
    }
  }

  next();
};

export const sanitizeInput = (req, res, next) => {
  // Remove any potential XSS or injection attempts
  const sanitize = (obj) => {
    if (typeof obj === "string") {
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/javascript:/gi, "")
        .trim();
    }
    if (typeof obj === "object" && obj !== null) {
      Object.keys(obj).forEach((key) => {
        obj[key] = sanitize(obj[key]);
      });
    }
    return obj;
  };

  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);

  next();
};
