import { apiClient } from "./api";

export const listSuppliers = async () => {
  try {
    const res = await apiClient.get("/suppliers");
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || "Failed to list suppliers";
    throw new Error(msg);
  }
};

export const createSupplier = async (payload) => {
  try {
    const res = await apiClient.post("/suppliers", payload);
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || "Failed to create supplier";
    throw new Error(msg);
  }
};

export const updateSupplier = async (id, updates) => {
  try {
    const res = await apiClient.put(`/suppliers/${id}`, updates);
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || "Failed to update supplier";
    throw new Error(msg);
  }
};

export const deleteSupplier = async (id) => {
  try {
    const res = await apiClient.delete(`/suppliers/${id}`);
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || "Failed to delete supplier";
    throw new Error(msg);
  }
};
