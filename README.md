# 🛍️ ShopDash — Authentication-Based E-Commerce Dashboard

A fully responsive E-Commerce web application built with React, featuring secure authentication, product browsing, cart management, and user profile editing — all without a backend.

---

## 🚀 Live Demo

🔗 [https://e-commerce-dashboard-six-omega.vercel.app](https://e-commerce-dashboard-six-omega.vercel.app)

---

## ✨ Features

### 🔐 Authentication
- User Registration with Name, Email & Password
- Login with credential validation
- Invalid login error messages via toast notifications
- User data stored securely in `localStorage`

### ⏱️ Session Management
- Time-bound session valid for **5 minutes** after login
- Live session countdown timer with color warning
- Auto-logout when session expires
- Session expiry checked on every protected route

### 📊 Dashboard
- Personalized welcome message with user's name
- Time-based greeting (Good morning / afternoon / evening)
- Live stats — cart count, cart total, unique products
- Quick action cards to navigate the app
- Recent cart items preview

### 🛒 Products
- Fetches 190+ real products from [DummyJSON API](https://dummyjson.com)
- Infinite scroll — loads 12 products at a time automatically
- Responsive product grid (1 → 2 → 3 → 4 columns)
- Search products by name (debounced)
- Filter by 20+ categories
- Sort by price (low/high) or top rated
- Skeleton loading cards while fetching
- Graceful error handling if API fails
- Star ratings displayed on each card

### 🧺 Cart Management
- Add products to cart
- Duplicate item prevention
- Increase / decrease quantity
- Remove individual items or clear all
- Item-level subtotal
- Shipping logic (free over $50)
- Tax calculation (8%)
- Grand total summary
- Cart persisted to `localStorage` per user

### 👤 User Profile
- View name, email, password
- Edit name and email with validation
- Change password (requires current password verification)
- Password strength indicator on Register page

### 🎨 UI & UX
- Fully responsive — mobile, tablet, desktop
- Dark / Light mode toggle
- Clean modern design with Tailwind CSS
- Toast notifications for all user actions
- Empty states with helpful CTAs
- Loading skeletons on product fetch
- Active route highlighting in Navbar

---

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| React 19 + Vite | Frontend framework & build tool |
| React Router v7 | Client-side routing & protected routes |
| Tailwind CSS v4 | Utility-first styling |
| React Hot Toast | Toast notifications |
| DummyJSON API | Product data source (190+ products) |
| LocalStorage | Auth & cart persistence |
| Lucide React | Icons |

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Sticky navbar with cart badge & theme toggle
│   └── SessionTimer.jsx    # Live session countdown component
├── context/
│   ├── AuthContext.jsx     # Auth state, login, register, session expiry
│   └── CartContext.jsx     # Cart state, add/remove/update items
├── hooks/
│   └── useAuth.js          # Custom hook for auth context
├── pages/
│   ├── Login.jsx           # Login page
│   ├── Register.jsx        # Registration with password strength
│   ├── Dashboard.jsx       # Main dashboard with stats
│   ├── Products.jsx        # Product listing with infinite scroll & filters
│   ├── Cart.jsx            # Cart with quantity controls & summary
│   └── Profile.jsx         # View & edit user profile
├── routes/
│   └── ProtectedRoute.jsx  # Guards all authenticated routes
└── App.jsx                 # Root component with all providers & routes
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/devparmar/e-commerce-dashboard.git

# 2. Navigate into the project
cd e-commerce-dashboard

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

---

## 🔒 How Authentication Works

1. **Register** — fills form → data saved to `localStorage` under `users[]`
2. **Login** — credentials matched → session created with 5-minute expiry timestamp
3. **Protected Routes** — `ProtectedRoute.jsx` checks for valid, non-expired session on every navigation
4. **Auto Logout** — `setTimeout` fires when session expires and redirects to login
5. **Refresh Safety** — expiry is checked on app load; expired sessions are cleared immediately

---

## 🌟 Bonus Features

- ✅ Infinite product scroll (IntersectionObserver, 12 products per batch)
- ✅ Product search, category filter & sort
- ✅ Dark / Light mode toggle
- ✅ Toast notifications throughout
- ✅ Cart persisted on page refresh
- ✅ Custom hooks (`useAuth`, `useCart`)
- ✅ Password strength meter on register
- ✅ Free shipping threshold indicator

---

## 📸 Pages Overview

| Page | Route | Access |
|---|---|---|
| Login | `/login` | Public |
| Register | `/register` | Public |
| Dashboard | `/dashboard` | Protected |
| Products | `/products` | Protected |
| Cart | `/cart` | Protected |
| Profile | `/profile` | Protected |

---

## 👨‍💻 Author

**Dev Parmar**

> Built as a React internship practical task demonstrating authentication flows, protected routing, API integration, state management, and responsive UI design.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
