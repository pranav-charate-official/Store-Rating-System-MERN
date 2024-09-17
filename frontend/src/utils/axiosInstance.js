import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
   baseURL: "http://localhost:5000/api",
   headers: {
      "Content-Type": "application/json",
   },
});

// Add a request interceptor to attach the token
axiosInstance.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
   },
   (error) => {
      return Promise.reject(error);
   }
);

export default axiosInstance;
