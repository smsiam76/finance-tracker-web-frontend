import useAxios from "../hooks/useAxios";


export const getDashboardSummary = async (email) => {
  const res = await useAxios.get(`/dashboard/summary?email=${email}`);
  return res.data;
}; 

export const getBudgetOverview = async ( email) => {
  const res = await useAxios.get(`/dashboard/budget-overview?email=${email}`);
  return res.data;
};

export const getLendingSummary = async ( email) => {
  const res = await useAxios.get(`/lending/summary?email=${email}`);
  return res.data;
};

export const createLendingRecord = async ( lendingData) => {
  const res = await useAxios.post("/lending", lendingData);
  return res.data;
};