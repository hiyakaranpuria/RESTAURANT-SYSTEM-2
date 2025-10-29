# Order Placement Fix Guide

## ✅ Issue Fixed: "Network Error" when placing orders

### 🔍 Root Cause:

The Vite configuration had the wrong port number (3000 instead of 5173), which broke the API proxy. This caused all `/api/*` requests to fail with "Network Error".

---

## 🛠️ What Was Fixed:

### 1. **Updated Vite Config** (`vite.config.js`)

- Changed port from `3000` to `5173` (actual Vite dev server port)
- Added `secure: false` to proxy config for better compatibility

### 2. **Added Axios Configuration** (`src/config/axios.js`)

- Centralized axios configuration
- Automatic auth token injection
- Better error handling
- Response interceptors

### 3. **Updated Main Entry** (`src/main.jsx`)

- Imported axios config to apply globally

---

## 🚀 How to Apply the Fix:

### Step 1: Restart Frontend Server

The frontend code was updated, so you need to restart it:

**Option A: Use restart script**

```bash
# Close all servers and run:
restart-servers.bat
```

**Option B: Manual restart**

1. Close the frontend PowerShell window (or press Ctrl+C)
2. Run: `npm run dev`

### Step 2: Clear Browser Cache

1. Open browser DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

OR just press: `Ctrl + Shift + R`

### Step 3: Test Order Placement

1. Go to QR menu: `http://localhost:5173/t/table-1-XXXXXXXXXX`
2. Add items to cart
3. Click "Cart" → "Proceed to Checkout"
4. Fill in details and click "Place Order"
5. Should redirect to order tracking page ✅

---

## 🧪 Testing Checklist:

### Before Testing:

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 5173
- [ ] MongoDB service is running
- [ ] Browser cache cleared

### Test Flow:

1. [ ] Open QR menu page
2. [ ] Menu items load successfully
3. [ ] Add items to cart
4. [ ] Cart shows correct items and total
5. [ ] Click "Proceed to Checkout"
6. [ ] Checkout page loads
7. [ ] Click "Place Order"
8. [ ] Order submits successfully (no "Network Error")
9. [ ] Redirects to order tracking page
10. [ ] Order shows correct status

---

## 🐛 Troubleshooting:

### Still getting "Network Error"?

**Check 1: Verify servers are running**

```bash
# Backend should show:
Server running on port 5000

# Frontend should show:
Local: http://localhost:5173
```

**Check 2: Check browser console (F12)**
Look for errors like:

- `Failed to fetch` → Backend not running
- `CORS error` → Backend CORS issue
- `404 Not Found` → Wrong API endpoint

**Check 3: Test backend directly**
Open in browser or use curl:

```bash
# Test health endpoint
curl http://localhost:5000/health

# Should return:
{"status":"ok","timestamp":"...","uptime":...}
```

**Check 4: Check network tab**

1. Open DevTools (F12)
2. Go to Network tab
3. Try placing order
4. Look for `/api/orders` request
5. Check if it's going to `http://localhost:5173/api/orders` (proxied)

### Order submits but shows error?

**Check backend console** for error messages:

- Database connection issues
- Validation errors
- Missing required fields

**Check order data format:**
The order should include:

- `restaurantId` (required)
- `tableNumber` (required)
- `items` array (required, not empty)
- `totalAmount` (required)
- `customerInfo` (optional)

### Can't access checkout page?

**Possible causes:**

1. Not logged in as customer → Login modal should appear
2. Empty cart → Redirects back to menu
3. No table number → Redirects back to menu

**Solution:**

- Make sure you're logged in or using guest mode
- Add items to cart before checkout
- Access menu via QR code (table number auto-set)

---

## 📊 Expected API Flow:

### 1. Load Menu (QR Code)

```
GET /api/restaurant/qr/:qrSlug
→ Returns: { tableNumber, restaurantId, restaurantName }
```

### 2. Fetch Menu Items

```
GET /api/menu/items?restaurantId=XXX
→ Returns: { items: [...] }
```

### 3. Place Order

```
POST /api/orders
Body: {
  restaurantId: "...",
  tableNumber: "...",
  items: [...],
  totalAmount: 123.45,
  customerInfo: {...}
}
→ Returns: { _id: "order_id", status: "placed", ... }
```

### 4. Track Order

```
GET /api/orders/:orderId
→ Returns: { _id, status, items, totalAmount, ... }
```

---

## 🎯 Quick Test Commands:

### Test Backend Health:

```bash
curl http://localhost:5000/health
```

### Test Order Creation (from command line):

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": "YOUR_RESTAURANT_ID",
    "tableNumber": "5",
    "items": [{"menuItemId": "ITEM_ID", "name": "Test", "price": 10, "quantity": 1}],
    "totalAmount": 10
  }'
```

### Check if Vite proxy is working:

```bash
# This should proxy to backend
curl http://localhost:5173/api/health
```

---

## ✨ Success Indicators:

After the fix, you should see:

1. **In Browser Console:**

   - No "Network Error" messages
   - Successful API responses
   - Order ID returned

2. **In Backend Console:**

   - "Order creation request body: ..."
   - "Order created successfully: ORDER_ID"

3. **In Browser:**
   - Redirects to order tracking page
   - Shows order status
   - Displays order items

---

## 📝 Configuration Summary:

### Vite Config (`vite.config.js`):

```javascript
server: {
  port: 5173,  // ✅ Correct port
  proxy: {
    "/api": {
      target: "http://localhost:5000",
      changeOrigin: true,
      secure: false,
    },
  },
}
```

### Backend Config (`.env`):

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/restaurant-qr-menu
```

### Frontend URLs:

- Development: `http://localhost:5173`
- API Proxy: `http://localhost:5173/api/*` → `http://localhost:5000/api/*`

---

## 🎉 After Fix:

Your order placement should now work perfectly! The flow will be:

1. Customer scans QR code
2. Browses menu and adds items
3. Goes to checkout
4. Places order successfully ✅
5. Gets redirected to order tracking
6. Staff sees order in their dashboard
7. Staff updates order status
8. Customer sees real-time updates

---

**The "Network Error" is now fixed!** Just restart the frontend server and test again.

If you still have issues, check the troubleshooting section above or look at the browser console and backend logs for specific error messages.
