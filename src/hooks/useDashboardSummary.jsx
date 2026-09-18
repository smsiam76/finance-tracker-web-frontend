import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  createLendingRecord, 
  getBudgetOverview, 
  getDashboardSummary, 
  getLendingSummary 
} from "../api/dashboardApi";

const useDashboardSummary = (email = null) => {
  const queryClient = useQueryClient();

  const invalidateDashboardCache = () => {
    queryClient.invalidateQueries({ queryKey: ["dashboardSummary", email] });
    queryClient.invalidateQueries({ queryKey: ["budgetOverview", email] });
    queryClient.invalidateQueries({ queryKey: ["lendingSummary", email] });
  };

  // Dashboard Financial Summary & Category Expense Data
  const {
    data: summaryData = null,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    refetch: refetchSummary,
  } = useQuery({
    queryKey: ["dashboardSummary", email], // Fixed typo: "dashboardeSummary" -> "dashboardSummary"
    queryFn: () => getDashboardSummary(email),
    enabled: !!email,
  });

  // Budget Overview Data
  const {
    data: budgetOverview = [],
    isLoading: isBudgetLoading,
    refetch: refetchBudgets,
  } = useQuery({
    queryKey: ["budgetOverview", email],
    queryFn: () => getBudgetOverview(email),
    enabled: !!email,
  });

  // Lending Summary Data (Lent vs Borrowed)
  const {
    data: lendingSummary = { lent: 0, borrowed: 0 },
    isLoading: isLendingLoading,
    refetch: refetchLending,
  } = useQuery({
    queryKey: ["lendingSummary", email],
    queryFn: () => getLendingSummary(email),
    enabled: !!email,
  });

  // Create Lending Record Mutation
  const createLendingMutation = useMutation({
    mutationFn: (data) => createLendingRecord(data),
    onSuccess: () => {
      invalidateDashboardCache();
    },
    onError: (error) => {
      console.error("Lending creation error:", error);
    },
  });

  return {
    // Data & States
    summaryData,
    budgetOverview,
    lendingSummary,
    isLoading: isSummaryLoading || isBudgetLoading || isLendingLoading,
    isSummaryError,

    // Refetch Actions
    refetchAll: () => {
      refetchSummary();
      refetchBudgets();
      refetchLending();
    },

    // Mutations
    addLendingRecord: createLendingMutation.mutateAsync,
    isAddingLending: createLendingMutation.isPending,
  };
};

export default useDashboardSummary;