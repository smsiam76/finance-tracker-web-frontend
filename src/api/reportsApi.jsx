import useAxios from "../hooks/useAxios";


// Get report analytics by period (Daily, Weekly, Monthly, Yearly)
export const getReportDataByPeriod = async (email, period = "Monthly") => {
  const params = new URLSearchParams();

  if (email) params.append("email", email);
  if (period) params.append("period", period);

  const res = await useAxios.get(`/reports/analytics?${params.toString()}`);
  return res.data;
};

// Get overall / lifetime analytics summary for a user
export const getOverallAnalytics = async (email) => {
  const res = await useAxios.get(`/reports/overall?email=${email}`);
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