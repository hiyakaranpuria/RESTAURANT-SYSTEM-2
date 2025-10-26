# Server Diagnostic Guide

## Common Issues That Prevent Server Startup

### 1. **MongoDB Connection Issues**
**Most Common Cause**: MongoDB service not running

**Symptoms:**
- Server starts but crashes immediately
- Error: "ECONNREFUSED" or "MongoNetworkError"

**Solutions:**
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Test MongoDB Connection:**
```bash
node db-test.js
```

### 2. **Missing Dependencies**
**Symptoms:**
- Error: "Cannot find module"
- Import/require errors

**Solutions:**
```bash
npm install
# or
npm ci
```

### 3. **Port Already in Use**
**Symptoms:**
- Error: "EADDRINUSE" or "Port 5000 is already in use"

**Solutions:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or change port in .env file
PORT=5001
```

### 4. **Environment Variables**
**Check .env file exists and contains:**
```
MONGODB_URI=mongodb://localhost:27017/restaurant-qr-menu
JWT_SECRET=my-super-secret-key-for-jwt-12345
JWT_REFRESH_SECRET=another-different-random-key-for-refresh-98765
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 5. **Node.js Version Compatibility**
**Required:** Node.js 16+ (for ES modules support)

**Check version:**
```bash
node --version
```

### 6. **File Import/Export Issues**
**Test imports:**
```bash
node server-test.js
```

## Diagnostic Steps

### Step 1: Check Basic Setup
```bash
# 1. Check Node.js version
node --version

# 2. Check if dependencies are installed
ls node_modules

# 3. Check if .env file exists
ls -la | grep .env
```

### Step 2: Test Database Connection
```bash
node db-test.js
```

### Step 3: Test Module Imports
```bash
node server-test.js
```

### Step 4: Check Port Availability
```bash
# Windows
netstat -ano | findstr :5000

# Mac/Linux
lsof -i :5000
```

### Step 5: Try Starting Server with Debug
```bash
# Add debug logging
NODE_ENV=development npm run server

# Or with more verbose logging
DEBUG=* npm run server
```

## Common Error Messages & Solutions

### "Cannot find module"
- Run `npm install`
- Check if file paths are correct
- Ensure all imports use `.js` extension

### "ECONNREFUSED 127.0.0.1:27017"
- Start MongoDB service
- Check MongoDB URI in .env
- Verify MongoDB is installed

### "EADDRINUSE :::5000"
- Change PORT in .env file
- Kill process using port 5000
- Use different port number

### "SyntaxError: Cannot use import statement"
- Ensure `"type": "module"` in package.json
- Use Node.js 16+
- Check file extensions are `.js`

### "ValidationError" or "CastError"
- Check database schema
- Verify data types match model
- Check for required fields

## Manual Server Start (Alternative)

If npm script fails, try direct node command:
```bash
# Navigate to project directory
cd new/RESTAURANT-QR-MENU-SYSTEM

# Start server directly
node server/index.js
```

## Quick Health Check

Once server starts, test these endpoints:
```bash
# Health check
curl http://localhost:5000/health

# API test
curl http://localhost:5000/api/feedback/debug
```

## Server Logs to Watch For

**Successful startup should show:**
```
MongoDB connected
Server running on port 5000
Environment: development
```

**Error indicators:**
- MongoDB connection errors
- Port binding errors
- Module import errors
- Validation errors

## Emergency Restart Steps

1. **Kill all Node processes:**
   ```bash
   # Windows
   taskkill /f /im node.exe
   
   # Mac/Linux
   killall node
   ```

2. **Restart MongoDB:**
   ```bash
   # Windows
   net stop MongoDB
   net start MongoDB
   
   # Mac
   brew services restart mongodb-community
   
   # Linux
   sudo systemctl restart mongod
   ```

3. **Clean install:**
   ```bash
   rm -rf node_modules
   npm install
   ```

4. **Start server:**
   ```bash
   npm run server
   ```

## Contact Points

If server still won't start:
1. Check the exact error message
2. Run diagnostic tests (db-test.js, server-test.js)
3. Verify all prerequisites are met
4. Check system resources (disk space, memory)
5. Try alternative port numbers