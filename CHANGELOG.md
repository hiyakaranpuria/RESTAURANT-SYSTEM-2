# Changelog

## [1.1.0] - Signup Feature Added

### Added

- **SignupPage Component** (`src/pages/auth/SignupPage.jsx`)

  - Full user registration form
  - Name, email, password, and confirm password fields
  - Password visibility toggles for both password fields
  - Client-side validation (password length, password match)
  - Error handling and display
  - Loading state during submission
  - Automatic login after successful registration
  - Link to login page
  - Matches login page design theme

- **Navigation Links**

  - Added "Sign up" link to login page
  - Added "Sign in" link to signup page
  - Seamless navigation between auth pages

- **Route Configuration**

  - Added `/signup` route to App.jsx
  - Public route (no authentication required)

- **Documentation**
  - `SIGNUP_GUIDE.md` - Comprehensive signup feature guide
  - `AUTH_PAGES.md` - Visual comparison of auth pages
  - `CHANGELOG.md` - This file
  - Updated `PROJECT_SUMMARY.md` with signup page details

### Modified

- `src/App.jsx`

  - Imported SignupPage component
  - Added signup route

- `src/pages/auth/LoginPage.jsx`

  - Imported Link from react-router-dom
  - Added signup link at bottom of form

- `PROJECT_SUMMARY.md`
  - Updated page count (7 → 8 pages)
  - Added SignupPage documentation
  - Updated file structure

### Design Consistency

- ✅ Same color scheme as login page
- ✅ Same layout structure
- ✅ Same form styling
- ✅ Same button styles
- ✅ Same input field styles
- ✅ Same icon and typography
- ✅ Same responsive behavior

### User Experience

- New users can now create accounts
- Automatic login after signup
- Clear validation messages
- Password visibility toggles
- Smooth navigation between login/signup

### Security

- Passwords hashed with bcrypt on backend
- JWT token generated on registration
- Token stored in localStorage
- Automatic authentication after signup
- Role-based access control (defaults to 'customer')

---

## [1.0.0] - Initial Release

### Features

- Customer menu browsing with QR codes
- Shopping cart functionality
- Order placement and tracking
- Staff order queue dashboard
- Admin menu management
- Admin table management with QR generation
- JWT authentication
- Role-based access control
- MongoDB database integration
- RESTful API
- Responsive design
- 7 main pages (Menu, Cart, Order Status, Login, Order Queue, Menu Management, Tables)

### Tech Stack

- React 18
- React Router v6
- Tailwind CSS
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- QRCode generation
- Vite build tool
