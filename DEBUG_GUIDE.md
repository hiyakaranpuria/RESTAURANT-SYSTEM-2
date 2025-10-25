# 🐛 Debug Guide - Multi-Session Authentication

## Issues Found & Fixed

### ✅ Issue 1: useSessionManagement Hook

**Problem**: Still importing from old `AuthContext`
**Fixed**: Changed to import from `MultiAuthContext`

### ✅ Issue 2: Missing Debug Logging

**Added**: Console logs to track authentication flow

## How to Debug

### Step 1: Open Browser Console

Press `F12` or `Ctrl+Shift+I` to open developer tools

### Step 2: Clear All Storage

```javascript
// Run in console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Step 3: Try Restaurant Login

1. Go to `/restaurant/login`
2. Enter credentials
3. Watch console for these logs:

```
[MultiAuth] Logging in as restaurant...
[MultiAuth] Login successful for restaurant
[MultiAuth] Sessions updated: {customer: {...}, restaurant: {...}, admin: {...}}
[MultiAuth] Current session type set to: restaurant
[MultiAuth] Sessions state: {...}
[MultiAuth] isRestaurantAuthenticated: true
```

### Step 4: Check What You See

#### ✅ If you see these logs:

- Login is working
- Session is being created
- Check if redirect happens

#### ❌ If you don't see logs:

- Check network tab for API errors
- Check if login endpoint is correct
- Verify server is running

### Step 5: Check localStorage

```javascript
// Run in console
console.log("Restaurant Token:", localStorage.getItem("restaurant_token"));
console.log("Restaurant Data:", localStorage.getItem("restaurant_data"));
console.log(
  "Restaurant Timestamp:",
  localStorage.getItem("restaurant_token_timestamp")
);
```

Should show:

```
Restaurant Token: eyJhbGc...
Restaurant Data: {"_id":"...","restaurantName":"..."}
Restaurant Timestamp: 1234567890
```

### Step 6: Check Auth State in Component

Add this to RestaurantDashboard temporarily:

```javascript
useEffect(() => {
  console.log(
    "[Dashboard] isRestaurantAuthenticated:",
    isRestaurantAuthenticated
  );
  console.log("[Dashboard] getToken result:", getToken("restaurant"));
}, [isRestaurantAuthenticated]);
```

## Common Issues & Solutions

### Issue: "isRestaurantAuthenticated is false"

**Causes**:

1. Login didn't complete
2. Token not stored
3. Session state not updated

**Debug**:

```javascript
// Check if token exists
localStorage.getItem("restaurant_token");

// Check sessions state
// (Add to component)
const { sessions } = useAuth();
console.log("Sessions:", sessions);
```

**Fix**:

- Clear storage and try again
- Check login function is called with correct type
- Verify API response format

### Issue: "Dashboard redirects to login"

**Causes**:

1. `isRestaurantAuthenticated` is false
2. Token expired
3. Session not initialized

**Debug**:

```javascript
// In RestaurantDashboard
useEffect(() => {
  console.log("Auth check:", {
    isRestaurantAuthenticated,
    token: getToken("restaurant"),
    session: getRestaurantSession(),
  });
}, []);
```

**Fix**:

- Ensure login completes before navigation
- Check token is valid
- Verify session initialization

### Issue: "API calls return 401"

**Causes**:

1. Token not in axios headers
2. Wrong token being used
3. Token expired

**Debug**:

```javascript
// Check axios headers
console.log("Axios headers:", axios.defaults.headers.common);
```

**Fix**:

```javascript
// Manually set token
const token = localStorage.getItem("restaurant_token");
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
```

### Issue: "Multiple sessions conflict"

**Causes**:

1. Using wrong session check
2. Token overwriting

**Debug**:

```javascript
// Check all tokens
console.log("Customer token:", localStorage.getItem("customer_token"));
console.log("Restaurant token:", localStorage.getItem("restaurant_token"));
console.log("Admin token:", localStorage.getItem("admin_token"));
```

**Fix**:

- Each page should check its specific session
- Don't use generic `isAuthenticated`

## Testing Checklist

### ✅ Restaurant Login

- [ ] Console shows login logs
- [ ] Token stored in localStorage
- [ ] `isRestaurantAuthenticated` becomes true
- [ ] Redirects to dashboard
- [ ] Dashboard loads data

### ✅ Customer Login

- [ ] Console shows login logs
- [ ] Token stored with `customer_` prefix
- [ ] `isCustomerAuthenticated` becomes true
- [ ] Redirects to dashboard
- [ ] Doesn't affect restaurant session

### ✅ Multi-Session

- [ ] Can login as restaurant
- [ ] Can login as customer (same browser)
- [ ] Both tokens exist in localStorage
- [ ] Both sessions work independently
- [ ] No conflicts

## Quick Fixes

### Fix 1: Force Clear Everything

```javascript
// Run in console
localStorage.clear();
sessionStorage.clear();
delete axios.defaults.headers.common["Authorization"];
location.reload();
```

### Fix 2: Manually Set Session

```javascript
// For testing - run in console
const token = "YOUR_TOKEN_HERE";
localStorage.setItem("restaurant_token", token);
localStorage.setItem("restaurant_token_timestamp", Date.now().toString());
location.reload();
```

### Fix 3: Check API Response

```javascript
// In login function, add:
console.log("API Response:", data);
console.log("Token:", data.token);
console.log("User/Restaurant:", data.user || data.restaurant);
```

## Expected Console Output

### Successful Restaurant Login:

```
[MultiAuth] Logging in as restaurant...
[MultiAuth] Login successful for restaurant {token: "...", restaurant: {...}}
[MultiAuth] Sessions updated: {
  customer: {user: null, isAuthenticated: false},
  restaurant: {user: {...}, isAuthenticated: true},
  admin: {user: null, isAuthenticated: false}
}
[MultiAuth] Current session type set to: restaurant
[MultiAuth] Sessions state: {...}
[MultiAuth] isRestaurantAuthenticated: true
[Dashboard] isRestaurantAuthenticated: true
[Dashboard] getToken result: eyJhbGc...
```

### Successful Customer Login (while restaurant logged in):

```
[MultiAuth] Logging in as customer...
[MultiAuth] Login successful for customer {token: "...", user: {...}}
[MultiAuth] Sessions updated: {
  customer: {user: {...}, isAuthenticated: true},
  restaurant: {user: {...}, isAuthenticated: true},
  admin: {user: null, isAuthenticated: false}
}
[MultiAuth] Current session type set to: customer
[MultiAuth] Sessions state: {...}
[MultiAuth] isCustomerAuthenticated: true
[MultiAuth] isRestaurantAuthenticated: true  ← Both true!
```

## Next Steps

1. **Clear everything**: `localStorage.clear()` + reload
2. **Try restaurant login**: Watch console logs
3. **Check localStorage**: Verify tokens are stored
4. **Check dashboard**: Should load without redirect
5. **Report back**: Share console logs if still not working

## Files with Debug Logging

- `src/context/MultiAuthContext.jsx` - Main auth logic
- Add to components as needed for debugging

## Remove Debug Logs Later

Once everything works, remove console.log statements for production.

🐛 **Follow this guide step by step to identify the exact issue!**
