# Restaurant QR Menu System - Project Summary

## Overview

A complete full-stack restaurant QR menu ordering system that allows customers to scan QR codes at tables, browse menus, place orders, and track order status in real-time. Staff can manage orders through a kanban-style dashboard, and admins can manage menus, items, and tables.

## Technology Stack

### Frontend

- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Vite** - Build tool and dev server
- **Context API** - State management (Auth & Cart)

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **QRCode** - QR code generation
- **CORS** - Cross-origin resource sharing

## Key Features Implemented

### 1. Customer Experience

✅ QR code scanning to access table-specific menu
✅ Category-based menu browsing
✅ Search functionality
✅ Shopping cart with quantity management
✅ Custom notes for menu items
✅ Order placement
✅ Real-time order status tracking
✅ Guest ordering (no login required)

### 2. Staff Dashboard

✅ Live order queue with real-time updates
✅ Kanban-style order management (3 columns: Placed, Preparing, Ready)
✅ Order status updates
✅ Search and filter orders
✅ Sound notification toggle
✅ Order details view

### 3. Admin Panel

✅ Menu management (CRUD operations)
✅ Category management
✅ Item availability toggle
✅ Table management
✅ QR code generation for tables
✅ QR code download/print functionality

### 4. Authentication & Authorization

✅ JWT-based authentication
✅ Role-based access control (Customer, Staff, Admin)
✅ Protected routes (frontend & backend)
✅ Secure password hashing

### 5. Database Design

✅ User model with roles
✅ Table model with QR slugs
✅ MenuCategory model
✅ MenuItem model with text search indexes
✅ Order model with status tracking

## API Endpoints

### Authentication

- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- GET `/api/auth/me` - Get current user

### Menu

- GET `/api/menu/categories` - List all categories
- GET `/api/menu/items` - List items (with pagination, search, filter)
- GET `/api/menu/by-table/:slug` - Get menu for specific table
- POST `/api/menu/items` - Create item (admin)
- PATCH `/api/menu/items/:id` - Update item (admin)
- DELETE `/api/menu/items/:id` - Delete item (admin)

### Tables

- GET `/api/tables` - List all tables (staff/admin)
- POST `/api/tables` - Create table (admin)
- GET `/api/tables/:id/qr` - Generate QR code (admin)
- DELETE `/api/tables/:id` - Delete table (admin)

### Orders

- POST `/api/orders` - Place order (public)
- GET `/api/orders` - List orders with filters (staff/admin)
- GET `/api/orders/:id` - Get order details
- PATCH `/api/orders/:id/status` - Update order status (staff/admin)

## Pages Implemented

### Customer Pages

1. **MenuPage** (`/m/:qrSlug`)

   - Displays menu for scanned table
   - Category navigation
   - Search functionality
   - Add to cart
   - Cart sidebar (desktop)

2. **CartPage** (`/cart`)

   - Review cart items
   - Modify quantities
   - Add special requests
   - Place order
   - Order summary

3. **OrderStatusPage** (`/order/:orderId`)
   - Visual progress tracker
   - Current status display
   - Order details accordion
   - Call waiter button

### Auth Pages

4. **LoginPage** (`/login`)

   - Email/password login
   - Role-based redirect
   - Password visibility toggle
   - Link to signup page

5. **SignupPage** (`/signup`)
   - User registration form
   - Full name, email, password fields
   - Password confirmation
   - Password visibility toggle
   - Link to login page

### Staff Pages

6. **OrderQueuePage** (`/staff/orders`)
   - Kanban board layout
   - Real-time order updates
   - Status management
   - Search and filters
   - Sound notifications

### Admin Pages

7. **MenuManagementPage** (`/admin/menu`)

   - Category sidebar
   - Item grid view
   - Availability toggle
   - CRUD operations
   - Image display

8. **TablesPage** (`/admin/tables`)
   - Table list with pagination
   - QR code generation
   - QR code modal with download/print
   - Table CRUD operations

## Design System

### Colors

- **Primary**: #17cf17 (Green)
- **Background Light**: #f6f8f6
- **Background Dark**: #112111

### Typography

- **Font Family**: Epilogue (Google Fonts)
- **Weights**: 400, 500, 600, 700, 800, 900

### Icons

- Material Symbols Outlined

### Components

- Responsive design (mobile-first)
- Dark mode support (configured)
- Consistent spacing and shadows
- Smooth transitions and hover effects

## Security Features

✅ Password hashing with bcrypt
✅ JWT token authentication
✅ Role-based access control
✅ Protected API routes
✅ Protected frontend routes
✅ Input validation
✅ CORS configuration

## Database Indexes

- Text index on MenuItem (name, tags) for search
- Compound index on MenuItem (categoryId, name) for filtering
- Unique indexes on User email, Table number, Table qrSlug

## File Structure

```
restaurant-qr-menu/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Table.js
│   │   ├── MenuCategory.js
│   │   ├── MenuItem.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── menu.js
│   │   ├── tables.js
│   │   └── orders.js
│   ├── middleware/
│   │   └── auth.js
│   ├── index.js
│   └── seed.js
├── src/
│   ├── components/
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── MenuManagementPage.jsx
│   │   │   └── TablesPage.jsx
│   │   ├── staff/
│   │   │   └── OrderQueuePage.jsx
│   │   ├── customer/
│   │   │   ├── MenuPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   └── OrderStatusPage.jsx
│   │   └── auth/
│   │       ├── LoginPage.jsx
│   │       └── SignupPage.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── .gitignore
├── README.md
├── QUICKSTART.md
├── PROJECT_SUMMARY.md
└── setup.bat
```

## Installation & Setup

1. **Install dependencies**: `npm install`
2. **Configure environment**: Copy `.env.example` to `.env`
3. **Seed database**: `npm run seed`
4. **Start backend**: `npm run server`
5. **Start frontend**: `npm run dev`

Or use the setup script: `setup.bat` (Windows)

## Default Credentials

After seeding:

- **Admin**: admin@restaurant.com / admin123
- **Staff**: staff@restaurant.com / staff123
- **Customer**: customer@restaurant.com / customer123

## Future Enhancements

### High Priority

- [ ] Socket.io for real-time order updates
- [ ] Image upload functionality for menu items
- [ ] Order history for customers
- [ ] Analytics dashboard for admin

### Medium Priority

- [ ] Multi-language support
- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] SMS notifications for order status

### Low Priority

- [ ] Table reservation system
- [ ] Customer reviews and ratings
- [ ] Loyalty program
- [ ] Dietary filters (vegan, gluten-free, etc.)
- [ ] Calorie information

## Performance Considerations

- Pagination implemented for menu items
- Database indexes for fast queries
- Image optimization recommended
- Lazy loading for images
- Debounced search input

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment Recommendations

### Frontend

- Vercel
- Netlify
- AWS Amplify

### Backend

- Heroku
- Railway
- DigitalOcean
- AWS EC2

### Database

- MongoDB Atlas (recommended)
- Self-hosted MongoDB

## License

MIT License

## Credits

Built with modern web technologies and best practices for restaurant management systems.
