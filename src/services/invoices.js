import { apiClient } from "./api";

export async function listInvoices() {
  try {
    const res = await apiClient.get("/invoices");
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || "Failed to list invoices";
    throw new Error(msg);
  }
}

export async function createInvoice(payload) {
  try {
    const res = await apiClient.post("/invoices", payload);
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || "Failed to create invoice";
    throw new Error(msg);
  }
}
