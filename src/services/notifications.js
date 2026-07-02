import { apiClient } from "./api";

export const getNotifications = async () => {
  const { data } = await apiClient.get("/notifications");
  return data;
};

export const markAsRead = async (id) => {
  const { data } = await apiClient.put(`/notifications/${id}/read`);
  return data;
};

export const markAllAsRead = async () => {
  const { data } = await apiClient.put("/notifications/read-all");
  return data;
};

export const deleteNotification = async (id) => {
  const { data } = await apiClient.delete(`/notifications/${id}`);
  return data;
};

export const clearNotifications = async () => {
  const { data } = await apiClient.delete("/notifications/clear");
  return data;
};

export const createNotification = async (payload) => {
  const { data } = await apiClient.post("/notifications/demo", payload);
  return data;
};
