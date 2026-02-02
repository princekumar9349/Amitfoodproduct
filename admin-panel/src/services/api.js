import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Backend URL
});

// Add a request interceptor to attach the token
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

export default api;
