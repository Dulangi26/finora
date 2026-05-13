import API from "./api";

// GET
export const getBudgets = async () => {
  const res = await API.get("/budgets");
  return res.data;
};

// CREATE
export const createBudget = async (data) => {
  const res = await API.post("/budgets", data);
  return res.data;
};

// UPDATE
export const updateBudget = async (id, data) => {
  const res = await API.put(`/budgets/${id}`, data);
  return res.data;
};

// DELETE
export const deleteBudget = async (id) => {
  const res = await API.delete(`/budgets/${id}`);
  return res.data;
};