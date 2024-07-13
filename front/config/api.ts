import axios from "axios";

// Create an Axios instance
export const API = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/`,
  timeout: 10000, // Optional: Set a timeout in milliseconds (10 seconds in this case)
});
