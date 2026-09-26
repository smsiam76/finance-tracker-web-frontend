import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReminder,
  deleteReminder,
  getAllReminders,
  getBookReminders,
  getEmailReminders,
  getSingleReminder,
  processReminderPayment,
  updateReminder,
} from "../api/remindersApi";

const useReminders = (email = null, id = null, bookId = null) => {
  const queryClient = useQueryClient();

  // Helper function to invalidate all reminder queries
 const invalidateDataCache = () => {
  queryClient.invalidateQueries({ queryKey: ["reminders"] });
  queryClient.invalidateQueries({ queryKey: ["books"] });
  queryClient.invalidateQueries({ queryKey: ["transactions"] });
};

  // 1. Get all reminders / email wise reminders
  const {
    data: reminders = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: email ? ["reminders", email] : ["reminders"],
    queryFn: () => (email ? getEmailReminders(email) : getAllReminders()),
  });

  // 2. Get single reminder by ID
  const {
    data: singleReminder = null,
    isLoading: isSingleReminderLoading,
    error: singleReminderError,
  } = useQuery({
    queryKey: ["reminders", "single", id],
    queryFn: () => getSingleReminder(id),
    enabled: !!id, // Only run if ID is provided
  });

  // 3. Get reminders by Book ID
  const {
    data: bookReminders = [],
    isLoading: isBookRemindersLoading,
    error: bookRemindersError,
  } = useQuery({
    queryKey: ["reminders", "book", bookId],
    queryFn: () => getBookReminders(bookId),
    enabled: !!bookId, // Only run if bookId is provided
  });

  // --- MUTATIONS ---

  // Create reminder mutation
  const createReminderMutation = useMutation({
    mutationFn: createReminder,
    onSuccess: () => {
      invalidateDataCache();
    },
    onError: (error) => {
      console.error("Reminder Creation Error:", error);
    },
  });

  // Process / Mark as Paid reminder mutation
  const processPaymentMutation = useMutation({
    mutationFn: ({ id, email }) => processReminderPayment(id, email),
    onSuccess: (_, variables) => {
      invalidateDataCache();
      queryClient.invalidateQueries({ queryKey: ["reminders", "single", variables.id] });
    },
    onError: (error) => {
      console.error("Payment Processing Error:", error);
    },
  });

  // Update reminder mutation
  const updateReminderMutation = useMutation({
    mutationFn: ({ id, updateReminderInfo }) => updateReminder(id, updateReminderInfo),
    onSuccess: (_, variables) => {
      invalidateDataCache();
      queryClient.invalidateQueries({ queryKey: ["reminders", "single", variables.id] });
    },
    onError: (error) => {
      console.error("Reminder Update Error:", error);
    },
  });

  // Delete reminder mutation
  const deleteReminderMutation = useMutation({
    mutationFn: ({ id, email }) => deleteReminder(id, email),
    onSuccess: () => {
      invalidateDataCache();
    },
    onError: (error) => {
      console.error("Reminder Delete Error:", error);
    },
  });

  return {
    // Data & Loading States
    reminders,
    singleReminder,
    bookReminders,
    isLoading,
    isSingleReminderLoading,
    isBookRemindersLoading,
    isError,
    error,
    singleReminderError,
    bookRemindersError,
    refetch,

    // Actions / Mutations
    createReminder: createReminderMutation.mutateAsync,
    isCreating: createReminderMutation.isPending,

    processPayment: processPaymentMutation.mutateAsync,
    isProcessing: processPaymentMutation.isPending,

    updateReminder: updateReminderMutation.mutateAsync,
    isUpdating: updateReminderMutation.isPending,

    deleteReminder: deleteReminderMutation.mutateAsync,
    isDeleting: deleteReminderMutation.isPending,
  };
};

export default useReminders;