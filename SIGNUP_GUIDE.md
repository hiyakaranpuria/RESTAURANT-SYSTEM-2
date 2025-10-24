# Signup Feature Guide

## Overview

A new signup page has been added to allow users to create accounts with the same design theme as the login page.

## Features

### Signup Page (`/signup`)

- **Full Name Field** - User's display name
- **Email Field** - Unique email for login
- **Password Field** - With visibility toggle
- **Confirm Password Field** - With visibility toggle and validation
- **Password Validation** - Minimum 6 characters
- **Password Match Validation** - Ensures both passwords match
- **Error Handling** - Clear error messages
- **Loading State** - Button shows "Creating Account..." during submission
- **Link to Login** - "Already have an account? Sign in" at the bottom

### Login Page Updates

- Added "Don't have an account? Sign up" link at the bottom
- Seamless navigation between login and signup

## User Flow

### New User Registration

1. User visits `/signup` or clicks "Sign up" from login page
2. Fills in:
   - Full Name
   - Email
   - Password (min 6 characters)
   - Confirm Password
3. Clicks "Sign Up" button
4. Account is created with 'customer' role by default
5. User is automatically logged in
6. Redirected to home page

### Validation Rules

- All fields are required
- Email must be valid format
- Password must be at least 6 characters
- Confirm password must match password
- Email must be unique (backend validation)

## Design Consistency

Both login and signup pages share:

- Same color scheme (primary green #17cf17)
- Same layout and spacing
- Same form styling
- Same icon (restaurant_menu)
- Same typography (Epilogue font)
- Same button styles
- Same input field styles
- Same error message styling

## API Integration

### Endpoint Used

```
POST /api/auth/register
```

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer"
}
```

### Response

```json
{
  "token": "jwt-token-here",
  "user": {
    "_id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

## Routes

- `/signup` - Signup page (public)
- `/login` - Login page (public)

## Navigation Between Pages

### From Login to Signup

Click "Sign up" link at the bottom of login page

### From Signup to Login

Click "Sign in" link at the bottom of signup page

## Security Features

- Passwords are hashed with bcrypt on the backend
- JWT token is generated upon successful registration
- Token is stored in localStorage
- Token is automatically added to axios headers
- User is authenticated immediately after signup

## Testing the Signup Flow

1. Start the application
2. Navigate to http://localhost:3000/signup
3. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - Confirm Password: test123
4. Click "Sign Up"
5. You should be logged in and redirected

## Error Scenarios

### Passwords Don't Match

- Error: "Passwords do not match"
- Shown before API call

### Password Too Short

- Error: "Password must be at least 6 characters"
- Shown before API call

### Email Already Exists

- Error: "User already exists"
- Returned from backend

### Network Error

- Error: "Registration failed"
- Generic error for network issues

## Code Files

### New Files

- `src/pages/auth/SignupPage.jsx` - Signup page component

### Modified Files

- `src/App.jsx` - Added signup route
- `src/pages/auth/LoginPage.jsx` - Added link to signup
- `PROJECT_SUMMARY.md` - Updated documentation

## Future Enhancements

- Email verification
- Password strength indicator
- Social login (Google, Facebook)
- Terms of service checkbox
- Privacy policy link
- CAPTCHA for bot prevention
- Username field (optional)
- Profile picture upload
