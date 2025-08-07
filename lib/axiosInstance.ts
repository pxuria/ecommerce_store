import axios from "axios";

console.log(process.env.NEXT_PUBLIC_API_DOMAIN);
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_DOMAIN,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
