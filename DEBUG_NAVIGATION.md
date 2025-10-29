# Debug Navigation Issue

## 🔍 How to Debug:

### Step 1: Restart Frontend Server

**IMPORTANT:** The code was updated, so you MUST restart:

```bash
# Close the frontend terminal (Ctrl+C)
# Then restart:
npm run dev
```

### Step 2: Clear Browser Data

Open browser console (F12) and run:

```javascript
// Clear all session storage
sessionStorage.clear();

// Reload page
location.reload();
```

### Step 3: Test QR Flow with Console Open

1. **Open Browser Console (F12)**

   - Go to Console tab
   - Keep it open during testing

2. **Visit QR Menu:**

   ```
   http://localhost:3000/t/11ff5b52fab7a1afceb8d6e0f6adbd9f
   ```

3. **Check Console Output:**
   You should see:

   ```
   🎯 QR Menu Entry Point Set:
     - Entry Point: qr
     - QR Slug: 11ff5b52fab7a1afceb8d6e0f6adbd9f
     - Table Number: Table X
     - Restaurant ID: 6901c6cb70b8c5228169d12a
   ```

4. **Verify SessionStorage:**
   In console, run:

   ```javascript
   console.log("Entry Point:", sessionStorage.getItem("entryPoint"));
   console.log("QR Slug:", sessionStorage.getItem("qrSlug"));
   console.log("Restaurant ID:", sessionStorage.getItem("restaurantId"));
   console.log("Table Number:", sessionStorage.getItem("tableNumber"));
   ```

   Should show:

   ```
   Entry Point: qr
   QR Slug: 11ff5b52fab7a1afceb8d6e0f6adbd9f
   Restaurant ID: 6901c6cb70b8c5228169d12a
   Table Number: Table X
   ```

5. **Add Items to Cart**

6. **Go to Checkout**

7. **Click Back Button**

   Console should show:

   ```
   🔙 Back button clicked
   Entry Point: qr
   QR Slug: 11ff5b52fab7a1afceb8d6e0f6adbd9f
   Restaurant ID: 6901c6cb70b8c5228169d12a
   ✅ Navigating to QR menu: /t/11ff5b52fab7a1afceb8d6e0f6adbd9f
   ```

8. **Verify URL:**
   Should navigate to: `http://localhost:3000/t/11ff5b52fab7a1afceb8d6e0f6adbd9f`

---

## 🐛 If Still Not Working:

### Check 1: Frontend Server Restarted?

```bash
# Make sure you see this in terminal:
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

### Check 2: Browser Cache Cleared?

- Press `Ctrl + Shift + R` (hard refresh)
- Or clear cache in DevTools (F12 → Network tab → Disable cache checkbox)

### Check 3: SessionStorage Values

Run in console:

```javascript
// Check all session storage
for (let i = 0; i < sessionStorage.length; i++) {
  const key = sessionStorage.key(i);
  console.log(key, "=", sessionStorage.getItem(key));
}
```

Expected output:

```
entryPoint = qr
qrSlug = 11ff5b52fab7a1afceb8d6e0f6adbd9f
restaurantId = 6901c6cb70b8c5228169d12a
tableNumber = Table X
```

### Check 4: Code Actually Updated?

Check the CheckoutPage.jsx file has the debug logs:

```javascript
console.log("🔙 Back button clicked");
console.log("Entry Point:", entryPoint);
```

If not, the file wasn't saved or server wasn't restarted.

---

## 🔧 Manual Fix (If Needed):

If the automatic fix isn't working, you can manually test by running this in console:

### On QR Menu Page:

```javascript
// Manually set entry point
sessionStorage.setItem("entryPoint", "qr");
sessionStorage.setItem("qrSlug", "11ff5b52fab7a1afceb8d6e0f6adbd9f");
console.log("✅ Entry point manually set");
```

### On Checkout Page (Before Clicking Back):

```javascript
// Check values
console.log("Entry Point:", sessionStorage.getItem("entryPoint"));
console.log("QR Slug:", sessionStorage.getItem("qrSlug"));

// If values are correct, back button should work
```

---

## 📊 Expected Flow:

```
1. User visits: /t/11ff5b52fab7a1afceb8d6e0f6adbd9f
   ↓
2. QRMenuPage sets:
   - entryPoint = "qr"
   - qrSlug = "11ff5b52fab7a1afceb8d6e0f6adbd9f"
   ↓
3. User adds items and goes to checkout
   ↓
4. CheckoutPage reads:
   - entryPoint = "qr"
   - qrSlug = "11ff5b52fab7a1afceb8d6e0f6adbd9f"
   ↓
5. User clicks back button
   ↓
6. CheckoutPage navigates to: /t/11ff5b52fab7a1afceb8d6e0f6adbd9f
   ✅ CORRECT!
```

---

## 🎯 Quick Test Script:

Run this in browser console on the QR menu page:

```javascript
// Test script
(function () {
  console.log("=== Navigation Debug Test ===");

  // Check current URL
  console.log("Current URL:", window.location.href);

  // Check sessionStorage
  const entryPoint = sessionStorage.getItem("entryPoint");
  const qrSlug = sessionStorage.getItem("qrSlug");
  const restaurantId = sessionStorage.getItem("restaurantId");

  console.log("Entry Point:", entryPoint);
  console.log("QR Slug:", qrSlug);
  console.log("Restaurant ID:", restaurantId);

  // Determine where back button should go
  if (entryPoint === "qr" && qrSlug) {
    console.log("✅ Back button should go to:", `/t/${qrSlug}`);
  } else {
    console.log("❌ Back button will go to:", `/m/${restaurantId}`);
    console.log("⚠️ This is WRONG if you entered via QR!");
  }

  console.log("=== End Test ===");
})();
```

---

## 💡 Common Issues:

### Issue: entryPoint is null

**Cause:** Frontend server not restarted or code not saved
**Fix:** Restart frontend server

### Issue: qrSlug is null

**Cause:** Not accessing via QR route or sessionStorage cleared
**Fix:** Make sure URL is `/t/:qrSlug` not `/m/:restaurantId`

### Issue: Still going to /m/ route

**Cause:** Old JavaScript cached in browser
**Fix:** Hard refresh (Ctrl+Shift+R) or clear browser cache

### Issue: Console logs not showing

**Cause:** Code not updated or server not restarted
**Fix:**

1. Check file was saved
2. Restart frontend: `npm run dev`
3. Hard refresh browser

---

## ✅ Success Indicators:

When working correctly, you should see:

1. **On QR Menu Load:**

   ```
   🎯 QR Menu Entry Point Set:
     - Entry Point: qr
     - QR Slug: 11ff5b52fab7a1afceb8d6e0f6adbd9f
   ```

2. **On Back Button Click:**

   ```
   🔙 Back button clicked
   Entry Point: qr
   QR Slug: 11ff5b52fab7a1afceb8d6e0f6adbd9f
   ✅ Navigating to QR menu: /t/11ff5b52fab7a1afceb8d6e0f6adbd9f
   ```

3. **URL Changes To:**
   ```
   http://localhost:3000/t/11ff5b52fab7a1afceb8d6e0f6adbd9f
   ```

---

**Follow these steps carefully and the navigation should work!** 🎉
