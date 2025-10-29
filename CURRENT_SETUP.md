# Current System Setup

## ✅ Configuration Summary

Your restaurant system is configured and ready to run!

---

## 🌐 Ports

| Service      | Port  | URL                       |
| ------------ | ----- | ------------------------- |
| **Frontend** | 3000  | http://localhost:3000     |
| **Backend**  | 5000  | http://localhost:5000     |
| **MongoDB**  | 27017 | mongodb://localhost:27017 |

---

## 🚀 Quick Start

### Start Both Servers:

```bash
# Option 1: Use batch file
start.bat

# Option 2: Manual
# Terminal 1:
npm run server

# Terminal 2:
npm run dev
```

### Seed Database:

```bash
npm run seed
```

---

## 🔑 Test Accounts

| Role                 | Email                    | Password      |
| -------------------- | ------------------------ | ------------- |
| **Admin**            | admin@restaurant.com     | admin123      |
| **Staff**            | staff@restaurant.com     | staff123      |
| **Customer**         | customer@restaurant.com  | customer123   |
| **Restaurant Owner** | owner@demorestaurant.com | restaurant123 |

---

## 📱 Access Points

### Customer Access:

- **QR Menu:** http://localhost:3000/t/table-X-XXXXX (from seed output)
- **Direct Menu:** http://localhost:3000/m/RESTAURANT_ID

### Staff/Admin Access:

- **Login:** http://localhost:3000/login
- **Staff Dashboard:** http://localhost:3000/staff/orders
- **Admin Dashboard:** http://localhost:3000/admin/menu

### Restaurant Owner Access:

- **Login:** http://localhost:3000/restaurant/login
- **Dashboard:** http://localhost:3000/restaurant/dashboard

---

## 📁 Key Files

### Configuration:

- `vite.config.js` - Frontend config (port 3000)
- `.env` - Backend config (port 5000)
- `server/index.js` - Backend entry point

### Database:

- `server/seed.js` - Database seeder
- `server/models/` - Mongoose models

### Frontend:

- `src/App.jsx` - Main app with routes
- `src/pages/` - All page components
- `src/components/` - Reusable components

---

## 🔧 Recent Fixes

### 1. QR Menu Loading Issue ✅

- **Problem:** Page stuck on "Loading..."
- **Fix:** Added missing `/api/restaurant/qr/:qrSlug` endpoint
- **File:** `server/routes/restaurant.js`

### 2. Order Placement Network Error ✅

- **Problem:** "Network Error" when placing orders
- **Fix:** Updated Vite proxy configuration
- **Files:** `vite.config.js`, `src/config/axios.js`

### 3. Port Configuration ✅

- **Change:** Configured to use port 3000 (instead of 5173)
- **Files:** `vite.config.js`, `server/seed.js`, `.env`

---

## 📚 Documentation

| File                    | Purpose                         |
| ----------------------- | ------------------------------- |
| `README.md`             | Full project documentation      |
| `SETUP_INSTRUCTIONS.md` | Initial setup guide             |
| `PORT_3000_GUIDE.md`    | Port 3000 specific guide        |
| `QR_TESTING_GUIDE.md`   | QR code testing instructions    |
| `ORDER_FIX_GUIDE.md`    | Order placement troubleshooting |
| `CURRENT_SETUP.md`      | This file - current status      |

---

## ✨ Features Working

- ✅ QR code menu access
- ✅ Menu browsing and search
- ✅ Item customization (sizes, add-ons, options)
- ✅ Shopping cart
- ✅ Order placement
- ✅ Order tracking
- ✅ Staff order management
- ✅ Admin menu management
- ✅ Restaurant dashboard
- ✅ Customer authentication
- ✅ Feedback system

---

## 🧪 Test Flow

### 1. Customer Orders:

```
Scan QR → Browse Menu → Add to Cart → Checkout → Place Order → Track Status
```

### 2. Staff Management:

```
Login → View Orders → Update Status → Mark Ready/Delivered
```

### 3. Admin Management:

```
Login → Manage Menu → Add Items → Generate QR Codes
```

### 4. Restaurant Owner:

```
Login → View Dashboard → Manage Menu → View Orders → Generate QR Codes
```

---

## 🐛 Common Issues & Solutions

### Issue: Port already in use

```powershell
# Find process
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F
```

### Issue: MongoDB not running

```powershell
# Check status
Get-Service MongoDB

# Start service
Start-Service MongoDB
```

### Issue: API calls failing

1. Check backend is running on port 5000
2. Check frontend is running on port 3000
3. Clear browser cache (Ctrl+Shift+R)
4. Check browser console for errors

### Issue: Changes not appearing

1. Restart the affected server
2. Clear browser cache
3. Check for errors in terminal

---

## 📞 Quick Commands

```bash
# Install dependencies
npm install

# Start backend
npm run server

# Start frontend
npm run dev

# Seed database
npm run seed

# Build for production
npm run build

# Restart both servers
restart-servers.bat
```

---

## 🎯 Next Steps

1. **Test the system:**

   - Start both servers
   - Run seed script
   - Test QR menu
   - Place test orders

2. **Customize:**

   - Add your restaurant data
   - Upload menu images
   - Configure branding

3. **Deploy:**
   - Set up production environment
   - Configure production database
   - Deploy to hosting service

---

## 💡 Tips

- Use `start.bat` for easy server management
- Check both terminal windows for errors
- Keep MongoDB service running
- Clear browser cache when testing changes
- Use browser DevTools (F12) for debugging

---

**System Status: Ready to Use! 🎉**

Access your application at: **http://localhost:3000**
