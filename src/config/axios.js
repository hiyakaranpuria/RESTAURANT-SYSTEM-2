import axios from "axios";

// Set default base URL for axios
// In development, Vite proxy will handle /api requests
// In production, you'll need to set VITE_API_URL environment variable
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "";

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    // Add restaurant token if exists
    const restaurantToken = localStorage.getItem("restaurant_token");
    if (restaurantToken) {
      config.headers.Authorization = `Bearer ${restaurantToken}`;
    }

    // Add admin token if exists
    const adminToken = localStorage.getItem("admin_token");
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }

    // Add customer token if exists
    const customerToken = localStorage.getItem("customer_token");
    if (customerToken) {
      config.headers.Authorization = `Bearer ${customerToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - could redirect to login
      console.error("Unauthorized request");
    }
    return Promise.reject(error);
  }
);

export default axios;
