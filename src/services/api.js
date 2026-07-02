import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8081/api",
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const session = localStorage.getItem("es_session");
  let shopId = 1; // Default fallback for development
  
  if (session) {
    try {
      const user = JSON.parse(session);
      if (user?.shopId) {
        shopId = user.shopId;
      }
    } catch (e) {
      console.error("Invalid session data");
    }
  }
  
  config.headers["X-Shop-Id"] = shopId;
  return config;
});

export const mockDelay = (data, delay = 500) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
