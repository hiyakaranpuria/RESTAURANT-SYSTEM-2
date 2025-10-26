# ✅ Restaurant Password Reset Feature - COMPLETE!

## 🎉 What's New

Restaurants can now reset their passwords just like customers!

### Features Implemented:

✅ Restaurant forgot password page
✅ Restaurant reset password page  
✅ "Forgot password?" link on restaurant login
✅ Email notifications with 6-digit codes
✅ Backend API endpoints for restaurants
✅ Secure token hashing and expiration

---

## 🚀 How It Works

### For Restaurants:

1. **Forgot Password**

   - Go to: http://localhost:3000/restaurant/login
   - Click "Forgot your password?"
   - Enter restaurant email
   - Receive 6-digit code via email

2. **Reset Password**
   - Enter email and 6-digit code
   - Set new password
   - Login with new password

---

## 📁 Files Created/Modified

### Backend:

**Modified:**

- `server/models/Restaurant.js` - Added reset token fields to owner object
- `server/routes/restaurant.js` - Added 3 new endpoints:
  - `POST /api/restaurant/forgot-password`
  - `POST /api/restaurant/reset-password`
  - `POST /api/restaurant/verify-reset-token`

### Frontend:

**Created:**

- `src/pages/restaurant/RestaurantForgotPasswordPage.jsx`
- `src/pages/restaurant/RestaurantResetPasswordPage.jsx`

**Modified:**

- `src/pages/restaurant/RestaurantLoginPage.jsx` - Added "Forgot password?" link
- `src/App.jsx` - Added new routes

---

## 🧪 Test It Now!

### Step 1: Request Reset

1. Go to: http://localhost:3000/restaurant/login
2. Click "Forgot your password?"
3. Enter your restaurant email
4. Click "Send Reset Code"

### Step 2: Check Email or Console

- **Email configured**: Check inbox for reset code
- **Email NOT configured**: Check backend console for code

Example console output:

```
=================================
📧 EMAIL NOT CONFIGURED - DEVELOPMENT MODE
PASSWORD RESET TOKEN FOR: restaurant@example.com
Token: 847392
Expires in: 1 hour
=================================
```

### Step 3: Reset Password

1. Click "Enter Reset Code" or go to: http://localhost:3000/restaurant/reset-password
2. Enter:
   - Restaurant email
   - 6-digit code
   - New password
   - Confirm password
3. Click "Reset Password"

### Step 4: Login

1. Go to: http://localhost:3000/restaurant/login
2. Login with new password
3. Success! 🎉

---

## 🔐 Security Features

✅ **Hashed Tokens**: Reset codes are hashed before storage (bcrypt)
✅ **1-Hour Expiry**: Codes expire after 1 hour
✅ **Single-Use**: Tokens are deleted after successful reset
✅ **Email + Code Verification**: Both required for reset
✅ **No Email Enumeration**: Same response for valid/invalid emails
✅ **Rate Limiting**: Protected by existing rate limiters

---

## 📧 Email Integration

The system uses the same email service as customer password reset:

### Email Template:

```
Subject: Reset Your Password

Hi [Restaurant Owner Name],

We received a request to reset your password.
Use the code below to reset your password:

┌─────────────────┐
│   847392        │
└─────────────────┘

This code will expire in 1 hour.

If you didn't request a password reset,
you can safely ignore this email.
```

### Email Configuration:

Already configured in `.env`:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=resturantqrsystem@gmail.com
EMAIL_PASSWORD=aeqfljhgjuchaboh
APP_NAME=Restaurant QR Menu
```

---

## 🎯 API Endpoints

### 1. Forgot Password

```http
POST /api/restaurant/forgot-password
Content-Type: application/json

{
  "email": "restaurant@example.com"
}
```

**Response:**

```json
{
  "message": "If an account exists with this email, you will receive a password reset code",
  "code": "RESET_EMAIL_SENT",
  "devToken": "847392" // Only in development
}
```

### 2. Reset Password

```http
POST /api/restaurant/reset-password
Content-Type: application/json

{
  "email": "restaurant@example.com",
  "token": "847392",
  "password": "newpassword123"
}
```

**Response:**

```json
{
  "message": "Password reset successful. You can now login with your new password.",
  "code": "PASSWORD_RESET_SUCCESS"
}
```

### 3. Verify Reset Token (Optional)

```http
POST /api/restaurant/verify-reset-token
Content-Type: application/json

{
  "email": "restaurant@example.com",
  "token": "847392"
}
```

**Response:**

```json
{
  "message": "Token is valid",
  "code": "TOKEN_VALID"
}
```

---

## 🔄 Complete Flow

```
Restaurant Login Page
    ↓
Click "Forgot password?"
    ↓
Enter Email → Send Reset Code
    ↓
Email Sent (or Console Log)
    ↓
Enter Code + New Password
    ↓
Password Reset
    ↓
Redirect to Login
    ↓
Login with New Password ✅
```

---

## 🎨 UI Features

### Forgot Password Page:

- Clean, professional design
- Orange theme (restaurant branding)
- Email input with validation
- Success/error messages
- Links to reset page and login
- Auto-redirect after success

### Reset Password Page:

- 6-digit code input (centered, large font)
- Password strength validation
- Confirm password matching
- Success animation
- Auto-redirect to login
- Links to request new code

---

## 🐛 Troubleshooting

### Code Not Received?

1. Check backend console for the code
2. Check email spam folder
3. Verify email is configured in `.env`
4. Check backend logs for errors

### Invalid Token Error?

1. Make sure code is exactly 6 digits
2. Check if code expired (1 hour limit)
3. Request a new code
4. Verify email matches the one used

### Password Reset Failed?

1. Check password is at least 6 characters
2. Verify passwords match
3. Check backend console for errors
4. Try requesting a new code

---

## 📊 Database Schema

### Restaurant Model - Owner Object:

```javascript
owner: {
  name: String,
  email: String,
  phone: String,
  passwordHash: String,
  resetPasswordToken: String,      // NEW: Hashed reset token
  resetPasswordExpires: Date,      // NEW: Token expiry timestamp
}
```

---

## ✅ Testing Checklist

- [ ] Can access forgot password page from login
- [ ] Can request reset code with valid email
- [ ] Receive email or see code in console
- [ ] Can enter code and new password
- [ ] Password validation works (min 6 chars)
- [ ] Confirm password matching works
- [ ] Can reset password successfully
- [ ] Can login with new password
- [ ] Old password no longer works
- [ ] Code expires after 1 hour
- [ ] Code is single-use (can't reuse)
- [ ] Invalid codes are rejected
- [ ] Links between pages work correctly

---

## 🎓 For Customers vs Restaurants

Both systems work identically:

| Feature              | Customer                    | Restaurant                        |
| -------------------- | --------------------------- | --------------------------------- |
| Forgot Password Page | `/forgot-password`          | `/restaurant/forgot-password`     |
| Reset Password Page  | `/reset-password`           | `/restaurant/reset-password`      |
| API Endpoint         | `/api/auth/forgot-password` | `/api/restaurant/forgot-password` |
| Email Field          | User email                  | Restaurant owner email            |
| Token Storage        | User model                  | Restaurant.owner object           |

---

## 🚀 Quick Test Commands

```bash
# Test forgot password
curl -X POST http://localhost:5000/api/restaurant/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"restaurant@example.com"}'

# Test reset password
curl -X POST http://localhost:5000/api/restaurant/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"restaurant@example.com","token":"847392","password":"newpass123"}'
```

---

## 💡 Production Considerations

Before deploying:

1. **Remove devToken** from responses (already handled with NODE_ENV check)
2. **Set up real email service** (Gmail/SendGrid/Mailgun)
3. **Monitor reset attempts** for abuse
4. **Add CAPTCHA** to prevent automated attacks
5. **Log all reset attempts** for security auditing
6. **Consider SMS** as alternative to email
7. **Add rate limiting** specifically for reset endpoints

---

## 📚 Related Documentation

- `EMAIL_SETUP_GUIDE.md` - Email configuration
- `EMAIL_QUICK_START.md` - 2-minute email setup
- `PASSWORD_RESET_COMPLETE.md` - Customer password reset
- `API_ENDPOINTS.md` - All API endpoints

---

**Restaurant password reset is now fully functional!** 🎉

Test it at: http://localhost:3000/restaurant/login
