# 🔑 All User Accounts Summary

## ✅ YES, Admin Login Exists!

All accounts are created automatically when you run `npm run seed`

---

## 👥 All User Accounts

### 👑 ADMIN

```
Email:    admin@restaurant.com
Password: admin123
Role:     admin
```

**After Login → Redirects to:** `/admin/menu`

**Can Access:**

- ✅ `/admin/menu` - Menu Management
- ✅ `/admin/tables` - Table Management
- ✅ `/staff/orders` - Order Queue
- ✅ All customer pages
- ✅ Everything in the system

**Permissions:**

- Create/Edit/Delete menu items
- Toggle item availability
- Manage categories
- Create/Delete tables
- Generate QR codes
- View/Update all orders
- Full system access

---

### 👨‍💼 STAFF

```
Email:    staff@restaurant.com
Password: staff123
Role:     staff
```

**After Login → Redirects to:** `/staff/orders`

**Can Access:**

- ✅ `/staff/orders` - Order Queue
- ✅ All customer pages (menu, cart, order status)

**Permissions:**

- View all orders
- Update order status
- Search/Filter orders
- Cannot access admin panel

---

### 👤 CUSTOMER

```
Email:    customer@restaurant.com
Password: customer123
Role:     customer
```

**After Login → Redirects to:** `/` (HomePage)

**Can Access:**

- ✅ `/` - HomePage (Welcome page)
- ✅ `/m/:qrSlug` - Menu (via QR code)
- ✅ `/cart` - Shopping Cart
- ✅ `/order/:orderId` - Order Status

**Permissions:**

- Browse menu
- Add to cart
- Place orders
- Track orders
- Cannot access staff or admin features

---

## 🚀 Quick Login Test

### Test Admin Login

```bash
1. Go to: http://localhost:3000/login
2. Email: admin@restaurant.com
3. Password: admin123
4. Click "Login"
5. ✅ Redirected to /admin/menu
```

### Test Staff Login

```bash
1. Go to: http://localhost:3000/login
2. Email: staff@restaurant.com
3. Password: staff123
4. Click "Login"
5. ✅ Redirected to /staff/orders
```

### Test Customer Login

```bash
1. Go to: http://localhost:3000/login
2. Email: customer@restaurant.com
3. Password: customer123
4. Click "Login"
5. ✅ Redirected to / (HomePage)
```

---

## 📊 Access Matrix

| Feature                 | Customer | Staff | Admin |
| ----------------------- | -------- | ----- | ----- |
| **Login/Signup**        | ✅       | ✅    | ✅    |
| **HomePage**            | ✅       | ✅    | ✅    |
| **Menu (QR)**           | ✅       | ✅    | ✅    |
| **Shopping Cart**       | ✅       | ✅    | ✅    |
| **Place Orders**        | ✅       | ✅    | ✅    |
| **Track Orders**        | ✅       | ✅    | ✅    |
| **Order Queue**         | ❌       | ✅    | ✅    |
| **Update Order Status** | ❌       | ✅    | ✅    |
| **Menu Management**     | ❌       | ❌    | ✅    |
| **Table Management**    | ❌       | ❌    | ✅    |
| **QR Generation**       | ❌       | ❌    | ✅    |

---

## 🎯 Login Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    LOGIN PAGE                           │
│                 /login                                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
         ┌───────────────────────┐
         │  Enter Credentials    │
         │  Email + Password     │
         └───────────┬───────────┘
                     │
                     ↓
         ┌───────────────────────┐
         │   Authentication      │
         │   Check Role          │
         └───────────┬───────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ↓            ↓            ↓
   ┌────────┐  ┌─────────┐  ┌──────────┐
   │ Admin  │  │  Staff  │  │ Customer │
   └────┬───┘  └────┬────┘  └────┬─────┘
        │           │            │
        ↓           ↓            ↓
   ┌────────┐  ┌─────────┐  ┌──────────┐
   │/admin/ │  │/staff/  │  │    /     │
   │ menu   │  │ orders  │  │ HomePage │
   └────────┘  └─────────┘  └──────────┘
```

---

## 🔐 Where Accounts Are Created

### In `server/seed.js`:

```javascript
// Create users
const adminPassword = await bcrypt.hash("admin123", 10);
const staffPassword = await bcrypt.hash("staff123", 10);
const customerPassword = await bcrypt.hash("customer123", 10);

await User.create([
  {
    name: "Admin User",
    email: "admin@restaurant.com",
    passwordHash: adminPassword,
    role: "admin", // 👑 ADMIN ROLE
  },
  {
    name: "Staff User",
    email: "staff@restaurant.com",
    passwordHash: staffPassword,
    role: "staff", // 👨‍💼 STAFF ROLE
  },
  {
    name: "Customer User",
    email: "customer@restaurant.com",
    passwordHash: customerPassword,
    role: "customer", // 👤 CUSTOMER ROLE
  },
]);
```

---

## ✅ Verification Checklist

After running `npm run seed`, verify:

- [ ] Admin account created
- [ ] Staff account created
- [ ] Customer account created
- [ ] Can login as admin
- [ ] Can login as staff
- [ ] Can login as customer
- [ ] Admin redirects to /admin/menu
- [ ] Staff redirects to /staff/orders
- [ ] Customer redirects to /

---

## 🎉 Summary

**YES, you have admin login!**

All three user accounts are created when you seed the database:

1. **Admin** - Full system access
2. **Staff** - Order management
3. **Customer** - Menu browsing and ordering

Just run `npm run seed` and you're ready to login with any of these accounts!

---

## 📝 Quick Reference Card

```
┌──────────────────────────────────────────────────┐
│              LOGIN CREDENTIALS                   │
├──────────────────────────────────────────────────┤
│                                                  │
│  👑 ADMIN                                        │
│     admin@restaurant.com / admin123              │
│     → /admin/menu                                │
│                                                  │
│  👨‍💼 STAFF                                        │
│     staff@restaurant.com / staff123              │
│     → /staff/orders                              │
│                                                  │
│  👤 CUSTOMER                                     │
│     customer@restaurant.com / customer123        │
│     → / (HomePage)                               │
│                                                  │
└──────────────────────────────────────────────────┘
```

**All accounts work perfectly!** 🚀
