import useAxios from "../hooks/useAxios";

// Get all budgets (with optional query filters like email, bookId, category, or month)
export const getAllBudgets = async (filters = {}) => {
  const { email, bookId, category, month } = filters;
  const params = new URLSearchParams();

  if (email) params.append("email", email);
  if (bookId) params.append("bookId", bookId);
  if (category) params.append("category", category);
  if (month) params.append("month", month);

  const res = await useAxios.get(`/budgets?${params.toString()}`);
  return res.data;
};

// Get budgets by email specifically
export const getEmailBudgets = async (email) => {
  const res = await useAxios.get(`/budgets?email=${email}`);
  return res.data;
};

// Get budget by ID
export const getSingleBudget = async (id) => {
  const res = await useAxios.get(`/budgets/${id}`);
  return res.data;
};

// Create a new budget
export const createBudget = async (budgetInfo) => {
  const res = await useAxios.post("/budgets", budgetInfo);
  return res.data;
};

// Update budget by ID
export const updateBudget = async (id, updateBudgetInfo) => {
  const res = await useAxios.patch(`/budgets/${id}`, updateBudgetInfo);
  return res.data;
};

// Delete budget by ID
export const deleteBudget = async (id) => {
  const res = await useAxios.delete(`/budgets/${id}`);
  return res.data;
};