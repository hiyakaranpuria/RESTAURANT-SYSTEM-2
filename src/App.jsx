import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/MultiAuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Home Page
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";

// Customer Pages
import MenuPage from "./pages/customer/MenuPage";
import CartPage from "./pages/customer/CartPage";
import OrderStatusPage from "./pages/customer/OrderStatusPage";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CheckoutPage from "./pages/customer/CheckoutPage";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import UserSignupPage from "./pages/auth/UserSignupPage";
import AdminLoginPage from "./pages/auth/AdminLoginPage";

// Restaurant Pages
import RestaurantSignupPage from "./pages/restaurant/RestaurantSignupPage";
import RestaurantLoginPage from "./pages/restaurant/RestaurantLoginPage";
import RestaurantSuccessPage from "./pages/restaurant/RestaurantSuccessPage";
import RestaurantPendingPage from "./pages/restaurant/RestaurantPendingPage";
import RestaurantDashboard from "./pages/restaurant/RestaurantDashboard";
import RestaurantOrdersPage from "./pages/restaurant/RestaurantOrdersPage";

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
            <Route path="/m/:restaurantId" element={<MenuPage />} />
            <Route path="/checkout/:restaurantId" element={<CheckoutPage />} />
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
              element={<RestaurantDashboard />}
            />
            <Route
              path="/restaurant/orders"
              element={<RestaurantOrdersPage />}
            />

            {/* Staff Routes */}
            <Route
              path="/staff/orders"
              element={
                <ProtectedRoute roles={["staff", "admin"]} sessionType="admin">
                  <OrderQueuePage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/menu"
              element={
                <ProtectedRoute roles={["admin"]} sessionType="admin">
                  <MenuManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/tables"
              element={
                <ProtectedRoute roles={["admin"]} sessionType="admin">
                  <TablesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/restaurants"
              element={
                <ProtectedRoute roles={["admin"]} sessionType="admin">
                  <RestaurantVerificationPage />
                </ProtectedRoute>
              }
            />

            {/* Home Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
