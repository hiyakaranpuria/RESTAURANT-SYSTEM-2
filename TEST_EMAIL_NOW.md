# 🧪 Test Email Feature Right Now!

## Option 1: Test Without Email Setup (Instant)

Just restart your server and test - codes will appear in console!

```bash
npm run dev
```

Then visit: http://localhost:3000/forgot-password

---

## Option 2: Test With Real Emails (2 Minutes)

### Step 1: Get Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Copy the 16-character password

### Step 2: Edit .env File

Open `.env` and update these lines:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

### Step 3: Restart Server

```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

### Step 4: Test!

1. Visit: http://localhost:3000/forgot-password
2. Enter: customer@restaurant.com
3. Check your email inbox! 📬

---

## 🎯 What You'll See

### In Console (Always):

```
=================================
📧 EMAIL NOT CONFIGURED - DEVELOPMENT MODE
PASSWORD RESET TOKEN FOR: customer@restaurant.com
Token: 847392
Expires in: 1 hour
=================================
```

### In Email (If Configured):

```
Subject: Reset Your Password

Hi Customer,

We received a request to reset your password.
Use the code below to reset your password:

┌─────────────────┐
│   847392        │
└─────────────────┘

This code will expire in 1 hour.
```

---

## ✅ Complete Test Flow

1. **Request Reset**

   - Go to: http://localhost:3000/forgot-password
   - Enter: customer@restaurant.com
   - Click "Send Reset Link"

2. **Get Code**

   - Check email OR console
   - Copy the 6-digit code

3. **Reset Password**

   - Click "Enter Reset Code"
   - Enter email: customer@restaurant.com
   - Enter code: 847392 (your code)
   - Enter new password: newpassword123
   - Click "Reset Password"

4. **Login**
   - Go to: http://localhost:3000/login
   - Email: customer@restaurant.com
   - Password: newpassword123
   - Success! 🎉

---

## 🚀 Ready to Test?

**Without email setup**: Just restart server and go!
**With email setup**: 2 minutes to configure Gmail

Either way, the feature works perfectly! 🎯
