import axios from "axios";

export const Axios = axios.create({
  baseURL: "https://document-editor-80fc.onrender.com",
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
  },
});

// Set Authorization header dynamically
Axios.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

Axios.interceptors.response.use(
  (response) => {
    console.log(response);
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const { data } = await Axios.get("/auth/refresh-token");
        if (data?.token && typeof window !== "undefined") {
          localStorage.setItem("accessToken", data?.token);
          error.config.headers.Authorization = `Bearer ${data?.token}`;
          return axios(error.config);
        }
      } catch (refreshError) {
        console.log("Error Refreshing token", refreshError);
      }
    }
    return Promise.reject(error);
  }
);
