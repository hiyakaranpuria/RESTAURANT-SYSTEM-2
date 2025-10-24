import { Link } from "react-router-dom";

const RestaurantPendingPage = () => {
  const handleLogout = () => {
    localStorage.removeItem("restaurantToken");
    window.location.href = "/restaurant/login";
  };

  return (
    <div className="min-h-screen bg-background-light">
      <header className="bg-white border-b px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">
              store
            </span>
            <h1 className="text-xl font-bold">Restaurant Dashboard</h1>
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
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                <span className="material-symbols-outlined !text-5xl">
                  pending
                </span>
              </div>
            </div>

            <h1 className="text-3xl font-black mb-4">
              Application Under Review
            </h1>

            <p className="text-lg text-gray-700 mb-6">
              Your restaurant registration is currently being reviewed by our
              team.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8 text-left">
              <h2 className="font-bold text-lg mb-3">Current Status</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-green-600">
                    check_circle
                  </span>
                  <span>Application submitted</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-yellow-600">
                    pending
                  </span>
                  <span>Under review by admin</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gray-400">
                    radio_button_unchecked
                  </span>
                  <span className="text-gray-500">Approval pending</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Estimated Review Time:</span>{" "}
                2-3 business days
              </p>
              <p className="text-sm text-gray-700 mt-2">
                You'll receive an email notification once your application is
                reviewed.
              </p>
            </div>

            <div className="text-sm text-gray-600">
              <p>
                Questions? Contact us at{" "}
                <a
                  href="mailto:support@restaurant.com"
                  className="text-primary hover:underline"
                >
                  support@restaurant.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RestaurantPendingPage;
