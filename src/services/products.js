import { apiClient } from "./api";

export async function listProducts() {
  try {
    const res = await apiClient.get("/products");
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || "Failed to list products";
    throw new Error(msg);
  }
}

export async function createProduct(payload) {
  try {
    const res = await apiClient.post("/products", payload);
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || "Failed to create product";
    throw new Error(msg);
  }
}

export async function updateProduct(id, payload) {
  try {
    const res = await apiClient.put(`/products/${id}`, payload);
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || "Failed to update product";
    throw new Error(msg);
  }
}

export async function deleteProduct(id) {
  try {
    const res = await apiClient.delete(`/products/${id}`);
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || "Failed to delete product";
    throw new Error(msg);
  }
}
