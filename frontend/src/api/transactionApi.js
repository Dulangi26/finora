import API from "./api";

// helper to attach token
const authHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getTransactions = () =>
  API.get("/transactions", authHeader());

export const createTransaction = (data) =>
  API.post("/transactions", data, authHeader());

export const updateTransaction = (id, data) =>
  API.put(`/transactions/${id}`, data, authHeader());

export const deleteTransaction = (id) =>
  API.delete(`/transactions/${id}`, authHeader());