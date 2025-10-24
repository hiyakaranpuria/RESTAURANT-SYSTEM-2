# Authentication Pages

## Login Page (`/login`)

### Layout

```
┌─────────────────────────────────────┐
│                                     │
│         🍽️ Restaurant Icon          │
│                                     │
│         Welcome Back                │
│      Sign in to your account        │
│                                     │
│  Email                              │
│  ┌───────────────────────────────┐  │
│  │ e.g., yourname@restaurant.com │  │
│  └───────────────────────────────┘  │
│                                     │
│  Password                           │
│  ┌───────────────────────────────┐  │
│  │ Enter your password        👁️ │  │
│  └───────────────────────────────┘  │
│                                     │
│              Forgot your password?  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │          Login                │  │
│  └───────────────────────────────┘  │
│                                     │
│    Don't have an account? Sign up   │
│                                     │
└─────────────────────────────────────┘
```

### Features

- Email input field
- Password input field with visibility toggle
- "Forgot password" link
- Login button
- Link to signup page

---

## Signup Page (`/signup`)

### Layout

```
┌─────────────────────────────────────┐
│                                     │
│         🍽️ Restaurant Icon          │
│                                     │
│         Create Account              │
│       Sign up to get started        │
│                                     │
│  Full Name                          │
│  ┌───────────────────────────────┐  │
│  │ e.g., John Doe                │  │
│  └───────────────────────────────┘  │
│                                     │
│  Email                              │
│  ┌───────────────────────────────┐  │
│  │ e.g., yourname@example.com    │  │
│  └───────────────────────────────┘  │
│                                     │
│  Password                           │
│  ┌───────────────────────────────┐  │
│  │ Create a password          👁️ │  │
│  └───────────────────────────────┘  │
│                                     │
│  Confirm Password                   │
│  ┌───────────────────────────────┐  │
│  │ Confirm your password      👁️ │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │         Sign Up               │  │
│  └───────────────────────────────┘  │
│                                     │
│   Already have an account? Sign in  │
│                                     │
└─────────────────────────────────────┘
```

### Features

- Full name input field
- Email input field
- Password input field with visibility toggle
- Confirm password input field with visibility toggle
- Password validation (min 6 characters)
- Password match validation
- Sign up button
- Link to login page

---

## Design Consistency

### Shared Elements

- ✅ Same background color (#f6f8f6)
- ✅ Same card styling (white, rounded, shadow)
- ✅ Same icon (restaurant_menu)
- ✅ Same primary color (#17cf17)
- ✅ Same font (Epilogue)
- ✅ Same input field styling
- ✅ Same button styling
- ✅ Same error message styling
- ✅ Same link styling

### Color Palette

- **Primary Green**: #17cf17
- **Background**: #f6f8f6
- **Card Background**: #ffffff
- **Text**: #333333
- **Gray Text**: #6b7280
- **Border**: #d1d5db
- **Error**: #ef4444

### Typography

- **Heading**: 3xl, font-black (900)
- **Subheading**: base, text-gray-600
- **Labels**: sm, font-medium
- **Inputs**: base
- **Links**: sm, font-medium, text-primary

### Spacing

- **Card Padding**: 8-10 (2rem-2.5rem)
- **Form Gap**: 6 (1.5rem)
- **Field Gap**: 2 (0.5rem)
- **Icon Size**: 16 (4rem)
- **Input Height**: 12 (3rem)
- **Button Height**: 12 (3rem)

---

## User Experience Flow

### New User Journey

1. Lands on login page
2. Sees "Don't have an account? Sign up"
3. Clicks "Sign up" link
4. Fills signup form
5. Creates account
6. Automatically logged in
7. Redirected to appropriate page

### Returning User Journey

1. Lands on signup page (or clicks signup from login)
2. Sees "Already have an account? Sign in"
3. Clicks "Sign in" link
4. Fills login form
5. Logs in
6. Redirected based on role

---

## Validation Messages

### Login Page

- "Invalid credentials" - Wrong email/password
- "No token provided" - Session expired
- "User not found" - Account doesn't exist

### Signup Page

- "Passwords do not match" - Confirmation mismatch
- "Password must be at least 6 characters" - Too short
- "User already exists" - Email taken
- "Registration failed" - Network/server error

---

## Accessibility

Both pages include:

- Proper label associations
- Required field indicators
- Error message announcements
- Keyboard navigation support
- Focus states on inputs
- Clear visual feedback
- Readable font sizes
- Sufficient color contrast

---

## Mobile Responsiveness

Both pages are fully responsive:

- Single column layout
- Touch-friendly input sizes
- Adequate spacing for mobile
- Readable text on small screens
- Full-width buttons
- Proper viewport scaling
