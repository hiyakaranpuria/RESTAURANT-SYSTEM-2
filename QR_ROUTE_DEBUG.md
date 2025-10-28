# QR Route Debugging Guide

## Current Route Configuration

### Frontend Route
- **URL**: `http://localhost:3000/restaurant/generate-qr`
- **Component**: `QRGenerationPage`
- **Route Definition**: `<Route path="/restaurant/generate-qr" element={<QRGenerationPage />} />`

### Backend API Route
- **URL**: `POST /api/restaurant/:restaurantId/generate-tables`
- **File**: `server/routes/tables.js`
- **Registration**: `app.use("/api/restaurant", tableRoutes);`
- **Full Path**: `POST http://localhost:5000/api/restaurant/{restaurantId}/generate-tables`

## Debugging Steps

### 1. Check Frontend Route Loading
Open `http://localhost:3000/restaurant/generate-qr` and verify:
- [ ] Page loads without 404 error
- [ ] QRGenerationPage component renders
- [ ] Restaurant info loads (check debug section)
- [ ] No console errors in browser

### 2. Check Backend Route Registration
Verify server logs show:
```
Server running on port 5000
MongoDB connected
```

### 3. Test API Route Accessibility
Open browser Network tab and try generating QR codes:
- [ ] Request is made to correct URL
- [ ] Authentication header is included
- [ ] Response is received (not 404)

### 4. Check Authentication
Verify in browser console:
```javascript
// Check if restaurant token exists
localStorage.getItem('restaurant_token')
// Should return a JWT token
```

## Common Issues & Solutions

### Issue 1: Page Not Loading (404)
**Symptoms**: Browser shows "Page not found"
**Solution**: Check App.jsx routes
```javascript
// Should have this route:
<Route path="/restaurant/generate-qr" element={<QRGenerationPage />} />
```

### Issue 2: API Route Not Found (404)
**Symptoms**: Network tab shows 404 for API call
**Solutions**:
1. Check server/index.js has: `app.use("/api/restaurant", tableRoutes);`
2. Check server/routes/tables.js has: `router.post("/:restaurantId/generate-tables", ...)`
3. Restart server after route changes

### Issue 3: Authentication Error (401)
**Symptoms**: API returns 401 Unauthorized
**Solutions**:
1. Check if user is logged in as restaurant
2. Verify token is being sent in request headers
3. Check token expiration

### Issue 4: Restaurant Info Not Loading
**Symptoms**: "Restaurant information not loaded" error
**Solutions**:
1. Check `/api/auth/me` endpoint works
2. Verify restaurant authentication
3. Check token validity

## Manual Testing

### Test 1: Frontend Route
```
1. Go to http://localhost:3000/restaurant/login
2. Login as restaurant
3. Go to http://localhost:3000/restaurant/generate-qr
4. Should see QR generation form
```

### Test 2: API Route (using curl)
```bash
# Get restaurant token first
curl -X POST http://localhost:5000/api/auth/restaurant/login \
  -H "Content-Type: application/json" \
  -d '{"email":"restaurant@example.com","password":"password"}'

# Use token to test QR generation
curl -X POST http://localhost:5000/api/restaurant/RESTAURANT_ID/generate-tables \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"numberOfTables":2}'
```

### Test 3: Browser Console Testing
```javascript
// Test API call directly in browser console
fetch('/api/restaurant/YOUR_RESTAURANT_ID/generate-tables', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('restaurant_token')
  },
  body: JSON.stringify({numberOfTables: 2})
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

## Expected Behavior

### Successful Flow
1. **Page Load**: QRGenerationPage loads with form
2. **Restaurant Info**: Loads via `/api/auth/me`
3. **Form Interaction**: Can enter number of tables
4. **Generation**: Click button triggers API call
5. **Response**: QR codes appear below form

### Debug Output
```
// Browser Console
Generating tables for restaurant: 64f7b1234567890abcdef123
Number of tables to generate: 10
API Response: {message: "Successfully generated 10 tables", tables: [...]}
Tables received: [{_id: "...", number: "1", qrSlug: "..."}, ...]
Generated tables state set: [...]

// Server Console
Generating 10 tables for restaurant 64f7b1234567890abcdef123
Deleting existing tables for restaurant 64f7b1234567890abcdef123
Deleted 0 existing tables
Successfully created 10 tables for restaurant 64f7b1234567890abcdef123
```

## Quick Fixes

### If Routes Not Working
1. **Restart server**: `npm run server`
2. **Clear browser cache**: Hard refresh (Ctrl+Shift+R)
3. **Check server logs**: Look for startup errors

### If Authentication Issues
1. **Re-login**: Go to restaurant login page
2. **Check token**: Verify in localStorage
3. **Clear storage**: Clear localStorage and re-login

### If Still Not Working
1. **Check server is running**: `http://localhost:5000/health`
2. **Check database connection**: Look for MongoDB connected message
3. **Verify all files saved**: Ensure recent changes are saved

This debugging guide should help identify exactly where the issue is occurring.