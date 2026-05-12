import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

export const mockDelay = (data, delay = 500) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
