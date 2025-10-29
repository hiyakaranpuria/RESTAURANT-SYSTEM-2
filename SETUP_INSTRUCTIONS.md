# Restaurant System - Setup Instructions

## ✅ Setup Complete!

Your restaurant system is now ready to run. Here's what was done:

### 1. Dependencies Installed ✓

- All npm packages have been installed
- Frontend and backend dependencies are ready

### 2. Environment Configuration ✓

- `.env` file created with default settings
- MongoDB connection configured
- JWT secrets set up

### 3. Database Seeded ✓

- Demo restaurant created
- Sample menu items added
- Test users created
- QR codes generated for tables

---

## 🚀 How to Start the Application

### Option 1: Quick Start (Recommended)

Double-click `start.bat` - This will open two terminal windows:

- Backend server (Port 5000)
- Frontend server (Port 5173)

### Option 2: Manual Start

Open two separate terminals:

**Terminal 1 - Backend:**

```bash
cd RESTAURANT-SYSTEM-2
npm run server
```

**Terminal 2 - Frontend:**

```bash
cd RESTAURANT-SYSTEM-2
npm run dev
```

---

## 🔑 Test Accounts

After starting the servers, you can login with these accounts:

### Admin Account

- **Email:** admin@restaurant.com
- **Password:** admin123
- **Access:** Full system administration

### Staff Account

- **Email:** staff@restaurant.com
- **Password:** staff123
- **Access:** Order management

### Customer Account

- **Email:** customer@restaurant.com
- **Password:** customer123
- **Access:** Browse menu and place orders

### Restaurant Owner Account

- **Email:** owner@demorestaurant.com
- **Password:** restaurant123
- **Access:** Restaurant management

---

## 🌐 Access URLs

Once both servers are running:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Sample QR Menu:** http://localhost:3000/t/table-1-XXXXXXXXXX

---

## 📱 Testing the System

### As a Customer:

1. Visit the QR URL above
2. Browse the menu
3. Add items to cart
4. Customize items (sizes, add-ons, etc.)
5. Place an order

### As Staff:

1. Login at http://localhost:5173/login
2. Go to Staff Dashboard
3. View and manage orders
4. Update order status

### As Admin:

1. Login at http://localhost:5173/login
2. Access Admin Dashboard
3. Manage menu items
4. Manage categories
5. Generate QR codes

### As Restaurant Owner:

1. Login at http://localhost:5173/restaurant/login
2. Manage your restaurant
3. Add/edit menu items
4. View orders

---

## 🛠️ Common Commands

```bash
# Install dependencies
npm install

# Start backend only
npm run server

# Start frontend only
npm run dev

# Build for production
npm run build

# Re-seed database (clears all data!)
npm run seed
```

---

## 📊 Database Info

- **Database Name:** restaurant-qr-menu
- **Connection:** mongodb://localhost:27017
- **Restaurant ID:** 69010a3b36283e57ddfb3f02

---

## 🐛 Troubleshooting

### MongoDB Not Running

```bash
# Check if MongoDB service is running
Get-Service -Name MongoDB

# Start MongoDB if stopped
Start-Service MongoDB
```

### Port Already in Use

- Change PORT in `.env` file
- Or kill the process using the port

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Database Issues

```bash
# Re-seed the database
npm run seed
```

---

## 📚 Additional Documentation

- **README.md** - Full project documentation
- **QUICKSTART.md** - Quick start guide
- **CUSTOMIZATION_GUIDE.md** - Menu customization features
- **API_ENDPOINTS.md** - API documentation

---

## 🎉 Next Steps

1. Start the servers using `start.bat`
2. Visit http://localhost:5173
3. Login with one of the test accounts
4. Explore the features!

---

## 💡 Tips

- The system supports multiple restaurants
- Each restaurant can have its own menu and tables
- QR codes are unique per table
- Orders are tracked in real-time
- Menu items support full customization (sizes, add-ons, options)

---

**Enjoy your restaurant management system!** 🍽️
