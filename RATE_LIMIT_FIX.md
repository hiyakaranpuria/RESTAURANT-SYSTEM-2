# ✅ Rate Limit Fix - "Too Many Registration Attempts"

## 🐛 Problem

When trying to register a restaurant, you were getting:

```
"Too many registration attempts, please try again later"
```

This happened because the rate limiter was too strict for development/testing.

## 🔧 What Was Fixed

### Before (Too Strict):

```javascript
// Registration rate limiter
max: 3,                      // Only 3 attempts
windowMs: 60 * 60 * 1000,   // Per 1 hour
skipSuccessfulRequests: false // Counted successful attempts too
```

### After (More Reasonable):

```javascript
// Registration rate limiter
max: 10,                     // 10 attempts allowed
windowMs: 15 * 60 * 1000,   // Per 15 minutes
skipSuccessfulRequests: true // Don't count successful registrations
```

## 📊 Updated Rate Limits

| Endpoint         | Before       | After           | Window |
| ---------------- | ------------ | --------------- | ------ |
| **Registration** | 3 attempts   | **10 attempts** | 15 min |
| **Login**        | 5 attempts   | **10 attempts** | 15 min |
| **Orders**       | 10 orders    | 10 orders       | 5 min  |
| **General API**  | 100 requests | 100 requests    | 15 min |

## ✅ Benefits of New Configuration

1. **More attempts allowed** - 10 instead of 3
2. **Shorter window** - 15 minutes instead of 1 hour
3. **Skips successful requests** - Only failed attempts count
4. **Better for development** - Won't block you while testing
5. **Still secure** - Prevents brute force attacks

## 🧪 Testing

### Test Registration:

1. Restart your backend server:

   ```bash
   npm run server
   ```

2. Try registering a restaurant multiple times
3. You should now be able to make up to 10 attempts in 15 minutes
4. Successful registrations don't count toward the limit

### If You Still Get Rate Limited:

**Option 1: Wait 15 minutes**
The rate limit will reset automatically.

**Option 2: Restart the server**

```bash
# Stop the server (Ctrl+C)
# Start again
npm run server
```

**Option 3: Clear rate limit (Development only)**
The rate limit is stored in memory, so restarting the server clears it.

## 🔒 Security Notes

### Current Settings (Good for Development):

- ✅ Allows testing without frustration
- ✅ Still prevents abuse
- ✅ Reasonable limits for real users

### For Production (Optional - More Strict):

If you want stricter limits in production, you can use environment variables:

```javascript
// In rateLimiter.js
export const registerLimiter = rateLimit({
  windowMs:
    process.env.NODE_ENV === "production"
      ? 60 * 60 * 1000 // 1 hour in production
      : 15 * 60 * 1000, // 15 minutes in development
  max:
    process.env.NODE_ENV === "production"
      ? 5 // 5 attempts in production
      : 10, // 10 attempts in development
  // ...
});
```

## 📝 Rate Limit Headers

When you make requests, you'll see these headers:

```
RateLimit-Limit: 10
RateLimit-Remaining: 9
RateLimit-Reset: 1706270400
```

- **Limit**: Total attempts allowed
- **Remaining**: Attempts left
- **Reset**: When the limit resets (Unix timestamp)

## 🚨 What Triggers Rate Limit

### Registration Endpoint:

- ❌ Failed registration (wrong data, validation errors)
- ❌ Duplicate email attempts
- ✅ Successful registration (doesn't count!)

### Login Endpoint:

- ❌ Wrong password
- ❌ Wrong email
- ✅ Successful login (doesn't count!)

## 💡 Tips

1. **Use different emails** when testing registration
2. **Check validation errors** before retrying
3. **Successful attempts don't count** toward the limit
4. **Restart server** to clear rate limits during development

## 🔄 How to Adjust Limits Further

If you need to change the limits, edit `server/middleware/rateLimiter.js`:

```javascript
// Make it even more lenient (for heavy testing)
export const registerLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // 20 attempts
  skipSuccessfulRequests: true,
  // ...
});

// Or disable rate limiting completely (NOT RECOMMENDED)
export const registerLimiter = (req, res, next) => next();
```

## ✅ Summary

**Problem**: Too strict rate limiting (3 attempts per hour)
**Solution**: Increased to 10 attempts per 15 minutes
**Result**: You can now test registration without getting blocked!

---

**The fix is already applied!** Just restart your backend server and try again. 🚀
