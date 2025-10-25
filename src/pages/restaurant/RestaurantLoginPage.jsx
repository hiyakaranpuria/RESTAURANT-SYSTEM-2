import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/MultiAuthContext";
import { LoginPageGuard } from "../../components/AuthGuard";

const RestaurantLoginPageContent = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email, password, "restaurant");

      // Store restaurant ID for later use
      localStorage.setItem("restaurantId", data.restaurant._id);

      // Redirect based on verification status
      if (data.restaurant.verificationStatus === "pending") {
        navigate("/restaurant/pending");
      } else if (data.restaurant.verificationStatus === "approved") {
        navigate("/restaurant/dashboard");
      } else if (data.restaurant.verificationStatus === "rejected") {
        navigate("/restaurant/rejected");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-xl shadow-lg">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="material-symbols-outlined !text-4xl">store</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-3xl font-black">Restaurant Login</p>
          <p className="text-gray-600 text-base mt-1">
            Sign in to manage your restaurant
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 bg-white h-12 px-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
              id="email"
              type="email"
              placeholder="owner@restaurant.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                className="w-full rounded-lg border border-gray-300 bg-white h-12 px-4 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 cursor-pointer"
              >
                <span className="material-symbols-outlined !text-xl">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white rounded-lg h-12 px-6 text-base font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/restaurant/signup"
              className="text-primary font-medium hover:underline"
            >
              Register your restaurant
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Are you a customer?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Customer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const RestaurantLoginPage = () => {
  return (
    <LoginPageGuard>
      <RestaurantLoginPageContent />
    </LoginPageGuard>
  );
};

export default RestaurantLoginPage;
