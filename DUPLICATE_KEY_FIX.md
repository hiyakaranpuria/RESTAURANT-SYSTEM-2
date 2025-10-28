# MongoDB Duplicate Key Error Fix

## Problem
```
E11000 duplicate key error collection: restaurant-qr-menu.customers index: sessionId_1 dup key: { sessionId: null }
```

## Root Cause
- The database has a unique index on `sessionId` field from an older version
- Multiple customer records have `sessionId: null`, violating the unique constraint
- Current Customer model doesn't properly handle the `sessionId` field

## Solution

### Step 1: Run Database Cleanup Script
```bash
node fix-customer-index.js
```

This script will:
- ✅ Remove the problematic `sessionId` unique index
- ✅ Clean up null `sessionId` fields
- ✅ Remove duplicate customer records
- ✅ Verify the fix

### Step 2: Updated Customer Model
The Customer model has been updated to:
- Add `sessionId` field as optional with `sparse: true` index
- Allow multiple null values (no unique constraint)
- Maintain backward compatibility

### Step 3: Verify Fix
After running the cleanup script, try placing an order again. The error should be resolved.

## What the Script Does

### 1. Index Management
- Identifies and removes the problematic `sessionId_1` unique index
- Preserves other necessary indexes

### 2. Data Cleanup
- Removes `sessionId: null` fields from existing records
- Eliminates duplicate customer records by email
- Maintains data integrity

### 3. Verification
- Shows before/after index comparison
- Confirms successful cleanup
- Reports any remaining issues

## Expected Output
```
Connecting to MongoDB...
✅ Connected to MongoDB

📊 Checking current indexes...
Current indexes: [
  { name: '_id_', key: { _id: 1 } },
  { name: 'sessionId_1', key: { sessionId: 1 } },
  { name: 'email_1', key: { email: 1 } }
]

🔍 Found sessionId index: sessionId_1
🗑️  Dropping sessionId index...
✅ sessionId index dropped successfully

🔍 Checking for customers with null sessionId...
Found 3 customers with null sessionId
🧹 Cleaning up null sessionId fields...
✅ Removed null sessionId fields

🔍 Checking for duplicate customers by email...
✅ No duplicate customers found

📊 Final index check...
Final indexes: [
  { name: '_id_', key: { _id: 1 } },
  { name: 'email_1', key: { email: 1 } }
]

🎉 Database cleanup completed successfully!
📡 Disconnected from MongoDB
```

## Alternative Manual Fix (if script fails)

### Using MongoDB Shell
```javascript
// Connect to MongoDB
use restaurant-qr-menu

// Drop the problematic index
db.customers.dropIndex("sessionId_1")

// Remove null sessionId fields
db.customers.updateMany(
  { sessionId: null },
  { $unset: { sessionId: "" } }
)

// Check for duplicates
db.customers.aggregate([
  { $group: { _id: "$email", count: { $sum: 1 } } },
  { $match: { count: { $gt: 1 } } }
])
```

### Using MongoDB Compass
1. Connect to your database
2. Go to `restaurant-qr-menu.customers` collection
3. Click on "Indexes" tab
4. Delete the `sessionId_1` index
5. Go back to "Documents" tab
6. Delete documents with duplicate emails (keep the most recent)

## Prevention
- The updated Customer model uses `sparse: true` for sessionId
- This allows multiple null values without unique constraint violations
- Future customer creation will not cause this error

## Testing After Fix
1. Try placing an order through the app
2. Check that customer records are created successfully
3. Verify no duplicate key errors occur
4. Test both guest and logged-in customer flows

## Rollback (if needed)
If something goes wrong, you can restore from backup:
```bash
# If you have a backup
mongorestore --db restaurant-qr-menu /path/to/backup

# Or recreate the index (not recommended)
db.customers.createIndex({ "sessionId": 1 }, { unique: true, sparse: true })
```

## Related Files Modified
- `server/models/Customer.js` - Added sessionId field with sparse index
- `fix-customer-index.js` - Database cleanup script
- This documentation file

The fix addresses both the immediate error and prevents future occurrences while maintaining backward compatibility with existing code that references sessionId.