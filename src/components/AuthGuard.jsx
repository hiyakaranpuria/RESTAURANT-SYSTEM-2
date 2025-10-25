import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/MultiAuthContext";

// Component to handle auth logic on login pages
export const LoginPageGuard = ({ children, sessionType = "customer" }) => {
  const { sessions, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Determine which session type based on route
    let type = sessionType;
    if (location.pathname.includes("/restaurant")) {
      type = "restaurant";
    } else if (location.pathname.includes("/admin")) {
      type = "admin";
    }

    // If that specific session is authenticated, log it out
    if (sessions[type]?.isAuthenticated) {
      console.log(
        `${type} already authenticated, logging out for fresh login...`
      );
      logout(type);
    }
  }, [sessions, logout, location.pathname, sessionType]);

  return children;
};

// Component to protect routes that require authentication
export const ProtectedRoute = ({
  children,
  requiredRole,
  sessionType = "customer",
}) => {
  const { sessions, loading, checkAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = sessions[sessionType]?.isAuthenticated;
  const user = sessions[sessionType]?.user;

  useEffect(() => {
    // Check auth status
    const isValid = checkAuth(sessionType);

    if (!loading && (!isAuthenticated || !isValid)) {
      // Save the attempted URL to redirect after login
      const from = location.pathname + location.search;
      const loginPath =
        sessionType === "restaurant"
          ? "/restaurant/login"
          : sessionType === "admin"
          ? "/admin/login"
          : "/login";
      navigate(loginPath, { state: { from }, replace: true });
    }
  }, [isAuthenticated, loading, navigate, location, checkAuth, sessionType]);

  useEffect(() => {
    // Check role if required
    if (!loading && isAuthenticated && requiredRole) {
      if (user?.role !== requiredRole && !user?.restaurantName) {
        console.log("Insufficient permissions");
        navigate("/", { replace: true });
      }
    }
  }, [isAuthenticated, user, requiredRole, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
};

// Component to redirect authenticated users away from public pages
export const PublicRoute = ({
  children,
  redirectTo = "/",
  sessionType = "customer",
}) => {
  const { sessions, loading } = useAuth();
  const navigate = useNavigate();

  const isAuthenticated = sessions[sessionType]?.isAuthenticated;

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, redirectTo]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
};
