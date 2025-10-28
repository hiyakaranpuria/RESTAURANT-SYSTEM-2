# Table Generation Debug Guide

## Current Error
"Error generating QR codes: Failed to generate tables"

## Debugging Steps

### 1. Check Server Console
When you try to generate QR codes, check the server console for:
- "Generating X tables for restaurant Y"
- "Request user:" and "Request restaurant:" logs
- Any error messages with stack traces

### 2. Test Table Model
Visit: `http://localhost:5000/api/restaurant/test`
- Should return: "Table model test successful"
- If it fails, there's an issue with the Table model

### 3. Check Authentication
In browser console, verify:
```javascript
// Check if restaurant token exists
localStorage.getItem('restaurant_token')

// Check if token is valid (should not be expired)
JSON.parse(atob(localStorage.getItem('restaurant_token').split('.')[1]))
```

### 4. Check Database Connection
Server console should show:
- "MongoDB connected" on startup
- No database connection errors

### 5. Check Restaurant ID Format
The restaurant ID should be a valid MongoDB ObjectId (24 hex characters)

## Common Issues & Solutions

### Issue 1: Authentication Problems
**Symptoms**: 401 Unauthorized or authentication errors
**Solutions**:
- Re-login as restaurant user
- Check if token is expired
- Verify restaurant account exists

### Issue 2: Database Connection Issues
**Symptoms**: MongoDB connection errors
**Solutions**:
- Ensure MongoDB is running
- Check connection string in .env
- Restart MongoDB service

### Issue 3: Table Model Issues
**Symptoms**: Validation errors or model errors
**Solutions**:
- Check Table model schema
- Verify all required fields
- Check for schema conflicts

### Issue 4: Duplicate Key Errors
**Symptoms**: Error code 11000
**Solutions**:
- Clear existing tables first
- Check for unique constraint violations
- Verify qrSlug generation is unique

## Enhanced Error Messages

The backend now provides more specific error messages:
- **Validation Error**: Schema validation failed
- **Duplicate Key Error**: Tables may already exist
- **Database Error**: MongoDB operation failed
- **Invalid Restaurant ID**: Format validation failed

## Testing Commands

### Test Table Model
```bash
curl http://localhost:5000/api/restaurant/test
```

### Test QR Generation (with auth)
```bash
curl -X POST http://localhost:5000/api/restaurant/YOUR_RESTAURANT_ID/generate-tables \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"numberOfTables":2}'
```

## Expected Server Logs

### Successful Generation
```
Generating 10 tables for restaurant 64f7b1234567890abcdef123
Request user: { _id: '...', email: '...', role: 'restaurant' }
Request restaurant: { _id: '...', restaurantName: '...' }
Deleting existing tables for restaurant 64f7b1234567890abcdef123
Deleted 0 existing tables
Successfully created 10 tables for restaurant 64f7b1234567890abcdef123
```

### Error Scenarios
```
Error generating tables: ValidationError: ...
Error details: { name: 'ValidationError', message: '...', ... }
```

## Next Steps

1. **Try generating QR codes** and check server console
2. **Note the exact error message** from server logs
3. **Test the table model** using the test endpoint
4. **Verify authentication** using browser console
5. **Check database connection** in server logs

The enhanced error handling should now provide much more specific information about what's going wrong.