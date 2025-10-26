# ✅ Forgot Password Feature

## 🎯 What Was Added

I've created a complete forgot password flow for your Restaurant QR Menu System!

## 📄 New Pages Created

### 1. **Forgot Password Page**

**File**: `src/pages/auth/ForgotPasswordPage.jsx`
**Route**: `/forgot-password`
**URL**: `http://localhost:3000/forgot-password`

**Features**:

- Email input form
- Sends password reset link to user's email
- Success confirmation screen
- Back to login link
- Link to signup page

### 2. **Reset Password Page**

**File**: `src/pages/auth/ResetPasswordPage.jsx`
**Route**: `/reset-password?token=xxx`
**URL**: `http://localhost:3000/reset-password?token=xxx`

**Features**:

- New password input
- Confirm password input
- Password visibility toggle
- Password requirements display
- Token validation
- Success redirect to login

## 🔗 Updated Pages

### **Login Page**

**Updated**: `src/pages/auth/LoginPage.jsx`

- Added "Forgot your password?" link
- Links to `/forgot-password`

## 🚀 User Flow

```
1. User clicks "Forgot your password?" on login page
   ↓
2. User enters email on forgot password page
   ↓
3. System sends reset link to email (TODO: Backend)
   ↓
4. User clicks link in email
   ↓
5. User lands on reset password page with token
   ↓
6. User enters new password
   ↓
7. Password is reset (TODO: Backend)
   ↓
8. User is redirected to login page
   ↓
9. User logs in with new password
```

## 🔧 Backend Implementation Needed

The frontend is ready, but you need to implement these backend endpoints:

### 1. **Forgot Password Endpoint**

```javascript
POST /api/auth/forgot-password
Body: { email: "user@example.com" }

Response:
{
  message: "Password reset email sent",
  code: "RESET_EMAIL_SENT"
}
```

**What it should do**:

1. Check if email exists in database
2. Generate a unique reset token (JWT or random string)
3. Store token with expiry (e.g., 1 hour)
4. Send email with reset link: `http://your-domain.com/reset-password?token=xxx`
5. Return success message

### 2. **Reset Password Endpoint**

```javascript
POST /api/auth/reset-password
Body: {
  token: "reset_token_here",
  password: "new_password"
}

Response:
{
  message: "Password reset successful",
  code: "PASSWORD_RESET_SUCCESS"
}
```

**What it should do**:

1. Verify token is valid and not expired
2. Find user associated with token
3. Hash new password
4. Update user's password in database
5. Invalidate/delete the reset token
6. Return success message

## 📧 Email Template Example

```html
Subject: Reset Your Password - Restaurant QR Menu Hi [User Name], We received a
request to reset your password. Click the link below to reset it: [Reset
Password Button] → http://your-domain.com/reset-password?token=xxx This link
will expire in 1 hour. If you didn't request this, please ignore this email.
Thanks, Restaurant QR Menu Team
```

## 🧪 Testing (Frontend Only)

### Test Forgot Password Page:

1. Visit: `http://localhost:3000/forgot-password`
2. Enter an email
3. Click "Send Reset Link"
4. You'll see success screen (backend not implemented yet)

### Test Reset Password Page:

1. Visit: `http://localhost:3000/reset-password?token=test123`
2. Enter new password
3. Confirm password
4. Click "Reset Password"
5. Will show error (backend not implemented yet)

## 🔐 Security Considerations

### Token Security:

- ✅ Tokens should expire (1 hour recommended)
- ✅ Tokens should be single-use
- ✅ Use cryptographically secure random tokens
- ✅ Store hashed tokens in database

### Email Security:

- ✅ Rate limit forgot password requests (prevent spam)
- ✅ Don't reveal if email exists (security)
- ✅ Use HTTPS for reset links
- ✅ Validate token on backend

### Password Security:

- ✅ Minimum 6 characters (frontend validation)
- ✅ Hash passwords with bcrypt (backend)
- ✅ Invalidate old sessions after reset
- ✅ Send confirmation email after reset

## 📊 Routes Summary

| Route              | Component          | Purpose                               |
| ------------------ | ------------------ | ------------------------------------- |
| `/login`           | LoginPage          | User login (has forgot password link) |
| `/forgot-password` | ForgotPasswordPage | Request password reset                |
| `/reset-password`  | ResetPasswordPage  | Reset password with token             |

## 🎨 UI Features

### Forgot Password Page:

- ✅ Clean, centered design
- ✅ Email input field
- ✅ Loading state
- ✅ Error messages
- ✅ Success confirmation
- ✅ Back to login link
- ✅ Signup link

### Reset Password Page:

- ✅ Password strength requirements
- ✅ Password visibility toggle
- ✅ Confirm password field
- ✅ Password match validation
- ✅ Token validation
- ✅ Loading state
- ✅ Error messages

## 💡 Next Steps

### To Complete This Feature:

1. **Install Email Service** (Choose one):

   ```bash
   # Option 1: Nodemailer (free, self-hosted)
   npm install nodemailer

   # Option 2: SendGrid (free tier available)
   npm install @sendgrid/mail

   # Option 3: AWS SES (pay as you go)
   npm install aws-sdk
   ```

2. **Create Backend Routes**:

   - Add to `server/routes/auth.js`
   - Implement forgot password endpoint
   - Implement reset password endpoint

3. **Create Email Templates**:

   - HTML email template
   - Plain text fallback

4. **Add to Database**:

   - Add `resetToken` field to User model
   - Add `resetTokenExpiry` field to User model

5. **Test End-to-End**:
   - Request reset
   - Receive email
   - Click link
   - Reset password
   - Login with new password

## 📝 Example Backend Implementation

### User Model Update:

```javascript
// Add to server/models/User.js
const userSchema = new mongoose.Schema({
  // ... existing fields
  resetToken: String,
  resetTokenExpiry: Date,
});
```

### Forgot Password Route:

```javascript
// Add to server/routes/auth.js
import crypto from "crypto";
import nodemailer from "nodemailer";

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if email exists (security)
      return res.json({ message: "If email exists, reset link sent" });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save to database
    user.resetToken = hashedToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    // ... send email logic

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: "Error sending reset email" });
  }
});
```

### Reset Password Route:

```javascript
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    // Hash token to compare with database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Update password
    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password" });
  }
});
```

## ✅ Summary

**Frontend**: ✅ Complete and ready to use!
**Backend**: ⏳ Needs implementation (see above)
**Email Service**: ⏳ Needs setup

The UI is fully functional and styled to match your existing design. Once you implement the backend endpoints, the feature will be complete!

---

**Current Status**: Frontend ready, backend TODO
**Estimated Backend Time**: 2-3 hours
**Priority**: Medium (nice-to-have feature)
