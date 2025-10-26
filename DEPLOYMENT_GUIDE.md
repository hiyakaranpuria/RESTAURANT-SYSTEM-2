# 🚀 Complete Deployment Guide - Restaurant QR Menu System

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Option 1: Deploy to Vercel + Railway (Recommended)](#option-1-vercel--railway-recommended)
3. [Option 2: Deploy to Heroku](#option-2-deploy-to-heroku)
4. [Option 3: Deploy to DigitalOcean/AWS](#option-3-deploy-to-digitaloceanaws)
5. [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
6. [Environment Variables](#environment-variables)
7. [Post-Deployment Steps](#post-deployment-steps)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Pre-Deployment Checklist

### 1. **Prepare Your Code**

- [ ] All features tested locally
- [ ] No console.log statements in production code
- [ ] Environment variables properly configured
- [ ] Database connection tested
- [ ] All dependencies installed
- [ ] Build process works (`npm run build`)

### 2. **Update Configuration Files**

#### Update `package.json` (if needed):

```json
{
  "scripts": {
    "start": "node server/index.js",
    "server": "node server/index.js",
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  }
}
```

### 3. **Create Production Environment File**

Create `.env.production`:

```env
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_super_secret_key_change_this
JWT_REFRESH_SECRET=your_refresh_secret_key
PORT=5000
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

---

## 🌟 Option 1: Deploy to Vercel + Railway (Recommended)

**Best for:** Quick deployment, automatic scaling, free tier available

### **Part A: Deploy Backend to Railway**

#### Step 1: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create new cluster (M0 Free tier)
4. Create database user
5. Whitelist all IPs: `0.0.0.0/0`
6. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/restaurant-qr-menu`

#### Step 2: Deploy Backend to Railway

1. **Install Railway CLI:**

```bash
npm install -g @railway/cli
```

2. **Login to Railway:**

```bash
railway login
```

3. **Create New Project:**

```bash
railway init
```

4. **Create `railway.json` in root:**

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node server/index.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

5. **Create `Procfile` in root:**

```
web: node server/index.js
```

6. **Set Environment Variables in Railway Dashboard:**

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

7. **Deploy:**

```bash
railway up
```

8. **Get your Railway URL:**

```
https://your-app.railway.app
```

### **Part B: Deploy Frontend to Vercel**

#### Step 1: Prepare Frontend

1. **Update `vite.config.js`:**

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://your-backend.railway.app",
        changeOrigin: true,
      },
      "/uploads": {
        target: "https://your-backend.railway.app",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
```

2. **Create `vercel.json` in root:**

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend.railway.app/api/:path*"
    },
    {
      "source": "/uploads/:path*",
      "destination": "https://your-backend.railway.app/uploads/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Credentials", "value": "true" },
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
        }
      ]
    }
  ]
}
```

#### Step 2: Deploy to Vercel

1. **Install Vercel CLI:**

```bash
npm install -g vercel
```

2. **Login:**

```bash
vercel login
```

3. **Deploy:**

```bash
vercel --prod
```

4. **Or use Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure build settings:
     - Framework Preset: `Vite`
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add environment variables (if needed)
   - Deploy!

---

## 🔷 Option 2: Deploy to Heroku

**Best for:** Traditional deployment, easy scaling

### Step 1: Prepare for Heroku

1. **Install Heroku CLI:**

```bash
# Windows
choco install heroku-cli

# Mac
brew tap heroku/brew && brew install heroku

# Or download from heroku.com
```

2. **Login:**

```bash
heroku login
```

### Step 2: Create Heroku Apps

```bash
# Create backend app
heroku create your-restaurant-backend

# Create frontend app
heroku create your-restaurant-frontend
```

### Step 3: Deploy Backend

1. **Create `Procfile` in root:**

```
web: node server/index.js
```

2. **Set environment variables:**

```bash
heroku config:set MONGODB_URI="mongodb+srv://..." --app your-restaurant-backend
heroku config:set JWT_SECRET="your_secret" --app your-restaurant-backend
heroku config:set JWT_REFRESH_SECRET="your_refresh_secret" --app your-restaurant-backend
heroku config:set NODE_ENV="production" --app your-restaurant-backend
heroku config:set FRONTEND_URL="https://your-restaurant-frontend.herokuapp.com" --app your-restaurant-backend
```

3. **Deploy:**

```bash
git push heroku main
```

### Step 4: Deploy Frontend

1. **Update `vite.config.js` with Heroku backend URL**

2. **Create `static.json` in root:**

```json
{
  "root": "dist",
  "clean_urls": true,
  "routes": {
    "/**": "index.html"
  },
  "headers": {
    "/**": {
      "Cache-Control": "no-cache, no-store, must-revalidate"
    }
  }
}
```

3. **Add buildpack:**

```bash
heroku buildpacks:add heroku/nodejs --app your-restaurant-frontend
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-static --app your-restaurant-frontend
```

4. **Update `package.json`:**

```json
{
  "scripts": {
    "heroku-postbuild": "npm run build"
  }
}
```

5. **Deploy:**

```bash
git push heroku main
```

---

## 🌊 Option 3: Deploy to DigitalOcean/AWS

**Best for:** Full control, custom configuration

### DigitalOcean Deployment

#### Step 1: Create Droplet

1. Go to [DigitalOcean](https://www.digitalocean.com)
2. Create Droplet:
   - Ubuntu 22.04 LTS
   - Basic plan ($6/month)
   - Choose datacenter region
   - Add SSH key

#### Step 2: Setup Server

```bash
# SSH into your droplet
ssh root@your_droplet_ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install PM2
npm install -g pm2

# Install Nginx
apt install -y nginx

# Install Git
apt install -y git
```

#### Step 3: Clone and Setup Project

```bash
# Clone your repository
cd /var/www
git clone https://github.com/yourusername/your-repo.git
cd your-repo

# Install dependencies
npm install

# Build frontend
npm run build

# Create .env file
nano .env
# Add your environment variables
```

#### Step 4: Configure PM2

```bash
# Start backend with PM2
pm2 start server/index.js --name restaurant-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### Step 5: Configure Nginx

```bash
# Create Nginx configuration
nano /etc/nginx/sites-available/restaurant
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/your-repo/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads
    location /uploads {
        proxy_pass http://localhost:5000;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/restaurant /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

#### Step 6: Setup SSL with Let's Encrypt

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your-domain.com

# Auto-renewal is setup automatically
```

---

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up / Login
3. Create new project: "Restaurant QR Menu"
4. Build a cluster (M0 Free tier)
5. Choose cloud provider and region

### Step 2: Configure Security

1. **Database Access:**

   - Create database user
   - Username: `restaurant_admin`
   - Password: Generate strong password
   - Database User Privileges: `Read and write to any database`

2. **Network Access:**
   - Add IP Address: `0.0.0.0/0` (Allow from anywhere)
   - Or add specific IPs of your deployment servers

### Step 3: Get Connection String

1. Click "Connect"
2. Choose "Connect your application"
3. Copy connection string:

```
mongodb+srv://restaurant_admin:<password>@cluster0.xxxxx.mongodb.net/restaurant-qr-menu?retryWrites=true&w=majority
```

4. Replace `<password>` with your actual password

### Step 4: Seed Database (Optional)

```bash
# Run seed script with production database
MONGODB_URI="your_atlas_uri" node server/seed.js
```

---

## 🔐 Environment Variables

### Backend Environment Variables

```env
# Required
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_key_min_32_chars
PORT=5000

# Optional
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend Environment Variables (if needed)

Create `.env.production`:

```env
VITE_API_URL=https://your-backend-domain.com
```

---

## ✅ Post-Deployment Steps

### 1. **Test All Endpoints**

```bash
# Test backend health
curl https://your-backend.com/api/auth/me

# Test frontend
curl https://your-frontend.com
```

### 2. **Create Admin Account**

```bash
# SSH into your server or use Railway/Heroku CLI
node create-admin.js
```

Or use the seed script:

```bash
node server/seed.js
```

### 3. **Setup Monitoring**

#### For Railway:

- Built-in monitoring in dashboard

#### For Heroku:

```bash
heroku logs --tail --app your-app-name
```

#### For DigitalOcean:

```bash
# View PM2 logs
pm2 logs

# View Nginx logs
tail -f /var/log/nginx/error.log
```

### 4. **Setup Custom Domain**

#### Vercel:

1. Go to project settings
2. Add domain
3. Update DNS records

#### Railway:

1. Go to project settings
2. Add custom domain
3. Update DNS records

#### DigitalOcean:

1. Point A record to droplet IP
2. Update Nginx configuration
3. Get SSL certificate

### 5. **Enable CORS**

Update `server/index.js`:

```javascript
import cors from "cors";

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
```

### 6. **Setup Backups**

#### MongoDB Atlas:

- Automatic backups enabled on paid tiers
- Or use `mongodump` for manual backups

```bash
mongodump --uri="your_mongodb_uri" --out=/backup/$(date +%Y%m%d)
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. **CORS Errors**

```javascript
// Add to server/index.js
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://your-frontend.vercel.app",
      "https://your-custom-domain.com",
    ],
    credentials: true,
  })
);
```

#### 2. **MongoDB Connection Failed**

- Check connection string
- Verify IP whitelist in MongoDB Atlas
- Check network access settings

#### 3. **Build Fails**

```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 4. **API Routes Not Working**

- Check `vercel.json` rewrites
- Verify backend URL in proxy configuration
- Check CORS settings

#### 5. **Images Not Loading**

- Ensure uploads folder is accessible
- Check file permissions
- Verify proxy configuration for `/uploads`

### Debug Commands

```bash
# Check if backend is running
curl https://your-backend.com/api/auth/me

# Check environment variables (Railway)
railway variables

# Check environment variables (Heroku)
heroku config --app your-app-name

# View logs (Railway)
railway logs

# View logs (Heroku)
heroku logs --tail --app your-app-name

# View logs (DigitalOcean)
pm2 logs
tail -f /var/log/nginx/error.log
```

---

## 📊 Deployment Comparison

| Feature             | Vercel + Railway | Heroku           | DigitalOcean |
| ------------------- | ---------------- | ---------------- | ------------ |
| **Ease of Setup**   | ⭐⭐⭐⭐⭐       | ⭐⭐⭐⭐         | ⭐⭐⭐       |
| **Free Tier**       | ✅ Yes           | ✅ Yes (limited) | ❌ No        |
| **Auto Scaling**    | ✅ Yes           | ✅ Yes           | ❌ Manual    |
| **Custom Domain**   | ✅ Free          | ✅ Free          | ✅ Free      |
| **SSL Certificate** | ✅ Auto          | ✅ Auto          | ⚙️ Manual    |
| **Cost (Monthly)**  | $0-20            | $7-25            | $6-12        |
| **Best For**        | Startups         | Small apps       | Full control |

---

## 🎯 Recommended Deployment Strategy

### For Development/Testing:

- **Frontend**: Vercel (free)
- **Backend**: Railway (free tier)
- **Database**: MongoDB Atlas (free M0)

### For Production:

- **Frontend**: Vercel ($20/month)
- **Backend**: Railway ($5-20/month) or DigitalOcean ($12/month)
- **Database**: MongoDB Atlas (M2 $9/month or M10 $57/month)

### For Enterprise:

- **Frontend**: Vercel Pro
- **Backend**: AWS/DigitalOcean with load balancer
- **Database**: MongoDB Atlas M30+ with backups

---

## 📝 Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP whitelist configured
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Environment variables set
- [ ] Custom domain configured (optional)
- [ ] SSL certificate installed
- [ ] Admin account created
- [ ] Test all features
- [ ] Setup monitoring
- [ ] Setup backups
- [ ] Document deployment process

---

## 🚀 Quick Deploy Commands

### Deploy Everything (Vercel + Railway)

```bash
# 1. Deploy backend to Railway
cd your-project
railway login
railway init
railway up

# 2. Deploy frontend to Vercel
vercel --prod

# 3. Update environment variables
# Railway: railway variables set KEY=value
# Vercel: vercel env add KEY
```

---

## 📞 Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Heroku Docs**: https://devcenter.heroku.com
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **DigitalOcean Docs**: https://docs.digitalocean.com

---

**Need help?** Check the troubleshooting section or create an issue in your repository!

Good luck with your deployment! 🎉
