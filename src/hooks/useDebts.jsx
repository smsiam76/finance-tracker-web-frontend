import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDebt, deleteDebt, getDebts, getEmailDebts, settleDebt } from "../api/creditDebitApi";

const useDebts = (email = null, filters = {}) => {
  const queryClient = useQueryClient();

  const invalidateDataCache = () => {
    queryClient.invalidateQueries({ queryKey: ["debts"] });
    queryClient.invalidateQueries({ queryKey: ["books"] });
  };

  // Create debt mutation
  const createDebtMutation = useMutation({
    mutationFn: createDebt,
    onSuccess: () => {
      invalidateDataCache();
    },
    onError: (error) => {
      console.error("Debt Creation Error:", error);
    },
  });

  // settleDebtMutation section:
const settleDebtMutation = useMutation({
  mutationFn: ({ id, settlementData }) => settleDebt(id, settlementData),
  onSuccess: (_, variables) => {
    invalidateDataCache();
    queryClient.invalidateQueries({ queryKey: ["debts", variables.id] });
  },
  onError: (error) => {
    console.error("Settlement Error:", error);
  },
});

  // Delete debt mutation
  const deleteDebtMutation = useMutation({
    mutationFn: deleteDebt,
    onSuccess: () => {
      invalidateDataCache();
    },
    onError: (error) => {
      console.error("Debt Delete Error:", error);
    },
  });

  const {
    data: debts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: email ? ["debts", email, filters] : ["debts", filters],
    queryFn: () => (email ? getEmailDebts(email) : getDebts(filters)),
  });

  return {
    // data and states
    debts,
    isLoading,
    isError,
    error,
    refetch,

    // actions (mutations)
    createDebt: createDebtMutation.mutateAsync,
    isCreating: createDebtMutation.isPending,

    settleDebt: settleDebtMutation.mutateAsync,
    isSettling: settleDebtMutation.isPending,

    deleteDebt: deleteDebtMutation.mutateAsync,
    isDeleting: deleteDebtMutation.isPending,
  };
};

export default useDebts;
