import API from "./api";

// ================= GET CATEGORIES =================
export const getCategories = async () => {
  const { data } = await API.get("/categories");
  return data;
};

// ================= CREATE CATEGORY =================
export const createCategory = async (categoryData) => {
  const { data } = await API.post(
    "/categories",
    categoryData
  );

  return data;
};

// ================= UPDATE CATEGORY =================
export const updateCategory = async (
  id,
  categoryData
) => {
  const { data } = await API.put(
    `/categories/${id}`,
    categoryData
  );

  return data;
};

// ================= DELETE CATEGORY =================
export const deleteCategory = async (id) => {
  const { data } = await API.delete(
    `/categories/${id}`
  );

  return data;
};