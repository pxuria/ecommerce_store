import axios from "axios";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN?.includes("/api")
  ? process.env.NEXT_PUBLIC_API_DOMAIN
  : process.env.NEXT_PUBLIC_API_DOMAIN + "/api";

const axiosInstance = axios.create({
  baseURL: API_DOMAIN,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
