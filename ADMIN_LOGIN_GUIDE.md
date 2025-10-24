# 👑 Admin Login Guide

## ✅ Admin Account Already Created!

The admin account is automatically created when you run the database seed script.

---

## 🔑 Admin Credentials

```
Email:    admin@restaurant.com
Password: admin123
```

---

## 🚀 How to Login as Admin

### Step 1: Make Sure Database is Seeded

```bash
npm run seed
```

This creates:

- ✅ Admin account (admin@restaurant.com)
- ✅ Staff account (staff@restaurant.com)
- ✅ Customer account (customer@restaurant.com)
- ✅ Sample tables
- ✅ Sample menu items

### Step 2: Start the Application

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

### Step 3: Login as Admin

1. Go to http://localhost:3000/login
2. Enter:
   - **Email**: `admin@restaurant.com`
   - **Password**: `admin123`
3. Click "Login"
4. ✅ You'll be redirected to `/admin/menu`

---

## 👑 What Admin Can Access

### After Login, Admin is Redirected to:

**`/admin/menu`** - Menu Management Page

### Admin Can Access All Pages:

#### Admin Pages

- ✅ `/admin/menu` - Menu Management

  - View all menu items
  - Create new items
  - Edit items
  - Delete items
  - Toggle availability
  - Manage categories

- ✅ `/admin/tables` - Table Management
  - View all tables
  - Create new tables
  - Generate QR codes
  - Download QR codes
  - Print QR codes
  - Delete tables

#### Staff Pages (Admin has access)

- ✅ `/staff/orders` - Order Queue
  - View all orders
  - Update order status
  - Search orders
  - Filter orders

#### Customer Pages (Admin has access)

- ✅ `/` - HomePage
- ✅ `/m/:qrSlug` - Menu (via QR)
- ✅ `/cart` - Shopping Cart
- ✅ `/order/:orderId` - Order Status

---

## 🎯 Admin Features

### Menu Management (`/admin/menu`)

```
✅ View all menu items in grid
✅ Filter by category
✅ Search categories
✅ Toggle item availability (on/off switch)
✅ Edit item details
✅ Delete items
✅ Add new items
✅ View item images
✅ See item prices
```

### Table Management (`/admin/tables`)

```
✅ View all tables in list
✅ Search tables
✅ Create new tables
✅ Generate QR codes
✅ View QR code in modal
✅ Download QR as PNG
✅ Print QR codes
✅ Edit table details
✅ Delete tables
✅ Pagination
```

---

## 🔐 Admin Permissions

Admin has **FULL ACCESS** to:

- ✅ All API endpoints
- ✅ All pages
- ✅ All features
- ✅ Create/Read/Update/Delete operations
- ✅ User management (via API)
- ✅ Menu management
- ✅ Table management
- ✅ Order management

---

## 📱 Admin User Interface

### Menu Management Page

```
┌─────────────────────────────────────────────────────┐
│ Sidebar                │ Main Content               │
├────────────────────────┼────────────────────────────┤
│ QR Menu System         │ Menu Management            │
│ Admin Panel            │                            │
│                        │ Main Courses    [+ Add]    │
│ 🔍 Search categories   │                            │
│                        │ ┌──────┐ ┌──────┐ ┌──────┐│
│ Categories:            │ │ Pizza│ │Salmon│ │Burger││
│ • Appetizers           │ │$14.50│ │$18.00│ │$18.00││
│ • Soups & Salads       │ │ [✓]  │ │ [✓]  │ │ [✓]  ││
│ ▶ Main Courses         │ │ ✏️ 🗑️ │ │ ✏️ 🗑️ │ │ ✏️ 🗑️ ││
│ • Desserts             │ └──────┘ └──────┘ └──────┘│
│ • Beverages            │                            │
│                        │ [+ Add New Item]           │
│ [Create New Category]  │                            │
└────────────────────────┴────────────────────────────┘
```

### Tables Management Page

```
┌─────────────────────────────────────────────────────┐
│ Sidebar                │ Main Content               │
├────────────────────────┼────────────────────────────┤
│ RestauAdmin            │ Tables & QR Codes          │
│ Main Menu              │                            │
│                        │ Add and manage tables      │
│ Navigation:            │                [+ Add]     │
│ • Dashboard            │                            │
│ • Orders               │ 🔍 Search tables           │
│ • Menu                 │                            │
│ ▶ Tables               │ Table List:                │
│ • Settings             │ ┌──────────────────────┐  │
│                        │ │ Patio Table 1  [QR]  │  │
│                        │ │ Indoor Booth 5 [QR]  │  │
│                        │ │ Table 12       [QR]  │  │
│                        │ └──────────────────────┘  │
│                        │                            │
│                        │ Pagination: 1 2 3 ... 10   │
└────────────────────────┴────────────────────────────┘
```

---

## 🧪 Testing Admin Login

### Test 1: Login as Admin

```bash
1. Go to http://localhost:3000/login
2. Email: admin@restaurant.com
3. Password: admin123
4. Click "Login"
5. ✅ Should redirect to /admin/menu
```

### Test 2: Access Menu Management

```bash
1. After login, you're at /admin/menu
2. ✅ See all menu items
3. ✅ Click category to filter
4. ✅ Toggle availability switch
5. ✅ Click edit icon
6. ✅ Click delete icon
```

### Test 3: Access Table Management

```bash
1. Navigate to /admin/tables
2. ✅ See all tables
3. ✅ Click QR icon to view QR code
4. ✅ Download QR as PNG
5. ✅ Print QR code
```

### Test 4: Access Staff Features

```bash
1. Navigate to /staff/orders
2. ✅ See order queue
3. ✅ Update order status
4. ✅ Admin can do everything staff can do
```

---

## 🔄 Admin Redirect Flow

```
Admin visits /login
        ↓
Enters admin credentials
        ↓
Clicks "Login"
        ↓
Authentication successful
        ↓
Check user role = "admin"
        ↓
Redirect to /admin/menu
        ↓
Admin sees Menu Management page
```

---

## 🛡️ Security

### Admin-Only Routes

These routes are protected and only accessible by admin:

- `/admin/menu` - Menu management
- `/admin/tables` - Table management

### Admin API Endpoints

These endpoints require admin role:

- `POST /api/menu/items` - Create menu item
- `PATCH /api/menu/items/:id` - Update menu item
- `DELETE /api/menu/items/:id` - Delete menu item
- `POST /api/tables` - Create table
- `GET /api/tables/:id/qr` - Generate QR code
- `DELETE /api/tables/:id` - Delete table

### How It Works

```javascript
// Backend middleware checks role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

// Usage
router.post("/items", authenticate, authorize("admin"), createItem);
```

---

## 📝 All User Accounts

After running `npm run seed`, you have:

| Role         | Email                   | Password    | Access        |
| ------------ | ----------------------- | ----------- | ------------- |
| **Admin**    | admin@restaurant.com    | admin123    | Everything    |
| **Staff**    | staff@restaurant.com    | staff123    | Orders only   |
| **Customer** | customer@restaurant.com | customer123 | Menu & Orders |

---

## 🎯 Quick Admin Actions

### Add a New Menu Item

1. Login as admin
2. Go to `/admin/menu`
3. Click "Add New Item"
4. Fill in details
5. Save

### Generate QR Code for Table

1. Login as admin
2. Go to `/admin/tables`
3. Click QR icon next to table
4. Modal opens with QR code
5. Download or Print

### Toggle Item Availability

1. Login as admin
2. Go to `/admin/menu`
3. Find item
4. Click toggle switch
5. Item availability updated

---

## ✅ Confirmation

**YES, you have admin login!**

Just use:

- **Email**: `admin@restaurant.com`
- **Password**: `admin123`

It was created when you ran `npm run seed` and is ready to use! 🎉

---

## 🚀 Try It Now!

```bash
# If you haven't seeded yet
npm run seed

# Start the app
npm run server  # Terminal 1
npm run dev     # Terminal 2

# Login at
http://localhost:3000/login

# Use admin credentials
Email: admin@restaurant.com
Password: admin123
```

**You'll be redirected to the admin panel!** 👑
