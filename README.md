# 🍽️ Restaurant QR Menu & Ordering System

> **Transform your restaurant into a modern, contactless dining experience!** Customers scan QR codes, browse menus, place orders, and track everything in real-time—all without downloading an app. Restaurant owners get a powerful dashboard to manage menus, generate QR codes, and handle orders seamlessly.

---

## 🚀 What Makes This Exciting?

Imagine walking into a restaurant, scanning a QR code on your table, and instantly seeing the full menu on your phone. You browse, customize your order, add items to cart, and place your order—all in seconds. The kitchen gets notified immediately, you track your order status in real-time, and when it's ready, you're notified. No waiting for waiters, no physical menus, no confusion.

**This is exactly what this system does!**

### 🎯 Key Highlights

- **📱 Zero App Downloads** - Works directly in any mobile browser
- **⚡ Lightning Fast** - Built with modern tech for instant responses
- **🏢 Multi-Restaurant Platform** - One system, unlimited restaurants
- **🔐 Bank-Level Security** - JWT authentication, encrypted passwords, rate limiting
- **💳 Guest Checkout** - Order without creating an account
- **⭐ Smart Feedback** - Rate individual items, earn loyalty points
- **🎁 Loyalty Rewards** - Customers earn points and get discounts
- **📊 Real-Time Tracking** - Live order status updates

---

## 🛠️ Tech Stack

This project is built with cutting-edge technologies:

### Frontend

- **React 18.2** - Modern UI library with hooks and context
- **Tailwind CSS 3.4** - Beautiful, responsive styling
- **Vite 5.0** - Lightning-fast build tool (way faster than Webpack!)
- **React Router v6** - Smooth client-side navigation
- **Axios** - Clean API communication
- **QRCode.react** - Generate QR codes on the fly

### Backend

- **Node.js + Express 4.18** - Robust server framework
- **MongoDB + Mongoose** - Flexible NoSQL database
- **JWT (jsonwebtoken)** - Secure authentication tokens
- **bcryptjs** - Military-grade password hashing
- **Nodemailer** - Email notifications (password reset, etc.)
- **Helmet** - Security headers protection
- **Express Rate Limit** - Prevent abuse and attacks
- **Multer** - Handle file uploads (documents, images)

---

## 📦 Installation & Setup

### Prerequisites

- **Node.js** v16+ ([Download here](https://nodejs.org/))
- **MongoDB** ([Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier)

### Step 1: Clone the Repository

```bash
git clone https://github.com/YashDave11/RESTAURANT-SYSTEM-2.git
cd RESTAURANT-SYSTEM-2
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/restaurant-qr-menu

# JWT Secrets (change these!)
JWT_SECRET=your-super-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here

# Server
PORT=5000
NODE_ENV=development

# Frontend URLs
CLIENT_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000

# Email (for password reset)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# App Name
APP_NAME=Restaurant QR Menu
```

> 💡 **Gmail Tip:** Use an [App Password](https://support.google.com/accounts/answer/185833), not your regular password!

### Step 4: Seed the Database (Optional but Recommended)

```bash
npm run seed
```

This creates sample data:

- Demo restaurants
- Menu items with categories
- Test accounts (admin, staff, customer)
- Sample tables with QR codes

### Step 5: Start the Application

**Windows Users:**

```bash
start.bat
```

**Manual Start (All Platforms):**

Terminal 1 - Backend:

```bash
npm run server
```

Terminal 2 - Frontend:

```bash
npm run dev
```

### Step 6: Open in Browser

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

---

## 🎮 How It Works

### For Customers:

1. **Scan QR Code** - Use phone camera to scan table QR code
2. **Browse Menu** - See all dishes with prices, images, descriptions
3. **Customize Order** - Select size, add-ons, special instructions
4. **Add to Cart** - Build your order
5. **Checkout** - Place order (with or without login)
6. **Track Status** - Watch your order go from "Placed" → "Preparing" → "Ready"
7. **Give Feedback** - Rate items, earn loyalty points

### For Restaurant Owners:

1. **Register** - Sign up with business details and documents
2. **Get Verified** - Admin reviews and approves your restaurant
3. **Create Menu** - Add items, categories, prices, images
4. **Generate QR Codes** - Create unique QR codes for each table
5. **Download/Print** - Get QR codes as images or PDFs
6. **Receive Orders** - Orders appear in real-time dashboard
7. **Manage Orders** - Update status, view history, track performance

### For Kitchen Staff:

1. **View Order Queue** - See all orders in Kanban board style
2. **Update Status** - Drag orders from "Placed" → "Preparing" → "Ready"
3. **Get Notifications** - Sound alerts for new orders
4. **Filter Orders** - By status, table, or time

### For Admins:

1. **Verify Restaurants** - Review documents, approve/reject
2. **Manage System** - Oversee all restaurants and orders
3. **User Management** - Handle all user accounts
4. **System Analytics** - Monitor platform performance

---

## 🔐 Security Features

We take security seriously:

- ✅ **JWT Authentication** - Secure token-based login
- ✅ **Password Hashing** - bcrypt with salt rounds
- ✅ **Rate Limiting** - Prevent brute force attacks
- ✅ **Input Sanitization** - Block XSS and injection attacks
- ✅ **CORS Protection** - Controlled cross-origin access
- ✅ **Helmet.js** - Security HTTP headers
- ✅ **File Upload Validation** - Type and size checks
- ✅ **Email Verification** - Secure password reset flow

---

## 🎯 Test Accounts

After running `npm run seed`, use these accounts:

| Role     | Email                   | Password    |
| -------- | ----------------------- | ----------- |
| Admin    | admin@restaurant.com    | admin123    |
| Staff    | staff@restaurant.com    | staff123    |
| Customer | customer@restaurant.com | customer123 |

---

## 🌟 Key Features

### Multi-Role System

- **Customers** - Browse, order, track, review
- **Restaurant Owners** - Manage menu, QR codes, orders
- **Kitchen Staff** - Handle order queue, update status
- **System Admins** - Verify restaurants, oversee platform

### Smart Menu System

- Categories and subcategories
- Item customization (sizes, add-ons)
- Dietary information (veg/non-veg)
- Availability toggle
- Search functionality
- Image uploads

### Order Management

- Real-time order tracking
- Status workflow: Placed → Preparing → Ready → Delivered
- Special instructions support
- Order history
- Reorder functionality

### QR Code System

- Unique QR for each table
- Download as image or PDF
- Automatic table identification
- No app required for customers

### Feedback & Loyalty

- Item-level ratings
- Order feedback
- Loyalty points system
- Points redemption for discounts

---

## 📱 API Endpoints

Quick reference for developers:

```
Authentication:
POST   /api/auth/register          - Register user
POST   /api/auth/login             - Login
POST   /api/auth/forgot-password   - Request reset code
POST   /api/auth/reset-password    - Reset password

Restaurants:
POST   /api/restaurant/register    - Register restaurant
POST   /api/restaurant/login       - Restaurant login
GET    /api/restaurant/tables      - Get tables
POST   /api/restaurant/tables      - Create table

Menu:
GET    /api/menu/items             - Get menu items
POST   /api/menu/items             - Create item (admin)
GET    /api/menu/by-table/:slug    - Get menu by QR code

Orders:
POST   /api/orders                 - Place order
GET    /api/orders                 - Get orders (filtered)
PATCH  /api/orders/:id/status      - Update order status
```

---

## 🚀 What's Next?

Future enhancements planned:

- Real-time updates with Socket.io
- Payment gateway integration
- Native mobile apps
- Multi-language support
- Advanced analytics
- Table reservation system
- Inventory management

---

## 👨‍💻 Author

**Yash Dave**
**Hiya Karanpuria**

- GitHub: [@YashDave11](https://github.com/YashDave11)
- GitHub: [@hiyakaranpuria](https://github.com/hiyakaranpuria)

---

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes!

---

<div align="center">

**Built with ❤️ for the Restaurant Industry**

⭐ Star this repo if you find it helpful!

</div>
