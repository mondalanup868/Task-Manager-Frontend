import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5000",
  baseURL: "https://task-manager-backend-zxw4.onrender.com",
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
