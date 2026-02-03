import axios from "axios";

// Unified production-safe config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
  (config) => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    if (admin && admin.token) {
      config.headers.Authorization = `Bearer ${admin.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Handle 401 & Network Errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Network Error:", error);
    }

    if (error.response && error.response.status === 401) {
      localStorage.removeItem("admin");
      if (window.location.pathname !== "/") {
        // Admin login usually at root or /login
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
