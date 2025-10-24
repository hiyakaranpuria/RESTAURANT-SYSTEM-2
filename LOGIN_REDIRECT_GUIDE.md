# Login & Redirect Flow Guide

## Overview

The authentication system now properly handles login, signup, and redirects based on user roles.

## User Flow Diagrams

### New User Signup Flow

```
Visit /signup
    ↓
Fill signup form
    ↓
Click "Sign Up"
    ↓
Account created
    ↓
Auto-login
    ↓
Redirect to HomePage (/)
    ↓
See welcome message
```

### Existing User Login Flow

```
Visit /login
    ↓
Enter credentials
    ↓
Click "Login"
    ↓
Authentication
    ↓
Role-based redirect:
    ├─ Admin → /admin/menu
    ├─ Staff → /staff/orders
    └─ Customer → / (HomePage)
```

### Already Logged In

```
Visit /login or /signup
    ↓
Check if user exists
    ↓
If logged in:
    ├─ Admin → /admin/menu
    ├─ Staff → /staff/orders
    └─ Customer → /
```

## Pages & Routes

### Public Routes (No Auth Required)

- `/login` - Login page
- `/signup` - Signup page
- `/m/:qrSlug` - Menu page (QR code access)
- `/cart` - Cart page
- `/order/:orderId` - Order status page

### Protected Routes (Auth Required)

- `/` - Home page (redirects based on role)
- `/staff/orders` - Staff order queue (staff, admin only)
- `/admin/menu` - Menu management (admin only)
- `/admin/tables` - Table management (admin only)

## Role-Based Redirects

### Customer Role

- After login → `/` (HomePage with welcome message)
- After signup → `/` (HomePage with welcome message)
- Can access: Menu, Cart, Order Status
- Cannot access: Staff dashboard, Admin panel

### Staff Role

- After login → `/staff/orders` (Order queue)
- Can access: Order queue, Menu, Cart, Order Status
- Cannot access: Admin panel

### Admin Role

- After login → `/admin/menu` (Menu management)
- Can access: Everything (Admin panel, Staff dashboard, Customer features)

## HomePage Features

The new HomePage (`/`) shows:

- Welcome message with user's name
- How to order instructions (4 steps)
- QR code scanning guide
- Logout button
- Note about guest ordering

### For Customers

- Explains the QR ordering process
- Shows they don't need to login to order
- Mentions future features (order history, preferences)

### For Staff/Admin

- Automatically redirects to their dashboard
- Never see the customer welcome page

## Testing the Flow

### Test 1: New User Signup

1. Go to http://localhost:3000/signup
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - Confirm: test123
3. Click "Sign Up"
4. ✅ Should see HomePage with "Welcome, Test User!"

### Test 2: Customer Login

1. Go to http://localhost:3000/login
2. Enter:
   - Email: customer@restaurant.com
   - Password: customer123
3. Click "Login"
4. ✅ Should redirect to HomePage

### Test 3: Staff Login

1. Go to http://localhost:3000/login
2. Enter:
   - Email: staff@restaurant.com
   - Password: staff123
3. Click "Login"
4. ✅ Should redirect to /staff/orders

### Test 4: Admin Login

1. Go to http://localhost:3000/login
2. Enter:
   - Email: admin@restaurant.com
   - Password: admin123
3. Click "Login"
4. ✅ Should redirect to /admin/menu

### Test 5: Already Logged In

1. Login as any user
2. Try to visit /login or /signup
3. ✅ Should auto-redirect to appropriate page

### Test 6: Logout

1. Login as customer
2. Click "Logout" on HomePage
3. ✅ Should redirect to /login
4. ✅ Token should be cleared

## Code Changes

### New Files

- ✅ `src/pages/HomePage.jsx` - Welcome page for customers

### Modified Files

- ✅ `src/App.jsx` - Changed `/` route to HomePage
- ✅ `src/pages/auth/LoginPage.jsx` - Added redirect for logged-in users
- ✅ `src/pages/auth/SignupPage.jsx` - Added redirect for logged-in users

## Redirect Logic

### LoginPage

```javascript
useEffect(() => {
  if (user) {
    if (user.role === "admin") {
      navigate("/admin/menu");
    } else if (user.role === "staff") {
      navigate("/staff/orders");
    } else {
      navigate("/");
    }
  }
}, [user, navigate]);
```

### SignupPage

```javascript
// After successful registration
window.location.href = "/";
// This forces a full page reload to update auth context
```

### HomePage

```javascript
useEffect(() => {
  if (!loading) {
    if (!user) {
      navigate("/login");
    } else if (user.role === "admin") {
      navigate("/admin/menu");
    } else if (user.role === "staff") {
      navigate("/staff/orders");
    }
    // else: customer stays on HomePage
  }
}, [user, loading, navigate]);
```

## Security Features

### Protected Routes

- Staff and Admin routes check user role
- Unauthorized users redirected to `/`
- Non-authenticated users redirected to `/login`

### Auth State Management

- Token stored in localStorage
- Token added to axios headers
- User state managed by AuthContext
- Loading state prevents flash of wrong content

## Common Issues & Solutions

### Issue: Redirect loop

**Solution**: HomePage now properly handles customer role without redirecting

### Issue: Not redirecting after login

**Solution**: useEffect watches user state and redirects when it changes

### Issue: Can access login page when logged in

**Solution**: Login/Signup pages check user state and redirect

### Issue: Signup doesn't redirect

**Solution**: Uses window.location.href to force page reload and auth update

## Future Enhancements

- [ ] Remember last visited page before login
- [ ] Redirect to that page after login
- [ ] Add "Continue as Guest" option
- [ ] Show loading spinner during redirects
- [ ] Add animation transitions between pages
- [ ] Store redirect URL in session storage
- [ ] Add breadcrumb navigation
- [ ] Show user role badge on HomePage
