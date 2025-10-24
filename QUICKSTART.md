# Quick Start Guide

## Prerequisites

- Node.js v16+ installed
- MongoDB installed and running (or use MongoDB Atlas)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
MONGODB_URI=mongodb://localhost:27017/restaurant-qr-menu
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Seed the Database

```bash
node server/seed.js
```

This will create:

- 3 users (admin, staff, customer)
- 8 tables with QR codes
- 5 menu categories
- 10 menu items

### 4. Start the Application

**Option A: Run both servers separately**

Terminal 1 (Backend):

```bash
npm run server
```

Terminal 2 (Frontend):

```bash
npm run dev
```

**Option B: Use concurrently (if installed)**

```bash
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Test Accounts

After seeding, you can login with:

| Role     | Email                   | Password    |
| -------- | ----------------------- | ----------- |
| Admin    | admin@restaurant.com    | admin123    |
| Staff    | staff@restaurant.com    | staff123    |
| Customer | customer@restaurant.com | customer123 |

## Testing the Flow

### Customer Flow

1. Go to http://localhost:3000/m/table-1-[timestamp] (check seed output for exact URL)
2. Browse menu items
3. Add items to cart
4. Go to cart and place order
5. Track order status

### Staff Flow

1. Login as staff at http://localhost:3000/login
2. View live order queue at /staff/orders
3. Move orders through statuses (Placed → Preparing → Ready)

### Admin Flow

1. Login as admin at http://localhost:3000/login
2. Manage menu at /admin/menu
3. Manage tables and generate QR codes at /admin/tables

## Common Issues

### MongoDB Connection Error

- Make sure MongoDB is running: `mongod` or check your MongoDB service
- Verify MONGODB_URI in .env file

### Port Already in Use

- Change PORT in .env file
- Or kill the process using the port

### Module Not Found

- Run `npm install` again
- Delete node_modules and package-lock.json, then run `npm install`

## Project Structure

```
restaurant-qr-menu/
├── server/              # Backend (Express + MongoDB)
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Auth middleware
│   └── index.js        # Server entry
├── src/                # Frontend (React)
│   ├── pages/          # Page components
│   ├── components/     # Reusable components
│   ├── context/        # React context
│   └── App.jsx         # Main app
└── package.json
```

## Next Steps

1. Customize the menu items and categories
2. Add your restaurant branding
3. Configure payment integration
4. Deploy to production

## Support

For issues or questions, please check the README.md file or create an issue in the repository.
