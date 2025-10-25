import { useEffect, useCallback } from "react";
import { useAuth } from "../context/MultiAuthContext";
import { useNavigate } from "react-router-dom";

/**
 * Hook to manage user session
 * - Handles token expiration
 * - Auto-refresh tokens
 * - Detects inactivity
 * - Handles tab visibility
 */
export const useSessionManagement = () => {
  const { checkAuth, logout, refreshToken, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Check auth status periodically
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkInterval = setInterval(() => {
      const isValid = checkAuth();
      if (!isValid) {
        console.log("Session expired");
        logout();
        navigate("/login", { replace: true });
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [isAuthenticated, checkAuth, logout, navigate]);

  // Handle page visibility (refresh when user comes back)
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // User came back to the tab, check auth
        const isValid = checkAuth();
        if (!isValid) {
          console.log("Session expired while away");
          logout();
          navigate("/login", { replace: true });
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAuthenticated, checkAuth, logout, navigate]);

  // Handle browser back/forward
  useEffect(() => {
    if (!isAuthenticated) return;

    const handlePopState = () => {
      // Check auth when navigating with browser buttons
      const isValid = checkAuth();
      if (!isValid) {
        console.log("Session expired");
        logout();
        navigate("/login", { replace: true });
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isAuthenticated, checkAuth, logout, navigate]);

  // Handle before unload (optional: warn user)
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleBeforeUnload = (e) => {
      // Optional: Warn user before closing tab
      // Uncomment if you want this behavior
      // e.preventDefault();
      // e.returnValue = '';
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isAuthenticated]);

  return {
    checkAuth,
    logout,
    refreshToken,
  };
};
