# Restaurant ID Format Fix

## Problem
Error: "Invalid restaurant ID format" when trying to generate QR codes.

## Root Cause
The `/api/auth/me` endpoint returns restaurant data in this format:
```javascript
{
  restaurant: {
    _id: "64f7b1234567890abcdef123",
    restaurantName: "My Restaurant",
    // ... other fields
  },
  type: "restaurant"
}
```

But the frontend was expecting the restaurant data directly and using `data` instead of `data.restaurant`, which caused `restaurantInfo._id` to be undefined or in wrong format.

## Solution Applied

### Frontend Fix
Updated both QRGenerationPage and QRManagementPage to properly extract restaurant data:

```javascript
// Before (incorrect)
const { data } = await axios.get("/api/auth/me");
setRestaurantInfo(data); // data doesn't have _id directly

// After (correct)
const { data } = await axios.get("/api/auth/me");
const restaurantData = data.restaurant || data; // Extract restaurant object
setRestaurantInfo(restaurantData); // Now has proper _id
```

### Backend Enhancement
Added detailed debugging to show exactly what restaurant ID is being received:

```javascript
console.log("Received restaurant ID:", restaurantId);
console.log("Restaurant ID type:", typeof restaurantId);
console.log("Restaurant ID length:", restaurantId?.length);
```

## Files Modified
1. **QRGenerationPage.jsx** - Fixed restaurant data extraction
2. **QRManagementPage.jsx** - Fixed restaurant data extraction  
3. **server/routes/tables.js** - Added debugging for restaurant ID validation

## Expected Behavior Now

### Frontend Console Logs
```
Auth me response: {restaurant: {...}, type: "restaurant"}
Restaurant info loaded: {_id: "64f7b1234567890abcdef123", restaurantName: "..."}
Generating tables for restaurant: 64f7b1234567890abcdef123
Restaurant ID type: string
Restaurant ID length: 24
```

### Backend Console Logs
```
Received restaurant ID: 64f7b1234567890abcdef123
Restaurant ID type: string
Restaurant ID length: 24
Generating 10 tables for restaurant 64f7b1234567890abcdef123
```

## Testing Steps

1. **Go to QR Generation Page**: `http://localhost:3000/restaurant/generate-qr`
2. **Check Browser Console**: Should see proper restaurant info loaded
3. **Enter Number of Tables**: e.g., 10
4. **Click Generate**: Should work without "Invalid restaurant ID format" error
5. **Check Server Console**: Should see successful generation logs

## Why This Happened

The issue occurred because:
1. The `/api/auth/me` endpoint wraps restaurant data in a `restaurant` property
2. The frontend was using the wrapper object instead of the actual restaurant data
3. This caused `restaurantInfo._id` to be undefined
4. The backend validation rejected the undefined/invalid restaurant ID

## Prevention

To prevent this in the future:
- Always check the structure of API responses
- Use proper data extraction: `data.restaurant || data`
- Add console logging to verify data structure
- Test with actual API responses, not mock data

This fix ensures that the correct restaurant ID (24-character MongoDB ObjectId) is sent to the API for QR code generation.