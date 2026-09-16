import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTransaction, deleteTransaction, getAllTransactions, getEmailTransactions, getSingleTransaction, updateTransaction } from "../api/transactionsApi";


const useTransactions = ({ email = null, type = "", bookId = "", id = null } = {}) => {
  const queryClient = useQueryClient();

  const invalidateDataCache = () => {
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
  };

  // Get all transactions / Get email transactions with filters
  const {
    data: transactions = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: email
      ? ["transactions", email, { type, bookId }]
      : ["transactions"],
    queryFn: () =>
      email
        ? getEmailTransactions(email, type, bookId)
        : getAllTransactions(),
  });

  // Get single transaction by ID
  const {
    data: singleTransaction = null,
    isLoading: isSingleTransactionLoading,
    error: singleTransactionError,
  } = useQuery({
    queryKey: ["transactions", id],
    queryFn: () => getSingleTransaction(id),
    enabled: !!id,
  });

  // Create transaction mutation
  const createTransactionMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      invalidateDataCache();
    },
    onError: (error) => {
      console.error("Creation Error:", error);
    },
  });

  // Update transaction mutation
  const updateTransactionMutation = useMutation({
    mutationFn: ({ id, updateTransactionInfo }) =>
      updateTransaction(id, updateTransactionInfo),
    onSuccess: (_, variables) => {
      invalidateDataCache();
      queryClient.invalidateQueries({
        queryKey: ["transactions", variables.id],
      });
    },
    onError: (error) => {
      console.error("Update error:", error);
    },
  });

  // Delete transaction mutation
  const deleteTransactionMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      invalidateDataCache();
    },
    onError: (error) => {
      console.error("Delete error:", error);
    },
  });

  return {
    // Data & Loading States
    transactions,
    singleTransaction,
    isLoading,
    isSingleTransactionLoading,
    isError,
    error,
    singleTransactionError,
    refetch,

    // Mutation Actions
    createTransaction: createTransactionMutation.mutateAsync,
    isCreating: createTransactionMutation.isPending,

    updateTransaction: updateTransactionMutation.mutateAsync,
    isUpdating: updateTransactionMutation.isPending,

    deleteTransaction: deleteTransactionMutation.mutateAsync,
    isDeleting: deleteTransactionMutation.isPending,
  };
};

export default useTransactions;