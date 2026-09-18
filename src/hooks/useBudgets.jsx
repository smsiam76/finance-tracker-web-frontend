import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBudget,
  deleteBudget,
  getAllBudgets,
  getEmailBudgets,
  getSingleBudget,
  updateBudget,
} from "../api/budgetsApi";

const useBudgets = (email = null, id = null, filters = {}) => {
  const queryClient = useQueryClient();

  // Invalidate cache for budget queries
  const invalidateDataCache = () => {
    queryClient.invalidateQueries({ queryKey: ["budgets"] });
  };

  // Get all budgets data / email wise / filter wise
  const {
    data: budgets = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: email
      ? ["budgets", email, filters]
      : ["budgets", filters],
    queryFn: () =>
      email
        ? getEmailBudgets(email)
        : getAllBudgets(filters),
  });

  // Get single budget by ID
  const {
    data: singleBudget = null,
    isLoading: isSingleBudgetLoading,
    error: singleBudgetError,
  } = useQuery({
    queryKey: ["budgets", id],
    queryFn: () => getSingleBudget(id),
    enabled: !!id, // Query will only run if ID exists
  });

  // Create budget mutation
  const createBudgetMutation = useMutation({
    mutationFn: createBudget,
    onSuccess: () => {
      invalidateDataCache();
    },
    onError: (error) => {
      console.error("Budget Creation Error:", error);
    },
  });

  // Update budget mutation
  const updateBudgetMutation = useMutation({
    mutationFn: ({ id, updateBudgetInfo }) => updateBudget(id, updateBudgetInfo),
    onSuccess: (_, variables) => {
      invalidateDataCache();
      queryClient.invalidateQueries({ queryKey: ["budgets", variables.id] });
    },
    onError: (error) => {
      console.error("Budget Update Error:", error);
    },
  });

  // Delete budget mutation
  const deleteBudgetMutation = useMutation({
    mutationFn: deleteBudget,
    onSuccess: () => {
      invalidateDataCache();
    },
    onError: (error) => {
      console.error("Budget Delete Error:", error);
    },
  });

  return {
    // data and states
    budgets,
    singleBudget,
    isLoading,
    isSingleBudgetLoading,
    isError,
    error,
    singleBudgetError,
    refetch,

    // actions (mutations)
    createBudget: createBudgetMutation.mutateAsync,
    isCreating: createBudgetMutation.isPending,

    updateBudget: updateBudgetMutation.mutateAsync,
    isUpdating: updateBudgetMutation.isPending,

    deleteBudget: deleteBudgetMutation.mutateAsync,
    isDeleting: deleteBudgetMutation.isPending,
  };
};

export default useBudgets;