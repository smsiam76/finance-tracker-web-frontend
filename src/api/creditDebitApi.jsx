import useAxios from "../hooks/useAxios";

// Get all debts / filter by params (email, userId, type, status, bookId)
export const getDebts = async (params = {}) => {
  const res = await useAxios.get("/debts", { params });
  return res.data;
};

// Get debts by email
export const getEmailDebts = async (email) => {
  const res = await useAxios.get(`/debts?email=${email}`);
  return res.data;
};

// Create a new debt record (LENT or BORROWED)
export const createDebt = async (debtInfo) => {
  const res = await useAxios.post("/debts", debtInfo);
  return res.data;
};

// Add settlement / partial payment to a debt record
export const settleDebt = async (id, settlementData) => {
  const res = await useAxios.patch(`/debts/settle/${id}`, settlementData);
  return res.data;
};

// Delete debt record
export const deleteDebt = async (id) => {
  const res = await useAxios.delete(`/debts/${id}`);
  return res.data;
};