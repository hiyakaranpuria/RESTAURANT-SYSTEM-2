# QR Code Testing Guide

## ✅ Issue Fixed!

The QR menu page was stuck on "Loading..." because the backend API endpoint `/api/restaurant/qr/:qrSlug` was missing. This has now been added.

---

## 🔄 What Was Fixed:

1. **Added Missing API Endpoint** - Created `/api/restaurant/qr/:qrSlug` in `server/routes/restaurant.js`
2. **Updated Seed Script** - Fixed the sample QR URL to use correct route `/t/` instead of `/m/`
3. **Clarified Routes** - Documented the difference between the two menu access methods

---

## 📱 Two Ways to Access Menu:

### Method 1: QR Code (Table-Based) ✨ Recommended

**Route:** `/t/:qrSlug`

- Scans QR code from physical table
- Automatically knows table number
- No need to enter table manually
- Best for dine-in customers

**Example URLs:**

```
http://localhost:5173/t/table-1-1761675835906
http://localhost:5173/t/table-2-1761675835906
http://localhost:5173/t/table-5-1761675835906
```

### Method 2: Direct Menu (Restaurant-Based)

**Route:** `/m/:restaurantId`

- Direct access to restaurant menu
- Requires manual table number entry
- Good for browsing without QR code
- Useful for takeout/delivery

**Example URL:**

```
http://localhost:5173/m/69010a3b36283e57ddfb3f02
```

---

## 🧪 How to Test:

### Step 1: Restart Backend Server

The backend code was updated, so you need to restart it:

1. Close the backend PowerShell window (or press Ctrl+C)
2. Restart with: `npm run server`

OR just run `start.bat` again to restart both servers.

### Step 2: Get Fresh QR URLs

Run the seed script again to get new QR codes with correct URLs:

```bash
npm run seed
```

This will output something like:

```
Sample QR URL (Table-based): http://localhost:5173/t/table-1-XXXXXXXXXX
Direct Menu URL (Restaurant-based): http://localhost:5173/m/RESTAURANT_ID
```

### Step 3: Test QR Menu

1. Copy the "Sample QR URL (Table-based)" from the seed output
2. Paste it in your browser
3. You should see the menu load immediately (no table number prompt)
4. Browse items and add to cart
5. Click "Cart" to view your items
6. Click "Proceed to Checkout" to place order

### Step 4: Test Direct Menu

1. Copy the "Direct Menu URL (Restaurant-based)" from the seed output
2. Paste it in your browser
3. Enter a table number when prompted
4. Browse and order as normal

---

## 🎯 Expected Behavior:

### QR Menu Page (`/t/:qrSlug`):

✅ Loads immediately without table prompt
✅ Shows restaurant name and table number in header
✅ Displays all menu items
✅ Can add items to cart
✅ Can customize items (if enabled)
✅ Can proceed to checkout
✅ Can view order history

### Direct Menu Page (`/m/:restaurantId`):

✅ Shows table number input modal first
✅ After entering table, works same as QR menu
✅ Table number saved in session

---

## 🐛 Troubleshooting:

### Still seeing "Loading..."?

1. **Check backend is running** - Look for "Server running on port 5000"
2. **Check for errors** - Look at backend console for error messages
3. **Clear browser cache** - Press Ctrl+Shift+R to hard refresh
4. **Check URL format** - Make sure using `/t/` not `/m/` for QR codes

### "Invalid QR code" error?

- The QR slug doesn't exist in database
- Run `npm run seed` to create fresh tables with QR codes
- Use the exact URL from seed output

### Can't place order?

- Make sure you've added items to cart
- Check that table number is set (shown in header)
- Look for error messages in browser console (F12)

### Backend errors?

- Check MongoDB is running: `Get-Service MongoDB`
- Check .env file has correct MONGODB_URI
- Restart backend server

---

## 📊 Database Info:

After running seed script, you'll have:

- **1 Demo Restaurant** with ID shown in output
- **8 Tables** with unique QR slugs
- **5 Categories** (Appetizers, Mains, Desserts, Drinks, Specials)
- **10 Menu Items** with sample data
- **4 Test Users** (admin, staff, customer, restaurant owner)

---

## 🔗 Quick Links:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Admin Login:** http://localhost:5173/login
- **Restaurant Login:** http://localhost:5173/restaurant/login

---

## 💡 Pro Tips:

1. **Generate Real QR Codes** - Login as restaurant owner and go to QR Management
2. **Print QR Codes** - Each table can have its own printable QR code
3. **Test on Mobile** - QR codes work best when scanned from phone
4. **Multiple Tables** - Each QR code is unique per table
5. **Order Tracking** - Orders show table number for kitchen staff

---

**The QR menu should now work perfectly!** 🎉

If you still have issues, check the backend console for error messages and make sure the server was restarted after the code changes.
