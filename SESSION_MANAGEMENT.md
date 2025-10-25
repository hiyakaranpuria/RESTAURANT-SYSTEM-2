# 🔐 Session Management Implementation

## Overview

Comprehensive session management system with auto-logout, token refresh, and proper authentication handling.

---

## ✅ Features Implemented

### 1. **Enhanced Authentication Context**

- ✅ Token expiration tracking (7 days)
- ✅ Auto token refresh (every 5 days)
- ✅ Axios interceptor for 401 errors
- ✅ Token timestamp storage
- ✅ Automatic logout on token expiry
- ✅ Support for both user and restaurant logins

### 2. **Login Page Guards**

- ✅ Auto-logout when visiting login page while authenticated
- ✅ Prevents stale sessions
- ✅ Clean slate for new login
- ✅ Applied to all login pages (User, Restaurant, Admin)

### 3. **Session Management Hook**

- ✅ Periodic auth checks (every minute)
- ✅ Tab visibility detection
- ✅ Browser back/forward handling
- ✅ Auto-logout on session expiry
- ✅ Prevents automatic logouts

### 4. **Protected Routes**

- ✅ Auth validation before rendering
- ✅ Role-based access control
- ✅ Redirect to login with return URL
- ✅ Loading states

---

## 🔧 How It Works

### Token Lifecycle

```
Login
  ↓
Token Generated (7 days expiry)
  ↓
Token Stored with Timestamp
  ↓
Token Used in Requests
  ↓
Auto-Refresh (after 5 days)
  ↓
Token Expires (after 7 days)
  ↓
Auto-Logout
```

### Session Checks

```
1. On App Load
   - Check token exists
   - Check token age
   - Fetch user data
   - Set auth state

2. Every Minute
   - Validate token age
   - Logout if expired

3. On Tab Return
   - Check auth status
   - Logout if expired

4. On Navigation
   - Check auth status
   - Redirect if needed

5. On API Error (401)
   - Auto-logout
   - Redirect to login
```

---

## 📁 Files Created/Modified

### New Files:

1. **`src/components/AuthGuard.jsx`**

   - LoginPageGuard - Logout on login page visit
   - ProtectedRoute - Protect authenticated routes
   - PublicRoute - Redirect authenticated users

2. **`src/hooks/useSessionManagement.js`**
   - Periodic auth checks
   - Tab visibility handling
   - Browser navigation handling

### Modified Files:

3. **`src/context/AuthContext.jsx`**

   - Enhanced with token refresh
   - Axios interceptor
   - Token timestamp tracking
   - Better error handling

4. **`src/pages/auth/LoginPage.jsx`**

   - Wrapped with LoginPageGuard
   - Better redirect logic

5. **`src/pages/restaurant/RestaurantLoginPage.jsx`**

   - Wrapped with LoginPageGuard
   - Uses AuthContext login

6. **`src/pages/auth/AdminLoginPage.jsx`**

   - Wrapped with LoginPageGuard

7. **`src/pages/restaurant/RestaurantDashboard.jsx`**
   - Uses useSessionManagement hook
   - Prevents auto-logout

---

## 🎯 Problems Solved

### Problem 1: Automatic Logout in Restaurant Dashboard

**Cause**: Token not being validated properly, or token expiring silently

**Solution**:

- Token timestamp tracking
- Periodic validation (every minute)
- Auto-refresh before expiry (5 days)
- Axios interceptor catches 401 errors
- Session management hook prevents silent logouts

### Problem 2: Going Back to Login Page

**Cause**: User could visit login page while authenticated, causing confusion

**Solution**:

- LoginPageGuard component
- Auto-logout when visiting login page
- Clean slate for new login
- Prevents session conflicts

### Problem 3: Token Expiration Not Handled

**Cause**: No mechanism to refresh or validate tokens

**Solution**:

- Token timestamp stored on login
- Auto-refresh every 5 days
- Validation checks token age
- Graceful logout on expiry

---

## 🧪 Testing

### Test 1: Login and Stay Logged In

```
1. Login to restaurant dashboard
2. Wait 1 minute
3. Should stay logged in
4. Navigate around
5. Should stay logged in
```

### Test 2: Token Expiry

```
1. Login
2. Manually set old timestamp:
   localStorage.setItem('tokenTimestamp', '0')
3. Wait 1 minute or refresh page
4. Should auto-logout
```

### Test 3: Login Page Auto-Logout

```
1. Login to restaurant dashboard
2. Navigate to /restaurant/login
3. Should auto-logout
4. Can login fresh
```

### Test 4: Tab Visibility

```
1. Login
2. Switch to another tab for 10 minutes
3. Come back
4. Should check auth and stay logged in (if valid)
```

### Test 5: Browser Back Button

```
1. Login
2. Navigate to dashboard
3. Click browser back
4. Should check auth
5. Should stay logged in (if valid)
```

---

## 🔐 Security Features

### 1. Token Storage

```javascript
// Stored in localStorage
{
  token: "JWT_TOKEN",
  tokenTimestamp: "1234567890",
  userType: "user" | "restaurant"
}
```

### 2. Token Validation

```javascript
// Check on:
- App initialization
- Every minute
- Tab visibility change
- Navigation
- API 401 errors
```

### 3. Auto-Refresh

```javascript
// Refresh token every 5 days
// Before 7-day expiry
// Prevents sudden logouts
```

### 4. Axios Interceptor

```javascript
// Catches 401 errors
// Auto-logout on token expiry
// Prevents API errors
```

---

## 📊 Configuration

### Token Expiry (Backend)

```javascript
// server/routes/auth.js
jwt.sign({ userId }, JWT_SECRET, {
  expiresIn: "7d", // 7 days
});
```

### Refresh Interval (Frontend)

```javascript
// src/context/AuthContext.jsx
const TOKEN_REFRESH_INTERVAL = 5 * 24 * 60 * 60 * 1000; // 5 days
```

### Check Interval

```javascript
// src/hooks/useSessionManagement.js
const checkInterval = setInterval(() => {
  checkAuth();
}, 60000); // 1 minute
```

---

## 🎨 User Experience

### Before:

- ❌ Random logouts in dashboard
- ❌ Confusion when visiting login page
- ❌ No token refresh
- ❌ Silent failures

### After:

- ✅ Stable sessions
- ✅ Auto-logout on login page visit
- ✅ Auto token refresh
- ✅ Clear error messages
- ✅ Graceful logout
- ✅ Better UX

---

## 🔄 Login Flow

### User Login

```
1. Visit /login
2. If authenticated → Auto-logout
3. Enter credentials
4. Login via AuthContext
5. Token stored with timestamp
6. Redirect to dashboard
7. Session managed automatically
```

### Restaurant Login

```
1. Visit /restaurant/login
2. If authenticated → Auto-logout
3. Enter credentials
4. Login via AuthContext (type: "restaurant")
5. Token stored with timestamp
6. Check verification status
7. Redirect accordingly
8. Session managed automatically
```

---

## 🛠️ Customization

### Change Token Expiry

```javascript
// Backend: server/routes/auth.js
expiresIn: "30d"; // Change to 30 days

// Frontend: src/context/AuthContext.jsx
const sevenDays = 30 * 24 * 60 * 60 * 1000; // Change to 30 days
```

### Change Refresh Interval

```javascript
// src/context/AuthContext.jsx
const TOKEN_REFRESH_INTERVAL = 10 * 24 * 60 * 60 * 1000; // 10 days
```

### Change Check Interval

```javascript
// src/hooks/useSessionManagement.js
const checkInterval = setInterval(() => {
  checkAuth();
}, 30000); // 30 seconds instead of 1 minute
```

### Disable Auto-Logout on Login Page

```javascript
// Remove LoginPageGuard from login pages
// Not recommended, but possible
```

---

## 💡 Best Practices

### 1. Always Use AuthContext

```javascript
// ✅ Good
const { login, logout, isAuthenticated } = useAuth();

// ❌ Bad
localStorage.setItem("token", token);
```

### 2. Use Session Management Hook

```javascript
// In protected pages
import { useSessionManagement } from "../hooks/useSessionManagement";

function Dashboard() {
  useSessionManagement(); // Add this
  // ...
}
```

### 3. Check Auth Before Actions

```javascript
// Before important actions
const { checkAuth } = useAuth();

const handleImportantAction = () => {
  if (!checkAuth()) {
    alert("Session expired");
    return;
  }
  // Proceed with action
};
```

### 4. Handle Errors Gracefully

```javascript
try {
  await api.call();
} catch (error) {
  if (error.response?.status === 401) {
    // Will be handled by interceptor
    // But you can show user message
    alert("Session expired, please login again");
  }
}
```

---

## 🐛 Troubleshooting

### Issue: Still Getting Auto-Logged Out

**Solution**:

1. Check browser console for errors
2. Verify token is being stored
3. Check token timestamp
4. Verify API is returning valid tokens
5. Check axios interceptor is working

### Issue: Can't Login After Logout

**Solution**:

1. Clear localStorage completely
2. Hard refresh (Ctrl+Shift+R)
3. Check network tab for API errors
4. Verify credentials are correct

### Issue: Token Not Refreshing

**Solution**:

1. Check refresh endpoint exists
2. Verify TOKEN_REFRESH_INTERVAL
3. Check console for refresh errors
4. Verify token is valid

### Issue: Login Page Not Auto-Logging Out

**Solution**:

1. Verify LoginPageGuard is wrapping component
2. Check useAuth hook is working
3. Verify logout function is called
4. Check browser console

---

## ✅ Verification Checklist

- [x] Token stored with timestamp
- [x] Token refreshes automatically
- [x] Axios interceptor catches 401
- [x] Login page auto-logouts
- [x] Session checks every minute
- [x] Tab visibility handled
- [x] Browser navigation handled
- [x] Protected routes work
- [x] Role-based access works
- [x] Graceful error handling

---

## 🎉 Result

Your application now has **production-grade session management**:

- ✅ No more random logouts
- ✅ Clean login experience
- ✅ Auto token refresh
- ✅ Proper error handling
- ✅ Better security
- ✅ Better UX

**Sessions are now stable and properly managed!** 🚀
