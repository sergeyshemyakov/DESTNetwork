import axios from "axios";

// Create an Axios instance
export const API = axios.create({
  baseURL: "https://dest-network-8617a767d79b.herokuapp.com/api/",
  timeout: 10000, // Optional: Set a timeout in milliseconds (10 seconds in this case)
});
