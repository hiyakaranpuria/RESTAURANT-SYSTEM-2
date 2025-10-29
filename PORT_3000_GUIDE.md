# Port 3000 Configuration Guide

## ✅ System Configured for Port 3000

Your restaurant system is now configured to run on **port 3000** instead of 5173.

---

## 🌐 Access URLs

Once both servers are running:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

---

## 🚀 How to Start

### Option 1: Quick Start

Double-click `start.bat` to start both servers automatically.

### Option 2: Manual Start

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

The frontend will now start on **http://localhost:3000**

---

## 🔑 Login URLs

| User Type            | Login URL                              |
| -------------------- | -------------------------------------- |
| Admin/Staff/Customer | http://localhost:3000/login            |
| Restaurant Owner     | http://localhost:3000/restaurant/login |

---

## 📱 QR Code URLs

After running `npm run seed`, you'll get URLs like:

- **QR Menu (Table-based):** `http://localhost:3000/t/table-1-XXXXXXXXXX`
- **Direct Menu:** `http://localhost:3000/m/RESTAURANT_ID`

---

## 🧪 Testing Flow

### 1. Start Servers

```bash
# Make sure both are running
Backend: http://localhost:5000 ✅
Frontend: http://localhost:3000 ✅
```

### 2. Seed Database (if needed)

```bash
npm run seed
```

This will output the correct URLs with port 3000.

### 3. Test QR Menu

1. Copy the "Sample QR URL (Table-based)" from seed output
2. Open in browser: `http://localhost:3000/t/table-1-XXXXXXXXXX`
3. Menu should load immediately
4. Add items to cart
5. Proceed to checkout
6. Place order ✅

### 4. Test Admin Login

1. Go to: http://localhost:3000/login
2. Email: `admin@restaurant.com`
3. Password: `admin123`
4. Access admin dashboard ✅

---

## ⚙️ Configuration Files Updated

### 1. `vite.config.js`

```javascript
server: {
  port: 3000,  // ✅ Set to 3000
  proxy: {
    "/api": {
      target: "http://localhost:5000",
      changeOrigin: true,
      secure: false,
    },
  },
}
```

### 2. `.env`

```
PORT=5000
CLIENT_URL=http://localhost:3000
```

### 3. `server/seed.js`

- Updated to output URLs with port 3000

---

## 🔄 If You Need to Restart

### Restart Both Servers:

```bash
restart-servers.bat
```

### Or Restart Individually:

**Frontend only:**

1. Close frontend terminal (Ctrl+C)
2. Run: `npm run dev`
3. Opens on: http://localhost:3000

**Backend only:**

1. Close backend terminal (Ctrl+C)
2. Run: `npm run server`
3. Runs on: http://localhost:5000

---

## 🐛 Troubleshooting

### Port 3000 Already in Use?

**Check what's using it:**

```powershell
netstat -ano | findstr :3000
```

**Kill the process:**

```powershell
taskkill /PID <PID_NUMBER> /F
```

**Or change to different port:**
Edit `vite.config.js` and change `port: 3000` to another port like `3001`.

### Frontend Not Loading?

1. Check terminal shows: `Local: http://localhost:3000`
2. Clear browser cache: `Ctrl + Shift + R`
3. Check for errors in terminal

### API Calls Failing?

1. Verify backend is running on port 5000
2. Check proxy is working: `curl http://localhost:3000/api/health`
3. Should return: `{"status":"ok",...}`

---

## 📊 Port Summary

| Service           | Port  | URL                       |
| ----------------- | ----- | ------------------------- |
| Frontend (Vite)   | 3000  | http://localhost:3000     |
| Backend (Express) | 5000  | http://localhost:5000     |
| MongoDB           | 27017 | mongodb://localhost:27017 |

---

## ✨ What Changed from 5173 to 3000?

1. **vite.config.js** - Changed `port: 5173` → `port: 3000`
2. **server/seed.js** - Updated URLs to use port 3000
3. **.env** - Added `CLIENT_URL=http://localhost:3000`
4. **All documentation** - Updated to reference port 3000

---

## 🎯 Quick Test Checklist

After starting servers on port 3000:

- [ ] Frontend loads at http://localhost:3000
- [ ] Backend responds at http://localhost:5000/health
- [ ] Can login at http://localhost:3000/login
- [ ] QR menu loads at http://localhost:3000/t/table-X-XXX
- [ ] Can add items to cart
- [ ] Can place orders successfully
- [ ] Orders appear in staff dashboard

---

## 💡 Pro Tips

1. **Bookmark URLs:**

   - http://localhost:3000 (Frontend)
   - http://localhost:3000/login (Admin Login)
   - http://localhost:3000/restaurant/login (Restaurant Login)

2. **Use start.bat:**

   - Automatically starts both servers
   - Opens in separate windows
   - Easy to manage

3. **Check Logs:**

   - Frontend terminal shows Vite logs
   - Backend terminal shows API requests
   - Look for errors in both

4. **Clear Cache:**
   - If changes don't appear, clear browser cache
   - Press `Ctrl + Shift + R` for hard refresh

---

**Your system is now running on port 3000!** 🎉

Just restart the frontend server and access the application at http://localhost:3000
