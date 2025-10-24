# 🔄 New Authentication System Plan

## Overview

Separate authentication flows for Users (Customers) and Restaurant Owners

---

## 1️⃣ USER (CUSTOMER) AUTHENTICATION

### User Signup Page (`/signup`)

**Required for ordering**

**Fields:**

- Full Name (required)
- Phone Number (required) - For contact & future advertising
- Email (required) - For contact & future advertising
- Password (required)
- Confirm Password (required)

**Features:**

- Phone number validation
- Email validation
- Password strength indicator
- Terms & conditions checkbox
- Privacy policy link

**After Signup:**

- User can browse menu
- User can place orders
- User receives order updates via phone/email

---

## 2️⃣ RESTAURANT REGISTRATION

### Restaurant Signup Page (`/restaurant/signup`)

**For restaurant owners to register their business**

**Business Information:**

- Restaurant Name (required)
- Business Type (Cafe, Restaurant, Fast Food, etc.)
- Cuisine Type (Italian, Chinese, Mexican, etc.)
- Description (optional)

**Location Information:**

- Street Address (required)
- City (required)
- State/Province (required)
- Postal Code (required)
- Country (required)
- Phone Number (required)

**Owner Information:**

- Owner Full Name (required)
- Owner Email (required)
- Owner Phone (required)
- Password (required)
- Confirm Password (required)

**Verification Documents:**

- Business License Number (required)
- Tax ID / VAT Number (required)
- Business Registration Certificate (upload)
- Owner ID Proof (upload)

**Additional Information:**

- Website URL (optional)
- Social Media Links (optional)
- Operating Hours (optional)
- Number of Tables (optional)

**After Registration:**

- Status: "Pending Verification"
- Admin reviews the application
- Admin approves/rejects
- Once approved, restaurant gets access to admin panel

---

## 🔐 Authentication Flow

### User Flow

```
User visits /signup
    ↓
Fills registration form
(Name, Phone, Email, Password)
    ↓
Submits form
    ↓
Account created (role: customer)
    ↓
Can immediately order
    ↓
Receives marketing communications
```

### Restaurant Flow

```
Owner visits /restaurant/signup
    ↓
Fills detailed registration form
(Business info, Location, Owner details, Documents)
    ↓
Submits application
    ↓
Status: "Pending Verification"
    ↓
Admin reviews application
    ↓
Admin approves/rejects
    ↓
If approved: Restaurant gets admin access
    ↓
Can manage menu, tables, orders
```

---

## 📊 Database Models

### User Model (Updated)

```javascript
{
  name: String,
  email: String (unique),
  phone: String (required, unique),
  passwordHash: String,
  role: 'customer',
  marketingConsent: Boolean,
  createdAt: Date
}
```

### Restaurant Model (New)

```javascript
{
  // Business Info
  restaurantName: String,
  businessType: String,
  cuisineType: String,
  description: String,

  // Location
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  phone: String,

  // Owner Info
  owner: {
    name: String,
    email: String (unique),
    phone: String,
    passwordHash: String
  },

  // Verification
  verification: {
    businessLicense: String,
    taxId: String,
    documents: [String], // URLs to uploaded files
    status: 'pending' | 'approved' | 'rejected',
    reviewedBy: ObjectId (Admin),
    reviewedAt: Date,
    notes: String
  },

  // Additional
  website: String,
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String
  },
  operatingHours: Object,
  numberOfTables: Number,

  // System
  role: 'restaurant',
  isActive: Boolean,
  createdAt: Date
}
```

---

## 🎨 UI Pages to Create

### 1. User Signup (`/signup`)

- Clean, simple form
- Focus on quick registration
- Phone + Email + Password
- Marketing consent checkbox

### 2. User Login (`/login`)

- Email or Phone login
- Password
- "Forgot Password" link

### 3. Restaurant Signup (`/restaurant/signup`)

- Multi-step form (wizard)
  - Step 1: Business Information
  - Step 2: Location Details
  - Step 3: Owner Information
  - Step 4: Verification Documents
  - Step 5: Review & Submit
- Progress indicator
- Save draft functionality

### 4. Restaurant Login (`/restaurant/login`)

- Email login
- Password
- "Forgot Password" link
- Link to signup

### 5. Restaurant Dashboard (`/restaurant/dashboard`)

- If pending: Show verification status
- If approved: Show admin panel
- If rejected: Show reason & reapply option

---

## 🔄 Migration Plan

### Phase 1: Create New Models

- Update User model (add phone)
- Create Restaurant model
- Create migration script

### Phase 2: Create UI Pages

- User Signup page
- User Login page
- Restaurant Signup page (multi-step)
- Restaurant Login page

### Phase 3: Update Backend

- New API endpoints
- File upload for documents
- Verification workflow
- Admin approval system

### Phase 4: Admin Features

- Restaurant applications list
- Review application page
- Approve/Reject functionality
- Document viewer

---

## 📝 API Endpoints

### User Authentication

- POST `/api/auth/user/signup` - User registration
- POST `/api/auth/user/login` - User login
- GET `/api/auth/user/me` - Get user profile

### Restaurant Authentication

- POST `/api/auth/restaurant/signup` - Restaurant registration
- POST `/api/auth/restaurant/login` - Restaurant login
- GET `/api/auth/restaurant/me` - Get restaurant profile
- PATCH `/api/auth/restaurant/profile` - Update profile

### Admin - Restaurant Management

- GET `/api/admin/restaurants` - List all restaurants
- GET `/api/admin/restaurants/:id` - Get restaurant details
- PATCH `/api/admin/restaurants/:id/verify` - Approve/Reject
- GET `/api/admin/restaurants/pending` - Pending applications

---

## ✅ Next Steps

1. Confirm this plan
2. Start with User Signup/Login (simpler)
3. Then build Restaurant Registration (complex)
4. Add admin verification workflow
5. Test everything

Ready to start building?
