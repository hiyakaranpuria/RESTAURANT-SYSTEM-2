# Restaurant QR Menu - Landing Page

This is the landing page for the Restaurant QR Menu System built with Next.js 16 and shadcn/ui.

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed
- pnpm installed (or use npm/yarn)

### Installation

1. Navigate to the Landing_page directory:

```bash
cd Landing_page
```

2. Install dependencies:

```bash
pnpm install
# or
npm install
```

3. Run the development server:

```bash
pnpm dev
# or
npm run dev
```

The landing page will be available at **http://localhost:3001** (Next.js default port)

## 🔗 Integration with Main App

The landing page redirects to your main React app running on `http://localhost:3000`:

- **"Get Started Free"** button → `http://localhost:3000/restaurant/signup`
- **"Log in"** button → `http://localhost:3000/restaurant/login`
- **"Start Free Trial"** button → `http://localhost:3000/restaurant/signup`
- **"Schedule a Demo"** button → `http://localhost:3000/restaurant/login`

## 📦 Running Both Apps

### Terminal 1 - Main React App (Port 3000):

```bash
# From project root
npm run dev
```

### Terminal 2 - Landing Page (Port 3001):

```bash
# From project root
cd Landing_page
pnpm dev
```

### Terminal 3 - Backend Server (Port 5000):

```bash
# From project root
npm run server
```

## 🎨 Features

- Modern, responsive design with shadcn/ui components
- Dark mode support
- Smooth animations and transitions
- SEO-friendly structure
- Mobile-first approach

## 🛠️ Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons

## 📝 Customization

To customize the landing page:

1. Edit `app/page.tsx` for content changes
2. Modify `app/globals.css` for global styles
3. Update components in `components/ui/` for UI changes

## 🌐 Deployment

To build for production:

```bash
pnpm build
pnpm start
```

The landing page can be deployed to:

- Vercel (recommended for Next.js)
- Netlify
- Any Node.js hosting platform

## 📄 License

MIT
