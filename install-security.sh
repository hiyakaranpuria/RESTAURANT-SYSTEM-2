#!/bin/bash

echo "🔒 Installing Security Packages..."
echo ""

cd server

echo "📦 Installing express-rate-limit..."
npm install express-rate-limit

echo "📦 Installing helmet..."
npm install helmet

echo ""
echo "✅ Security packages installed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Restart your server: npm start"
echo "2. Test authentication endpoints"
echo "3. Review SECURITY_IMPLEMENTATION.md for details"
echo ""
echo "🔐 Your application is now more secure!"
