import { Link } from "react-router-dom";
import { useAuth } from "../context/MultiAuthContext";

const HomePage = () => {
  const { sessions, logout } = useAuth();

  // Get any active session for display
  const user =
    sessions.customer.user || sessions.restaurant.user || sessions.admin.user;
  const userType = sessions.customer.isAuthenticated
    ? "customer"
    : sessions.restaurant.isAuthenticated
    ? "restaurant"
    : sessions.admin.isAuthenticated
    ? "admin"
    : null;

  const handleLogout = () => {
    // Logout from all sessions
    if (sessions.customer.isAuthenticated) logout("customer");
    if (sessions.restaurant.isAuthenticated) logout("restaurant");
    if (sessions.admin.isAuthenticated) logout("admin");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {user && (
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Logged in as: <span className="font-semibold">{user.email}</span>{" "}
              ({user.role})
            </p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-600 text-white">
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-5xl font-black text-gray-900 mb-4">
            Restaurant QR Menu System
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Digital menu ordering made simple
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Customer Login */}
            <Link
              to="/login"
              className="bg-white rounded-xl shadow-lg p-8 hover-lift animate-fadeIn"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Customer Login</h3>
              <p className="text-gray-600 text-sm">
                Sign in to view order history
              </p>
            </Link>

            {/* Restaurant Login */}
            <Link
              to="/restaurant/login"
              className="bg-white rounded-xl shadow-lg p-8 hover-lift animate-fadeIn"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Restaurant Login</h3>
              <p className="text-gray-600 text-sm">
                Manage your menu and orders
              </p>
            </Link>

            {/* Admin Login */}
            <Link
              to="/admin/login"
              className="bg-white rounded-xl shadow-lg p-8 hover-lift animate-fadeIn"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Admin Login</h3>
              <p className="text-gray-600 text-sm">
                Verify and manage restaurants
              </p>
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">New Restaurant?</h2>
            <p className="text-gray-600 mb-6">
              Register your restaurant to start accepting digital orders
            </p>
            <Link
              to="/restaurant/signup"
              className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Register Restaurant
            </Link>
          </div>

          <div className="mt-8 text-center">
            <Link to="/signup" className="text-gray-600 hover:text-gray-900">
              New customer? Sign up here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
