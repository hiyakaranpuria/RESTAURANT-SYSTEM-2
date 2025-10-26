# 🧪 Quick Test Guide

## Test 1: Rate Limit Fixed ✅

### Before Fix:

- Login 5-10 times → "Too many requests" ❌
- Create 5-10 orders → "Too many requests" ❌

### After Fix:

1. Go to: http://localhost:3000/login
2. Try logging in 20 times (wrong password is fine)
3. Should work without "Too many requests" error! ✅

---

## Test 2: Session Persistence Fixed ✅

### Before Fix:

- Login → Refresh page → Logged out ❌
- Login → Navigate → Logged out ❌

### After Fix:

#### Test A: Page Refresh

1. Login: http://localhost:3000/login
   - Email: customer@restaurant.com
   - Password: password123
2. Press F5 (refresh)
3. Still logged in! ✅

#### Test B: Navigation

1. Login as customer
2. Go to menu: http://localhost:3000/m/YOUR_RESTAURANT_ID
3. Add items to cart
4. Go to cart: http://localhost:3000/cart
5. Still logged in! ✅

#### Test C: Order Creation

1. Login as customer
2. Add items to cart
3. Checkout
4. Create order
5. No auto-logout! ✅

---

## Test 3: Multi-Session Support ✅

### Test Restaurant Session:

1. Login as restaurant: http://localhost:3000/restaurant/login
2. Go to dashboard: http://localhost:3000/restaurant/dashboard
3. Refresh page (F5)
4. Still logged in! ✅

### Test Customer Session:

1. Login as customer: http://localhost:3000/login
2. Go to menu
3. Refresh page (F5)
4. Still logged in! ✅

---

## 🔍 Debug Checklist

Open browser console (F12) and check for:

### Good Signs ✅:

```
[MultiAuth] Sessions state: {customer: {...}, restaurant: {...}}
[MultiAuth] Set axios header for customer
[MultiAuth] isCustomerAuthenticated: true
```

### Bad Signs ❌:

```
Token expired or invalid, logging out...
401 Unauthorized
```

If you see bad signs, clear localStorage:

```javascript
// In browser console:
localStorage.clear();
// Then refresh and login again
```

---

## 🚀 Quick Start

1. **Restart Backend**:

   ```bash
   npm run dev
   ```

2. **Clear Browser Cache** (optional):

   - Ctrl+Shift+Delete
   - Or hard refresh: Ctrl+F5

3. **Test Login**:

   - Customer: customer@restaurant.com / password123
   - Restaurant: Use your restaurant email

4. **Refresh Page**:
   - Press F5
   - Should stay logged in!

---

## ✅ Success Criteria

All these should work now:

- ✅ Login multiple times without rate limit error
- ✅ Stay logged in after page refresh
- ✅ Navigate between pages without logout
- ✅ Create orders without auto-logout
- ✅ Multiple sessions work independently

**Everything should work smoothly now!** 🎉
