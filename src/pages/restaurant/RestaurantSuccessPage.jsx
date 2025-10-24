import { Link } from "react-router-dom";

const RestaurantSuccessPage = () => {
  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white p-8 sm:p-12 rounded-xl shadow-lg text-center">
        <div className="flex justify-center mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
            <span className="material-symbols-outlined !text-5xl">
              check_circle
            </span>
          </div>
        </div>

        <h1 className="text-3xl font-black mb-4">Application Submitted!</h1>

        <p className="text-lg text-gray-700 mb-6">
          Thank you for registering your restaurant with us.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
          <h2 className="font-bold text-lg mb-3">What happens next?</h2>
          <ol className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              <span>
                Our team will review your application and verify your documents
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              <span>
                You'll receive an email notification once your application is
                reviewed (usually within 2-3 business days)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </span>
              <span>
                Once approved, you can login and start managing your restaurant
              </span>
            </li>
          </ol>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Application Status:</span> Pending
            Review
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/restaurant/login"
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90"
          >
            Go to Login
          </Link>
          <Link
            to="/"
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-600">
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
  );
};

export default RestaurantSuccessPage;
