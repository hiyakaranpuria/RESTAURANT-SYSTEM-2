# 📧 Email Quick Start - 2 Minutes Setup

## 🚀 Fastest Way (Gmail)

### Step 1: Get App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Create password for "Mail" → "Other"
3. Copy the 16-character code

### Step 2: Update .env

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

### Step 3: Restart Server

```bash
npm run dev
```

### Step 4: Test It!

1. Go to: http://localhost:3000/forgot-password
2. Enter: customer@restaurant.com
3. Check your email inbox! 📬

---

## 🎯 What Happens Now?

### ✅ Email Configured

- Users receive reset codes via email
- Professional HTML email template
- 6-digit code, expires in 1 hour

### ⚠️ Email NOT Configured

- Codes still appear in console (development mode)
- Everything works, just no email sent
- Perfect for testing!

---

## 📝 Quick Test

```bash
# Test forgot password
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@restaurant.com"}'

# Check your email or console for the code!
```

---

## 🔧 Troubleshooting

**Gmail not working?**

- Enable 2FA first: https://myaccount.google.com/security
- Use App Password, not regular password

**Still seeing console logs?**

- That's normal! It's a fallback for development
- Email is sent AND logged to console

**Want to use another service?**

- See EMAIL_SETUP_GUIDE.md for SendGrid, Mailgun, etc.

---

## 🎉 You're Done!

The password reset feature now sends real emails! 🚀
