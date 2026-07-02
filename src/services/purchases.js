import { apiClient } from "./api";

export async function listPurchases() {
  try {
    const res = await apiClient.get("/purchases");
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || "Failed to list purchases";
    throw new Error(msg);
  }
}

export async function createPurchase(payload) {
  try {
    const res = await apiClient.post("/purchases", payload);
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || "Failed to create purchase";
    throw new Error(msg);
  }
}

export async function updatePurchase(id, payload) {
  try {
    const res = await apiClient.put(`/purchases/${id}`, payload);
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || "Failed to update purchase order";
    throw new Error(msg);
  }
}

export async function deletePurchase(id) {
  try {
    const res = await apiClient.delete(`/purchases/${id}`);
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || "Failed to delete purchase order";
    throw new Error(msg);
  }
}
