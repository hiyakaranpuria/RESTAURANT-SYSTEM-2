# 📧 Email Setup Guide for Password Reset

## Current Status

✅ Email service is integrated and ready to use!
✅ Falls back to console logging if email is not configured (development mode)

## Quick Setup Options

### Option 1: Gmail (Easiest for Testing) ⭐

1. **Enable 2-Factor Authentication** on your Gmail account

   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**

   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Restaurant QR Menu"
   - Copy the 16-character password

3. **Update .env file**

   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   APP_NAME=Restaurant QR Menu
   ```

4. **Restart your server**
   ```bash
   npm run dev
   ```

### Option 2: SendGrid (Production Ready)

1. **Sign up for SendGrid**

   - Go to: https://sendgrid.com/
   - Free tier: 100 emails/day

2. **Create API Key**

   - Dashboard → Settings → API Keys
   - Create API Key with "Mail Send" permissions

3. **Update .env file**

   ```env
   # Comment out Gmail settings
   # EMAIL_SERVICE=gmail
   # EMAIL_USER=...
   # EMAIL_PASSWORD=...

   # Add SendGrid settings
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=apikey
   SMTP_PASSWORD=your-sendgrid-api-key
   APP_NAME=Restaurant QR Menu
   ```

### Option 3: Mailgun

1. **Sign up for Mailgun**

   - Go to: https://www.mailgun.com/
   - Free tier: 5,000 emails/month

2. **Get SMTP credentials**

   - Dashboard → Sending → Domain Settings → SMTP

3. **Update .env file**
   ```env
   SMTP_HOST=smtp.mailgun.org
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-mailgun-username
   SMTP_PASSWORD=your-mailgun-password
   APP_NAME=Restaurant QR Menu
   ```

## Testing the Email Feature

### Without Email Configuration (Development Mode)

- The system will log reset codes to the console
- Perfect for testing without setting up email

### With Email Configuration

1. Go to: http://localhost:3000/forgot-password
2. Enter a registered email
3. Check your inbox for the reset code
4. Use the code to reset your password

## Email Template Features

✅ Professional HTML email design
✅ Large, easy-to-read 6-digit code
✅ 1-hour expiration notice
✅ Security warnings
✅ Plain text fallback for email clients that don't support HTML

## Troubleshooting

### Gmail "Less secure app access" error

- **Solution**: Use App Password (see Option 1 above)
- Never use your regular Gmail password

### Emails going to spam

- Add a proper "From" name in APP_NAME
- Consider using a custom domain with SendGrid/Mailgun
- Ask users to whitelist your email

### "Connection refused" error

- Check SMTP_HOST and SMTP_PORT are correct
- Verify your firewall isn't blocking outgoing SMTP
- Try SMTP_PORT=465 with SMTP_SECURE=true

### Emails not sending but no error

- Check your email service dashboard for logs
- Verify API key/password is correct
- Check email quota limits

## Security Best Practices

✅ Never commit real credentials to Git
✅ Use environment variables for all sensitive data
✅ Use App Passwords, not regular passwords
✅ Rotate API keys regularly
✅ Monitor email sending logs for abuse

## Production Checklist

Before deploying to production:

- [ ] Remove `devToken` from response (already handled in code)
- [ ] Set `NODE_ENV=production`
- [ ] Use a professional email service (SendGrid/Mailgun)
- [ ] Set up a custom domain for emails
- [ ] Configure SPF, DKIM, and DMARC records
- [ ] Set up email monitoring and alerts
- [ ] Test email delivery to major providers (Gmail, Outlook, Yahoo)

## Need Help?

The system works perfectly without email configuration - it will just log codes to the console. This is great for development and testing!

When you're ready for production, start with Gmail for testing, then move to SendGrid or Mailgun for reliability.
