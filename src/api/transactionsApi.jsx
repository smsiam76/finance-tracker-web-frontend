import useAxios from "../hooks/useAxios";

// Get all transactions
export const getAllTransactions = async () => {
    const res = await useAxios.get("/transactions");
    return res.data;
};

// Get transactions by user email (along with optional type or bookId filtering)
// export const getEmailTransactions = async (email, type = "", bookId = "") => {
//     let url = `/transactions?email=${email}`;
//     if (type) url += `&type=${type}`;
//     if (bookId) url += `&bookId=${bookId}`;
    
//     const res = await useAxios.get(url);
//     return res.data;
// };
export const getEmailTransactions = async (email, type = "", bookId = "") => {
  const params = new URLSearchParams();
  if (email) params.append("email", email);
  if (type) params.append("type", type);
  if (bookId) params.append("bookId", bookId);

  const res = await useAxios.get(`/transactions?${params.toString()}`);
  return res.data;
};

// Get single transaction by ID
export const getSingleTransaction = async (id) => {
    const res = await useAxios.get(`/transactions/${id}`);
    return res.data;
};

// Create a new transaction (Cash In / Cash Out / Transfer)
export const createTransaction = async (transactionInfo) => {
    const res = await useAxios.post("/transactions", transactionInfo);
    return res.data;
};

// Update a transaction by ID
export const updateTransaction = async (id, updateTransactionInfo) => {
    const res = await useAxios.patch(`/transactions/${id}`, updateTransactionInfo);
    return res.data;
};

// Delete transaction by ID
export const deleteTransaction = async (id) => {
    const res = await useAxios.delete(`/transactions/${id}`);
    return res.data;
};