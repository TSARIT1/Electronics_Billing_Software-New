import { apiClient } from "./api";

const SESSION_KEY = "es_session";

export const register = async (payload) => {
  const response = await apiClient.post("/auth/register", payload);
  return response.data;
};

export const login = async ({ email, password }) => {
  const response = await apiClient.post("/auth/login", { email, password });
  const user = response.data;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
};

export const logout = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = () => JSON.parse(localStorage.getItem(SESSION_KEY) || "null");

const authService = { register, login, logout, getCurrentUser };

export default authService;
