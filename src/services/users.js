import { apiClient } from "./api";

export const listUsers = async () => {
  const response = await apiClient.get("/users");
  return response.data;
};

export const deleteUser = async (id) => {
  await apiClient.delete(`/users/${id}`);
};
