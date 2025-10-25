import { Navigate } from "react-router-dom";
import { useAuth } from "../context/MultiAuthContext";

const ProtectedRoute = ({ children, roles = [], sessionType = "customer" }) => {
  const { sessions, loading } = useAuth();

  const session = sessions[sessionType];
  const user = session?.user;
  const isAuthenticated = session?.isAuthenticated;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner mx-auto"></div>
        <p className="ml-3">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    const loginPath =
      sessionType === "restaurant"
        ? "/restaurant/login"
        : sessionType === "admin"
        ? "/admin/login"
        : "/login";
    return <Navigate to={loginPath} replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
