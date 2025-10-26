import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../context/MultiAuthContext";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { isCustomerAuthenticated, getCustomerSession, logout } = useAuth();

  const user = getCustomerSession().user;

  // Redirect if not authenticated as customer
  useEffect(() => {
    if (!isCustomerAuthenticated) {
      navigate("/login");
    }
  }, [isCustomerAuthenticated, navigate]);

  const handleLogout = () => {
    logout("customer");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <header className="bg-white border-b px-4 py-3 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-red-600 rounded-full flex items-center justify-center text-white">
              <svg
                className="w-6 h-6"
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
            <h1 className="text-xl font-bold">Restaurant QR Menu</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
                <svg
                  className="w-12 h-12"
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
            <h1 className="text-4xl font-black mb-4">Welcome, {user?.name}!</h1>
            <p className="text-xl text-gray-600">
              Your account is ready. Start ordering by scanning a QR code at any
              restaurant.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">How to Order</h2>
              <button
                onClick={() => navigate('/customer/orders')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Order History
              </button>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Scan the QR Code
                  </h3>
                  <p className="text-gray-600">
                    Find the QR code on your table and scan it with your phone
                    camera
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Browse the Menu
                  </h3>
                  <p className="text-gray-600">
                    Explore delicious menu items and add your favorites to the
                    cart
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Place Your Order
                  </h3>
                  <p className="text-gray-600">
                    Review your cart and place your order directly from your
                    phone
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Track Your Order
                  </h3>
                  <p className="text-gray-600">
                    Watch your order progress from placed to ready for pickup
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-red-900 mb-1">
                  No QR Code Needed to Sign Up
                </h3>
                <p className="text-red-800 text-sm">
                  You don't need to be logged in to order! Simply scan any
                  table's QR code to start ordering. Your account allows you to
                  view order history and save preferences (coming soon).
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
