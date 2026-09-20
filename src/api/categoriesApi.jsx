import useAxios from "../hooks/useAxios";

// get all categories
export const getAllCategories = async () => {
  const res = await useAxios.get("/categories");
  return res.data;
};

// get categories by email
export const getEmailCategories = async (email) => {
  const res = await useAxios.get(`/categories?email=${email}`);
  return res.data;
};

// get categories by id (Typo Fixed: /categories)
export const getSingleCategory = async (id) => {
  const res = await useAxios.get(`/categories/${id}`);
  return res.data;
};

// create a new category
export const createCategory = async (categoryInfo) => {
  const res = await useAxios.post("/categories", categoryInfo);
  return res.data;
};

// update a category by ID
export const updateCategory = async (id, updateCategoryInfo) => {
  const res = await useAxios.patch(`/categories/${id}`, updateCategoryInfo);
  return res.data;
};

// delete category
export const deleteCategory = async (id) => {
  const res = await useAxios.delete(`/categories/${id}`);
  return res.data;
};