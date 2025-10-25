# 🔒 Security Quick Reference Card

## ✅ Status: ACTIVE & RUNNING

---

## 🔑 Authentication Headers

```javascript
// All protected endpoints require:
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE',
  'Content-Type': 'application/json'
}
```

---

## 🚦 Endpoint Access Levels

| Endpoint                           | Access Level | Rate Limit |
| ---------------------------------- | ------------ | ---------- |
| POST /api/auth/register            | Public       | 3/hour     |
| POST /api/auth/login               | Public       | 5/15min    |
| POST /api/restaurant/register      | Public       | 3/hour     |
| POST /api/restaurant/login         | Public       | 5/15min    |
| GET /api/menu/items?restaurantId=X | Public       | 100/15min  |
| POST /api/orders                   | Public       | 10/5min    |
| GET /api/restaurant/me             | Restaurant   | 100/15min  |
| POST /api/menu/items               | Restaurant   | 100/15min  |
| GET /api/restaurant/pending        | Admin        | 100/15min  |

---

## 🔐 Middleware Stack

```
Request
  ↓
Helmet (Security Headers)
  ↓
CORS Check
  ↓
Rate Limiter
  ↓
Input Sanitization
  ↓
Authentication (if required)
  ↓
Authorization (if required)
  ↓
Route Handler
  ↓
Response
```

---

## 📊 Error Code Quick Lookup

| Code                     | Meaning               | Action                   |
| ------------------------ | --------------------- | ------------------------ |
| NO_TOKEN                 | Missing auth token    | Add Authorization header |
| TOKEN_EXPIRED            | Token > 7 days old    | Re-login or refresh      |
| INVALID_CREDENTIALS      | Wrong email/password  | Check credentials        |
| RATE_LIMIT_EXCEEDED      | Too many requests     | Wait 15 minutes          |
| RESTAURANT_AUTH_REQUIRED | Need restaurant login | Login as restaurant      |
| ADMIN_ACCESS_REQUIRED    | Need admin role       | Login as admin           |
| INVALID_EMAIL            | Bad email format      | Fix email format         |
| INVALID_PASSWORD         | Password too weak     | Min 8 characters         |

---

## 🧪 Quick Tests

### Test Authentication

```bash
# Should fail (no token)
curl http://localhost:5000/api/restaurant/me

# Should succeed (with token)
curl http://localhost:5000/api/restaurant/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Rate Limiting

```bash
# Run 6 times quickly - should block after 5
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
```

### Test Validation

```bash
# Should return INVALID_EMAIL
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"notanemail","password":"test123"}'
```

---

## 🔧 Quick Fixes

### "Too many requests"

```
Wait 15 minutes OR adjust rate limits in:
server/middleware/rateLimiter.js
```

### "Token expired"

```javascript
// Option 1: Re-login
POST / api / auth / login;

// Option 2: Refresh token
POST / api / auth / refresh;
Headers: {
  Authorization: "Bearer OLD_TOKEN";
}
```

### "CORS error"

```env
# Add to .env file:
CLIENT_URL=http://localhost:5173
```

---

## 📝 Token Format

```javascript
// User Token
{
  userId: "user_id_here",
  iat: 1234567890,
  exp: 1234567890
}

// Restaurant Token
{
  restaurantId: "restaurant_id_here",
  type: "restaurant",
  iat: 1234567890,
  exp: 1234567890
}
```

---

## 🎯 Common Patterns

### Login Flow

```javascript
// 1. Login
POST / api / auth / login;
Body: {
  email, password;
}
Response: {
  token, user;
}

// 2. Store token
localStorage.setItem("token", token);

// 3. Use token
GET / api / auth / me;
Headers: {
  Authorization: `Bearer ${token}`;
}
```

### Restaurant Operations

```javascript
// 1. Login as restaurant
POST /api/restaurant/login
Body: { email, password }
Response: { token, restaurant }

// 2. Create menu item
POST /api/menu/items
Headers: { Authorization: `Bearer ${token}` }
Body: { name, price, ... }
```

### Order Flow

```javascript
// 1. Create order (no auth needed)
POST /api/orders
Body: { restaurantId, tableNumber, items, totalAmount }
Response: { order }

// 2. Track order (no auth needed)
GET /api/orders/:orderId
Response: { order }

// 3. Update status (restaurant auth needed)
PATCH /api/orders/:orderId/status
Headers: { Authorization: `Bearer ${restaurantToken}` }
Body: { status: "preparing" }
```

---

## 🛠️ Development Tips

### Bypass Rate Limits (Dev Only)

```javascript
// In server/middleware/rateLimiter.js
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Increase for development
  // ...
});
```

### Debug Authentication

```javascript
// Add to route handler
console.log("User:", req.user);
console.log("Restaurant:", req.restaurant);
console.log("User Type:", req.userType);
```

### Test Different Roles

```javascript
// Create test users with different roles
POST /api/auth/register
Body: {
  email: "admin@test.com",
  password: "admin123",
  role: "admin" // or "staff", "customer"
}
```

---

## 📦 Package Versions

- helmet: ^8.1.0
- express-rate-limit: latest

---

## 🔄 Token Lifecycle

```
Login → Token Generated (7 days)
  ↓
Token Used (validated on each request)
  ↓
Token Expires (after 7 days)
  ↓
Option 1: Re-login
Option 2: Refresh token
```

---

## 🚨 Security Checklist

- [x] All endpoints protected
- [x] Rate limiting active
- [x] Input validation active
- [x] XSS protection active
- [x] CORS configured
- [x] Security headers active
- [x] Error codes implemented
- [x] Token expiration set
- [x] Password hashing (bcrypt)
- [x] Role-based access control

---

## 📞 Emergency Commands

### Stop Server

```bash
Ctrl + C
```

### Check Server Status

```bash
curl http://localhost:5000/health
```

### View Logs

```bash
# Server logs show in terminal
# Look for error codes and messages
```

### Reset Rate Limits

```bash
# Restart server
npm run server
```

---

## 💡 Pro Tips

1. **Always check error codes** - They tell you exactly what's wrong
2. **Use Postman** - Easier than curl for testing
3. **Save tokens** - Store in localStorage or sessionStorage
4. **Monitor rate limits** - Check response headers
5. **Test in incognito** - Fresh session for testing
6. **Check server logs** - Detailed error information
7. **Use refresh endpoint** - Avoid re-login

---

**Keep this card handy for quick reference! 🚀**
