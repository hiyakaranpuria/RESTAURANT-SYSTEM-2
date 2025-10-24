import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Home Page
import HomePage from "./pages/HomePage";

// Customer Pages
import MenuPage from "./pages/customer/MenuPage";
import CartPage from "./pages/customer/CartPage";
import OrderStatusPage from "./pages/customer/OrderStatusPage";
import CustomerDashboard from "./pages/customer/CustomerDashboard";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import UserSignupPage from "./pages/auth/UserSignupPage";
import AdminLoginPage from "./pages/auth/AdminLoginPage";

// Restaurant Pages
import RestaurantSignupPage from "./pages/restaurant/RestaurantSignupPage";
import RestaurantLoginPage from "./pages/restaurant/RestaurantLoginPage";
import RestaurantSuccessPage from "./pages/restaurant/RestaurantSuccessPage";
import RestaurantPendingPage from "./pages/restaurant/RestaurantPendingPage";

// Staff Pages
import OrderQueuePage from "./pages/staff/OrderQueuePage";

// Admin Pages
import MenuManagementPage from "./pages/admin/MenuManagementPage";
import TablesPage from "./pages/admin/TablesPage";
import RestaurantVerificationPage from "./pages/admin/RestaurantVerificationPage";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Customer Routes */}
            <Route path="/m/:qrSlug" element={<MenuPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/order/:orderId" element={<OrderStatusPage />} />
            <Route path="/dashboard" element={<CustomerDashboard />} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<UserSignupPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Restaurant Routes */}
            <Route
              path="/restaurant/signup"
              element={<RestaurantSignupPage />}
            />
            <Route path="/restaurant/login" element={<RestaurantLoginPage />} />
            <Route
              path="/restaurant/success"
              element={<RestaurantSuccessPage />}
            />
            <Route
              path="/restaurant/pending"
              element={<RestaurantPendingPage />}
            />
            <Route
              path="/restaurant/dashboard"
              element={<MenuManagementPage />}
            />

            {/* Staff Routes */}
            <Route
              path="/staff/orders"
              element={
                <ProtectedRoute roles={["staff", "admin"]}>
                  <OrderQueuePage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/menu"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <MenuManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/tables"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <TablesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/restaurants"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <RestaurantVerificationPage />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
