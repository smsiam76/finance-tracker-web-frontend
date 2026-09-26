import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getReportDataByPeriod } from "../api/reportsApi";

const useReportAnalytics = (email = null, selectedBook="combined", period = "Monthly") => {
  const queryClient = useQueryClient();

  const invalidateReportCache = () => {
    queryClient.invalidateQueries({ queryKey: ["reports"] });
  };

  // Get filtered report analytics data (Daily, Weekly, Monthly, Yearly)
  const {
    data: reportAnalytics = {},
    isLoading: isReportLoading,
    isError: isReportError,
    error: reportError,
    refetch: refetchReport,
  } = useQuery({
    queryKey: ["reports", email, period, selectedBook],
    queryFn: () => getReportDataByPeriod(email, period, selectedBook),
    enabled: !!email, // if email available then query run
  });

  // Get overall summary / lifetime metrics
  // const {
  //   data: overallData = null,
  //   isLoading: isOverallLoading,
  //   error: overallError,
  // } = useQuery({
  //   queryKey: ["reports", "overall", email],
  //   queryFn: () => getOverallAnalytics(email),
  //   enabled: !!email,
  // });

  return {
    // Data & States
    reportAnalytics,
    // overallData,
    isReportLoading,
    // isOverallLoading,
    isReportError,
    reportError,
    // overallError,

    // Actions & Refetching
    refetchReport,
    invalidateReportCache,
  };
};

export default useReportAnalytics;
