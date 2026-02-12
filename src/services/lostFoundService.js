// src/services/lostFoundService.js
import axios from "axios";

// ✅ If you use Vite proxy -> keep "" (relative)
// ✅ If proxy not set -> it will use http://localhost:8099 directly in dev
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8099";

const api = axios.create({
  baseURL: `${BASE_URL}/api/lost-found`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Helper
const unwrap = (res) => res.data;

// GET all items
export const getAllItems = async () => {
  const res = await api.get("");
  return unwrap(res);
};

// GET by id (optional but useful)
export const getItemById = async (id) => {
  const res = await api.get(`/${id}`);
  return unwrap(res);
};

// POST create item
export const createItem = async (data) => {
  const res = await api.post("", data);
  return unwrap(res);
};

// PUT claim item
// ⚠️ If your backend endpoint is different, see note below.
export const claimItem = async (id) => {
  const res = await api.put(`/${id}/claim`);
  return unwrap(res);
};

// PUT unclaim item (optional)
export const unclaimItem = async (id) => {
  const res = await api.put(`/${id}/unclaim`);
  return unwrap(res);
};

// DELETE item
export const deleteItem = async (id) => {
  const res = await api.delete(`/${id}`);
  return unwrap(res);
};

// SEARCH (backend expects ?keyword= )
export const searchItems = async (keyword) => {
  const res = await api.get("/search", {
    params: { keyword },
  });
  return unwrap(res);
};

// UNCLAIMED
export const getUnclaimed = async () => {
  const res = await api.get("/unclaimed");
  return unwrap(res);
};
