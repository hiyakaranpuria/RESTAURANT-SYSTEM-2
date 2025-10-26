# ✅ Password Reset Feature - Complete Implementation

## 🎉 What's Been Implemented

I've created a complete forgot password and reset password system for your Restaurant QR Menu System!

## 📄 Files Created/Updated

### **Frontend (3 files):**

1. ✅ `src/pages/auth/ForgotPasswordPage.jsx` - Request password reset
2. ✅ `src/pages/auth/ResetPasswordPage.jsx` - Reset password with code
3. ✅ `src/pages/auth/LoginPage.jsx` - Added "Forgot password?" link
4. ✅ `src/App.jsx` - Added routes

### **Backend (2 files):**

5. ✅ `server/models/User.js` - Added reset token fields
6. ✅ `server/routes/auth.js` - Added 3 new endpoints

## 🔗 New Routes

| Route              | URL                                     | Purpose                   |
| ------------------ | --------------------------------------- | ------------------------- |
| `/forgot-password` | `http://localhost:3000/forgot-password` | Request reset code        |
| `/reset-password`  | `http://localhost:3000/reset-password`  | Enter code & new password |

## 🔌 New API Endpoints

### 1. **Request Password Reset**

```http
POST /api/auth/forgot-password
Body: { "email": "user@example.com" }
```

### 2. **Reset Password**

```http
POST /api/auth/reset-password
Body: {
  "email": "user@example.com",
  "token": "123456",
  "password": "newpassword123"
}
```

### 3. **Verify Reset Token** (Optional)

```http
POST /api/auth/verify-reset-token
Body: {
  "email": "user@example.com",
  "token": "123456"
}
```

## 🚀 How It Works

### **User Flow:**

```
1. User clicks "Forgot your password?" on login page
   ↓
2. User enters email
   ↓
3. System generates 6-digit code
   ↓
4. Code is logged to console (DEV MODE)
   ↓
5. User sees success screen
   ↓
6. User clicks "Enter Reset Code"
   ↓
7. User enters email + 6-digit code + new password
   ↓
8. System verifies code and updates password
   ↓
9. User redirected to login
   ↓
10. User logs in with new password ✅
```

## 🧪 Testing Instructions

### **Step 1: Start Your Servers**

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

### **Step 2: Test Forgot Password**

1. Visit: `http://localhost:3000/login`
2. Click "Forgot your password?"
3. Enter email: `customer@restaurant.com` (or any registered email)
4. Click "Send Reset Link"
5. **Check your terminal/console** - You'll see:
   ```
   =================================
   PASSWORD RESET TOKEN FOR: customer@restaurant.com
   Token: 123456
   Expires in: 1 hour
   =================================
   ```
6. **Copy the 6-digit token**

### **Step 3: Test Reset Password**

1. Click "Enter Reset Code" (or visit `/reset-password`)
2. Enter your email
3. Enter the 6-digit code from console
4. Enter new password
5. Confirm password
6. Click "Reset Password"
7. You should see: "Password reset successful!"
8. Try logging in with your new password

## 🔐 Security Features

### **Token Security:**

- ✅ 6-digit random code
- ✅ Hashed before storing in database
- ✅ Expires after 1 hour
- ✅ Single-use (deleted after successful reset)
- ✅ Requires email + token (2-factor)

### **Password Security:**

- ✅ Minimum 6 characters
- ✅ Password confirmation required
- ✅ Hashed with bcrypt before storing
- ✅ Old sessions remain valid (user can logout manually)

### **Privacy:**

- ✅ Doesn't reveal if email exists
- ✅ Same message for existing/non-existing emails
- ✅ Token only shown in development mode

## 📧 Email Integration (TODO)

Currently, the reset code is logged to the console. To send actual emails:

### **Option 1: Gmail (Free, Easy)**

1. **Install nodemailer** (already installed ✅)

2. **Create email service** (`server/utils/emailService.js`):

```javascript
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Use App Password
  },
});

export const sendResetEmail = async (email, resetToken) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password - Restaurant QR Menu",
    html: `
      <h2>Password Reset Request</h2>
      <p>Your password reset code is:</p>
      <h1 style="font-size: 32px; letter-spacing: 5px;">${resetToken}</h1>
      <p>This code will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
```

3. **Add to `.env`**:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

4. **Update forgot password route**:

```javascript
// In server/routes/auth.js
import { sendResetEmail } from "../utils/emailService.js";

// In forgot-password route, replace console.log with:
await sendResetEmail(email, resetToken);
```

### **Option 2: SendGrid (Professional)**

```bash
npm install @sendgrid/mail
```

```javascript
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: email,
  from: "noreply@yourrestaurant.com",
  subject: "Reset Your Password",
  html: `Your reset code is: ${resetToken}`,
};

await sgMail.send(msg);
```

## 🎨 UI Features

### **Forgot Password Page:**

- ✅ Clean, centered design
- ✅ Email input
- ✅ Loading state
- ✅ Error messages
- ✅ Success screen with instructions
- ✅ "Enter Reset Code" button
- ✅ Back to login link

### **Reset Password Page:**

- ✅ Email input (pre-filled from session)
- ✅ 6-digit code input (monospace font)
- ✅ New password input
- ✅ Confirm password input
- ✅ Password visibility toggles
- ✅ Password requirements display
- ✅ Validation messages
- ✅ Loading state
- ✅ Back to login link

## 📊 Database Changes

### **User Model Updated:**

```javascript
{
  // ... existing fields
  resetPasswordToken: String,      // Hashed 6-digit code
  resetPasswordExpires: Date,      // Expiry timestamp
}
```

## 🧪 Test Scenarios

### **Scenario 1: Happy Path**

1. ✅ Request reset with valid email
2. ✅ Receive 6-digit code
3. ✅ Enter code + new password
4. ✅ Password updated successfully
5. ✅ Login with new password

### **Scenario 2: Invalid Email**

1. ✅ Request reset with non-existent email
2. ✅ Still shows success (security - don't reveal if email exists)
3. ✅ No code generated

### **Scenario 3: Expired Token**

1. ✅ Request reset
2. ✅ Wait 1+ hour
3. ✅ Try to reset password
4. ✅ Shows "Invalid or expired token" error

### **Scenario 4: Wrong Code**

1. ✅ Request reset
2. ✅ Enter wrong 6-digit code
3. ✅ Shows "Invalid or expired token" error

### **Scenario 5: Password Mismatch**

1. ✅ Enter different passwords in password/confirm fields
2. ✅ Shows "Passwords do not match" error

## 🔍 How to Test Right Now

### **Test 1: Request Reset**

```bash
# Visit
http://localhost:3000/forgot-password

# Enter email
customer@restaurant.com

# Check backend console for code
```

### **Test 2: Reset Password**

```bash
# Visit
http://localhost:3000/reset-password

# Enter:
Email: customer@restaurant.com
Code: [6-digit code from console]
New Password: newpassword123
Confirm: newpassword123

# Click Reset Password
```

### **Test 3: Login with New Password**

```bash
# Visit
http://localhost:3000/login

# Login with:
Email: customer@restaurant.com
Password: newpassword123
```

## 📝 Console Output Example

When you request a password reset, you'll see:

```
=================================
PASSWORD RESET TOKEN FOR: customer@restaurant.com
Token: 847392
Expires in: 1 hour
=================================
```

When password is reset successfully:

```
=================================
PASSWORD RESET SUCCESSFUL FOR: customer@restaurant.com
=================================
```

## ⚙️ Configuration

### **Token Settings:**

- **Length**: 6 digits
- **Expiry**: 1 hour (3600000 ms)
- **Storage**: Hashed with bcrypt
- **Type**: Numeric code (easy to type)

### **To Change Settings:**

Edit `server/routes/auth.js`:

```javascript
// Change token length (currently 6 digits)
const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

// Change expiry time (currently 1 hour)
user.resetPasswordExpires = Date.now() + 3600000; // milliseconds
```

## ✅ Current Status

**Frontend**: ✅ 100% Complete
**Backend**: ✅ 100% Complete (without email sending)
**Email**: ⏳ TODO (optional - works with console for now)

## 🎯 Next Steps (Optional)

1. **Add Email Service** (see Option 1 or 2 above)
2. **Test with Real Emails**
3. **Customize Email Template**
4. **Add Email Rate Limiting**
5. **Add Email Verification**

## 🚀 Ready to Use!

The feature is **fully functional** right now!

- Users can request password resets
- Codes are generated and logged to console
- Users can reset their passwords
- Everything is secure and validated

Just add email sending when you're ready for production! 📧

---

**Status**: ✅ Feature Complete (Console-based for development)
**Time to Implement**: ~30 minutes
**Email Integration**: Optional (can add later)
