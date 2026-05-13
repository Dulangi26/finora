import API from "./api";

export const getGoals = async () => {
  const { data } = await API.get("/goals");
  return data;
};

export const createGoal = async (payload) => {
  const { data } = await API.post("/goals", payload);
  return data;
};

export const updateGoal = async (id, payload) => {
  const { data } = await API.put(`/goals/${id}`, payload);
  return data;
};

export const deleteGoal = async (id) => {
  const { data } = await API.delete(`/goals/${id}`);
  return data;
};