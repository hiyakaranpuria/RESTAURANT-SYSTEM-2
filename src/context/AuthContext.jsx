import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Token refresh interval (5 days - refresh before 7 day expiry)
const TOKEN_REFRESH_INTERVAL = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Setup axios interceptor for handling token expiration
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          const errorCode = error.response?.data?.code;

          // Handle token expiration
          if (errorCode === "TOKEN_EXPIRED" || errorCode === "INVALID_TOKEN") {
            console.log("Token expired or invalid, logging out...");
            handleLogout();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Auto-refresh token periodically
  useEffect(() => {
    if (isAuthenticated) {
      const refreshInterval = setInterval(() => {
        refreshToken();
      }, TOKEN_REFRESH_INTERVAL);

      return () => clearInterval(refreshInterval);
    }
  }, [isAuthenticated]);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      const tokenTimestamp = localStorage.getItem("tokenTimestamp");

      if (token) {
        // Check if token is too old (more than 7 days)
        if (tokenTimestamp) {
          const tokenAge = Date.now() - parseInt(tokenTimestamp);
          const sevenDays = 7 * 24 * 60 * 60 * 1000;

          if (tokenAge > sevenDays) {
            console.log("Token expired, clearing...");
            handleLogout();
            return;
          }
        }

        // Set token in axios headers
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Fetch user data
        await fetchUser();
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      handleLogout();
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/auth/me");

      // Handle both user and restaurant responses
      if (data.user) {
        setUser(data.user);
      } else if (data.restaurant) {
        setUser(data.restaurant);
      } else {
        setUser(data);
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error("Fetch user error:", error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const { data } = await axios.post("/api/auth/refresh");

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("tokenTimestamp", Date.now().toString());
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        console.log("Token refreshed successfully");
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      // Don't logout on refresh failure, token might still be valid
    }
  };

  const login = async (email, password, userType = "user") => {
    try {
      const endpoint =
        userType === "restaurant" ? "/api/restaurant/login" : "/api/auth/login";

      const { data } = await axios.post(endpoint, { email, password });

      // Store token with timestamp
      localStorage.setItem("token", data.token);
      localStorage.setItem("tokenTimestamp", Date.now().toString());
      localStorage.setItem("userType", userType);

      // Set axios header
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      // Set user data
      const userData = data.user || data.restaurant;
      setUser(userData);
      setIsAuthenticated(true);

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = useCallback(async () => {
    try {
      // Call logout endpoint (optional, for logging)
      await axios.post("/api/auth/logout").catch(() => {});
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      handleLogout();
    }
  }, []);

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem("token");
    localStorage.removeItem("tokenTimestamp");
    localStorage.removeItem("userType");
    localStorage.removeItem("restaurantId");

    // Clear axios header
    delete axios.defaults.headers.common["Authorization"];

    // Clear state
    setUser(null);
    setIsAuthenticated(false);
  };

  const setUserDirectly = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const tokenTimestamp = localStorage.getItem("tokenTimestamp");

    if (!token) return false;

    // Check token age
    if (tokenTimestamp) {
      const tokenAge = Date.now() - parseInt(tokenTimestamp);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;

      if (tokenAge > sevenDays) {
        handleLogout();
        return false;
      }
    }

    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated,
        setUserDirectly,
        checkAuth,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
