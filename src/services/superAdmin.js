import { apiClient } from "./api";

// Dashboard
export const getDashboardStats = async () => {
  const response = await apiClient.get("/super-admin/dashboard");
  return response.data;
};

// Stores
export const getAllStores = async () => {
  const response = await apiClient.get("/super-admin/stores");
  return response.data;
};

export const toggleStoreStatus = async (id) => {
  const response = await apiClient.put(`/super-admin/stores/${id}/toggle-status`);
  return response.data;
};

export const deleteStore = async (id) => {
  await apiClient.delete(`/super-admin/stores/${id}`);
};

// Subscription Plans
export const getAllPlans = async () => {
  const response = await apiClient.get("/super-admin/plans");
  return response.data;
};

export const createPlan = async (plan) => {
  const response = await apiClient.post("/super-admin/plans", plan);
  return response.data;
};

export const updatePlan = async (id, plan) => {
  const response = await apiClient.put(`/super-admin/plans/${id}`, plan);
  return response.data;
};

export const deletePlan = async (id) => {
  await apiClient.delete(`/super-admin/plans/${id}`);
};

export const togglePlanStatus = async (id) => {
  const response = await apiClient.patch(`/super-admin/plans/${id}/toggle`);
  return response.data;
};

// Support Tickets
export const getAllTickets = async (priority, status) => {
  const params = {};
  if (priority) params.priority = priority;
  if (status) params.status = status;
  const response = await apiClient.get("/super-admin/tickets", { params });
  return response.data;
};

export const createTicket = async (ticket) => {
  const response = await apiClient.post("/super-admin/tickets", ticket);
  return response.data;
};

export const respondToTicket = async (id, responseText) => {
  const response = await apiClient.put(`/super-admin/tickets/${id}/respond`, { response: responseText });
  return response.data;
};

export const getTicketStats = async () => {
  const response = await apiClient.get("/super-admin/tickets/stats");
  return response.data;
};
