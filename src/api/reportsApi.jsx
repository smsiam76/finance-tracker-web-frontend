import useAxios from "../hooks/useAxios";


export const getReportDataByPeriod = async (email, period = "Monthly", selectedBook = "combined") => {
  const params = new URLSearchParams();

  if (email) params.append("email", email);
  if (period) params.append("period", period);
  if (selectedBook) params.append("selectedBook", selectedBook);

  const res = await useAxios.get(`/reports/analytics?${params.toString()}`);
  return res.data;
};

// Get reports with custom date ranges or book filters
export const getCustomReport = async (filters = {}) => {
  const { email, bookId, startDate, endDate } = filters;
  const params = new URLSearchParams();

  if (email) params.append("email", email);
  if (bookId) params.append("bookId", bookId);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const res = await useAxios.get(`/reports/custom?${params.toString()}`);
  return res.data;
};