# Restaurant QR Menu System

A full-stack restaurant QR menu ordering system built with React, Node.js, Express, and MongoDB.

## Features

### Customer Features

- Scan QR code to view menu for specific table
- Browse menu by categories
- Search menu items
- Add items to cart with custom notes
- Place orders
- Track order status in real-time

### Staff Features

- Live order queue dashboard
- Kanban-style order management (Placed → Preparing → Ready)
- Update order status
- Filter orders by status and table
- Sound notifications for new orders

### Admin Features

- Menu management (CRUD operations)
- Category management
- Toggle item availability
- Table management
- Generate QR codes for tables
- Download/print QR codes

## Tech Stack

### Frontend

- React 18
- React Router v6
- Axios
- Tailwind CSS
- Vite

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing
- QRCode generation

## Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Setup

1. Clone the repository

```bash
git clone <repository-url>
cd restaurant-qr-menu
```

2. Install dependencies

```bash
npm install
```

3. Create `.env` file in the root directory

```env
MONGODB_URI=mongodb://localhost:27017/restaurant-qr-menu
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. Seed the database (optional)

```bash
node server/seed.js
```

5. Start the development servers

Terminal 1 - Backend:

```bash
npm run server
```

Terminal 2 - Frontend:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`
The backend API will be available at `http://localhost:5000`

## Default Users (after seeding)

- **Admin**: admin@restaurant.com / admin123
- **Staff**: staff@restaurant.com / staff123
- **Customer**: customer@restaurant.com / customer123

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Menu

- `GET /api/menu/categories` - Get all categories
- `GET /api/menu/items` - Get menu items (with pagination, search, filter)
- `GET /api/menu/by-table/:slug` - Get menu for specific table
- `POST /api/menu/items` - Create menu item (admin only)
- `PATCH /api/menu/items/:id` - Update menu item (admin only)
- `DELETE /api/menu/items/:id` - Delete menu item (admin only)

### Tables

- `GET /api/tables` - Get all tables (staff/admin)
- `POST /api/tables` - Create table (admin only)
- `GET /api/tables/:id/qr` - Generate QR code (admin only)
- `DELETE /api/tables/:id` - Delete table (admin only)

### Orders

- `POST /api/orders` - Place order (public)
- `GET /api/orders` - Get orders (staff/admin, with filters)
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id/status` - Update order status (staff/admin)

## Project Structure

```
restaurant-qr-menu/
├── server/
│   ├── models/          # Mongoose models
│   ├── routes/          # Express routes
│   ├── middleware/      # Auth middleware
│   ├── index.js         # Server entry point
│   └── seed.js          # Database seeder
├── src/
│   ├── components/      # Reusable components
│   ├── context/         # React context (Auth, Cart)
│   ├── pages/           # Page components
│   │   ├── admin/       # Admin pages
│   │   ├── staff/       # Staff pages
│   │   ├── customer/    # Customer pages
│   │   └── auth/        # Auth pages
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Key Features Implementation

### Role-Based Access Control (RBAC)

- JWT-based authentication
- Middleware to check user roles
- Protected routes on frontend and backend

### QR Code System

- Each table has a unique QR slug
- QR codes link to `/m/:qrSlug`
- Table context persisted in cart session

### Order Management

- Real-time order status updates
- Kanban-style workflow
- Status progression: placed → preparing → ready → served

### Menu Browsing

- Category filtering
- Text search with MongoDB text indexes
- Availability toggle
- Pagination support

## Future Enhancements

- Socket.io for real-time updates
- Image upload for menu items
- Order history for customers
- Analytics dashboard
- Multi-language support
- Payment integration
- Table reservation system

## License

MIT
