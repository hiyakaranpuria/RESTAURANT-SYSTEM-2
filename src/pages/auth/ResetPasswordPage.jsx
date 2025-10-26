import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get email from session storage
    const savedEmail = sessionStorage.getItem("resetEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required. Please go back to forgot password page.");
      return;
    }

    if (!token) {
      setError("Reset code is required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/auth/reset-password", {
        token,
        password,
        email,
      });

      // Clear session storage
      sessionStorage.removeItem("resetEmail");

      // Show success and redirect to login
      alert("Password reset successful! Please login with your new password.");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to reset password. The code may have expired or is invalid."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-xl shadow-lg">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="material-symbols-outlined !text-4xl">
              lock_reset
            </span>
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-3xl font-black">Reset Password</p>
          <p className="text-gray-600 text-base mt-2">
            Enter your new password below
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
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="token">
              Reset Code
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 bg-white h-12 px-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-lg tracking-wider"
              id="token"
              type="text"
              placeholder="Enter 6-digit code"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              maxLength={6}
              required
            />
            <p className="text-xs text-gray-500">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="password">
              New Password
            </label>
            <div className="relative">
              <input
                className="w-full rounded-lg border border-gray-300 bg-white h-12 px-4 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
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

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <input
                className="w-full rounded-lg border border-gray-300 bg-white h-12 px-4 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 cursor-pointer"
              >
                <span className="material-symbols-outlined !text-xl">
                  {showConfirmPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
            <p className="font-medium mb-1">Password requirements:</p>
            <ul className="list-disc list-inside text-xs space-y-1">
              <li>At least 6 characters long</li>
              <li>Include letters and numbers (recommended)</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white rounded-lg h-12 px-6 text-base font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm text-gray-600 hover:text-primary flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined !text-lg">
              arrow_back
            </span>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
