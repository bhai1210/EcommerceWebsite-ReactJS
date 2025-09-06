import axios from "axios";

import { getToken } from "../token/token";



const api = axios.create({
  baseURL: "https://student-management-backend-node-rd8.vercel.app",
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
