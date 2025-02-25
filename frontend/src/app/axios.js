import axios from "axios";

export const Axios = axios.create({
  baseURL: "https://document-editor-80fc.onrender.com",
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
    Authorization:
      localStorage?.getItem("accessToken") &&
      `Bearer ${localStorage?.getItem("accessToken")}`,
  },
});

Axios.interceptors.response.use(
  (response) => {
    console.log(response);
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      try {
        const { data } = await Axios.get("/auth/refresh-token");
        localStorage.setItem("accessToken", data?.token);

        if (data?.token) {
          error.config.headers.Authorization = `Bearer ${data?.token}`;
          return axios(error.config);
        }
      } catch (error) {
        console.log("Error Refreshing token");
      }
    }
  }
);
