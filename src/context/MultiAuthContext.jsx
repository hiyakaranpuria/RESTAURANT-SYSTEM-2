import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Token refresh interval (5 days - refresh before 7 day expiry)
const TOKEN_REFRESH_INTERVAL = 5 * 24 * 60 * 60 * 1000;

// Storage keys for different user types
const STORAGE_KEYS = {
  customer: {
    token: "customer_token",
    timestamp: "customer_token_timestamp",
    data: "customer_data",
  },
  restaurant: {
    token: "restaurant_token",
    timestamp: "restaurant_token_timestamp",
    data: "restaurant_data",
  },
  admin: {
    token: "admin_token",
    timestamp: "admin_token_timestamp",
    data: "admin_data",
  },
};

export const AuthProvider = ({ children }) => {
  const [sessions, setSessions] = useState({
    customer: { user: null, isAuthenticated: false },
    restaurant: { user: null, isAuthenticated: false },
    admin: { user: null, isAuthenticated: false },
  });
  const [loading, setLoading] = useState(true);
  const [currentSessionType, setCurrentSessionType] = useState(null);

  // Get current session based on context
  const getCurrentSession = useCallback(() => {
    if (currentSessionType) {
      return sessions[currentSessionType];
    }
    // Auto-detect based on available tokens
    if (sessions.restaurant.isAuthenticated) return sessions.restaurant;
    if (sessions.admin.isAuthenticated) return sessions.admin;
    if (sessions.customer.isAuthenticated) return sessions.customer;
    return { user: null, isAuthenticated: false };
  }, [sessions, currentSessionType]);

  // Setup axios interceptor for handling token expiration
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          const errorCode = error.response?.data?.code;

          if (errorCode === "TOKEN_EXPIRED" || errorCode === "INVALID_TOKEN") {
            console.log("Token expired or invalid, logging out...");
            // Determine which session to logout based on the request
            const authHeader = error.config?.headers?.Authorization;
            if (authHeader) {
              const token = authHeader.split(" ")[1];
              // Find which session this token belongs to
              Object.keys(STORAGE_KEYS).forEach((type) => {
                const storedToken = localStorage.getItem(
                  STORAGE_KEYS[type].token
                );
                if (storedToken === token) {
                  handleLogout(type);
                }
              });
            }
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Initialize all sessions on mount
  useEffect(() => {
    initializeAllSessions();
  }, []);

  // Auto-refresh tokens periodically
  useEffect(() => {
    const intervals = [];

    Object.keys(sessions).forEach((type) => {
      if (sessions[type].isAuthenticated) {
        const interval = setInterval(() => {
          refreshToken(type);
        }, TOKEN_REFRESH_INTERVAL);
        intervals.push(interval);
      }
    });

    return () => intervals.forEach((interval) => clearInterval(interval));
  }, [sessions]);

  const initializeAllSessions = async () => {
    try {
      console.log("[MultiAuth] Initializing sessions...");
      const newSessions = { ...sessions };
      let foundActiveSession = null;

      // Check each session type
      for (const type of Object.keys(STORAGE_KEYS)) {
        const token = localStorage.getItem(STORAGE_KEYS[type].token);
        const timestamp = localStorage.getItem(STORAGE_KEYS[type].timestamp);

        console.log(`[MultiAuth] Checking ${type} session:`, {
          hasToken: !!token,
        });

        if (token) {
          // Check if token is too old
          if (timestamp) {
            const tokenAge = Date.now() - parseInt(timestamp);
            const sevenDays = 7 * 24 * 60 * 60 * 1000;

            if (tokenAge > sevenDays) {
              console.log(`[MultiAuth] ${type} token expired, clearing...`);
              clearSession(type);
              continue;
            }
          }

          // Try to fetch user data
          try {
            console.log(`[MultiAuth] Fetching ${type} user data...`);
            const userData = await fetchUserData(type, token);
            if (userData) {
              console.log(`[MultiAuth] ${type} session restored:`, userData);
              newSessions[type] = {
                user: userData,
                isAuthenticated: true,
              };
              // Set the first found session as active
              if (!foundActiveSession) {
                foundActiveSession = type;
              }
            }
          } catch (error) {
            console.error(`[MultiAuth] Failed to fetch ${type} user:`, error);
            clearSession(type);
          }
        }
      }

      console.log("[MultiAuth] Final sessions:", newSessions);
      setSessions(newSessions);

      // Set current session type if we found an active session
      if (foundActiveSession) {
        console.log(
          `[MultiAuth] Setting current session to: ${foundActiveSession}`
        );
        setCurrentSessionType(foundActiveSession);
      }
    } catch (error) {
      console.error("[MultiAuth] Session initialization error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (type, token) => {
    try {
      const endpoint =
        type === "restaurant" ? "/api/restaurant/me" : "/api/auth/me";

      console.log(`[MultiAuth] Fetching from ${endpoint} with token`);

      const { data } = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(`[MultiAuth] Received data for ${type}:`, data);

      // Handle different response formats
      if (data.user) return data.user;
      if (data.restaurant) return data.restaurant;
      return data;
    } catch (error) {
      console.error(
        `[MultiAuth] Error fetching ${type} data:`,
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const refreshToken = async (type) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS[type].token);
      if (!token) return;

      const { data } = await axios.post(
        "/api/auth/refresh",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.token) {
        localStorage.setItem(STORAGE_KEYS[type].token, data.token);
        localStorage.setItem(
          STORAGE_KEYS[type].timestamp,
          Date.now().toString()
        );
        console.log(`${type} token refreshed successfully`);
      }
    } catch (error) {
      console.error(`${type} token refresh failed:`, error);
    }
  };

  const login = async (email, password, type = "customer") => {
    try {
      console.log(`[MultiAuth] Logging in as ${type}...`);
      let endpoint = "/api/auth/login";
      if (type === "restaurant") endpoint = "/api/restaurant/login";

      const { data } = await axios.post(endpoint, { email, password });
      console.log(`[MultiAuth] Login successful for ${type}`, data);

      // Store token with type-specific key
      localStorage.setItem(STORAGE_KEYS[type].token, data.token);
      localStorage.setItem(STORAGE_KEYS[type].timestamp, Date.now().toString());

      // Get user data
      const userData = data.user || data.restaurant;
      localStorage.setItem(STORAGE_KEYS[type].data, JSON.stringify(userData));

      // Update session
      setSessions((prev) => {
        const newSessions = {
          ...prev,
          [type]: {
            user: userData,
            isAuthenticated: true,
          },
        };
        console.log(`[MultiAuth] Sessions updated:`, newSessions);
        return newSessions;
      });

      setCurrentSessionType(type);
      console.log(`[MultiAuth] Current session type set to: ${type}`);

      return data;
    } catch (error) {
      console.error(`[MultiAuth] ${type} login error:`, error);
      throw error;
    }
  };

  const logout = useCallback(async (type) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS[type].token);
      if (token) {
        await axios
          .post(
            "/api/auth/logout",
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .catch(() => {});
      }
    } catch (error) {
      console.error(`${type} logout API error:`, error);
    } finally {
      handleLogout(type);
    }
  }, []);

  const handleLogout = (type) => {
    clearSession(type);

    setSessions((prev) => ({
      ...prev,
      [type]: {
        user: null,
        isAuthenticated: false,
      },
    }));

    if (currentSessionType === type) {
      setCurrentSessionType(null);
    }
  };

  const clearSession = (type) => {
    localStorage.removeItem(STORAGE_KEYS[type].token);
    localStorage.removeItem(STORAGE_KEYS[type].timestamp);
    localStorage.removeItem(STORAGE_KEYS[type].data);
  };

  const switchSession = (type) => {
    if (sessions[type].isAuthenticated) {
      setCurrentSessionType(type);
      return true;
    }
    return false;
  };

  const checkAuth = (type) => {
    const token = localStorage.getItem(STORAGE_KEYS[type].token);
    const timestamp = localStorage.getItem(STORAGE_KEYS[type].timestamp);

    if (!token) return false;

    if (timestamp) {
      const tokenAge = Date.now() - parseInt(timestamp);
      const sevenDays = 7 * 24 * 60 * 1000;

      if (tokenAge > sevenDays) {
        handleLogout(type);
        return false;
      }
    }

    return true;
  };

  const getToken = (type) => {
    return localStorage.getItem(STORAGE_KEYS[type].token);
  };

  // Set axios default header based on current session
  useEffect(() => {
    if (currentSessionType) {
      const token = getToken(currentSessionType);
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        console.log(`[MultiAuth] Set axios header for ${currentSessionType}`);
      }
    } else {
      // If no current session, try to find an active one
      const activeType = Object.keys(sessions).find(
        (type) => sessions[type].isAuthenticated
      );
      if (activeType) {
        const token = getToken(activeType);
        if (token) {
          setCurrentSessionType(activeType);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          console.log(`[MultiAuth] Auto-set axios header for ${activeType}`);
        }
      }
    }
  }, [currentSessionType, sessions]);

  const currentSession = getCurrentSession();

  // Debug logging
  useEffect(() => {
    console.log("[MultiAuth] Sessions state:", sessions);
    console.log(
      "[MultiAuth] isRestaurantAuthenticated:",
      sessions.restaurant.isAuthenticated
    );
    console.log(
      "[MultiAuth] isCustomerAuthenticated:",
      sessions.customer.isAuthenticated
    );
  }, [sessions]);

  return (
    <AuthContext.Provider
      value={{
        // Current session (for backward compatibility)
        user: currentSession.user,
        isAuthenticated: currentSession.isAuthenticated,
        loading,

        // Multi-session support
        sessions,
        currentSessionType,
        switchSession,

        // Auth methods
        login,
        logout,
        checkAuth,
        refreshToken,
        getToken,

        // Session-specific getters
        getCustomerSession: () => sessions.customer,
        getRestaurantSession: () => sessions.restaurant,
        getAdminSession: () => sessions.admin,

        // Check if specific session is active
        isCustomerAuthenticated: sessions.customer.isAuthenticated,
        isRestaurantAuthenticated: sessions.restaurant.isAuthenticated,
        isAdminAuthenticated: sessions.admin.isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
