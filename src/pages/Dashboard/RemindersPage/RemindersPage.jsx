import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Bell,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
  Tag,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useBooks from "../../../hooks/useBooks";
import useCategories from "../../../hooks/useCategories";
import useReminders from "../../../hooks/useReminders";
import Loader from "../../../component/Shared/Loader/Loader";


const RemindersPage = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  // Custom Hooks Fetching
  const { books = [], isLoading: isBooksLoading } = useBooks(user?.email);
  const { categories = [], isLoading: isCategoriesLoading } = useCategories(user?.email);

  const {
    reminders = [],
    isLoading: isRemindersLoading,
    createReminder,
    isCreating,
    processPayment,
    deleteReminder,
  } = useReminders(user?.email);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "EXPENSE",
      frequency: "monthly",
    },
  });

  // Filter categories according to Selected Type (EXPENSE or INCOME)
  const selectedType = watch("type", "EXPENSE");
  const filteredCategories = categories.filter((cat) => {
    if (!cat.type) return true;
    return cat.type.toUpperCase() === selectedType.toUpperCase();
  });

  // Handle Create Reminder
  const onSubmit = async (data) => {
    try {
      const selectedBook = books.find((b) => b._id === data.bookId);

      const newReminder = {
        userEmail: user.email,
        title: data.title,
        amount: parseFloat(data.amount),
        type: data.type,
        category: data.category,
        bookId: data.bookId,
        bookName: selectedBook ? selectedBook.bookName : "General Book",
        frequency: data.frequency,
        nextDueDate: data.nextDueDate,
        status: "active",
      };

      await createReminder(newReminder);

      Swal.fire({
        title: "Success!",
        text: "Recurring reminder created successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      reset();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to add reminder:", err);
      Swal.fire({
        title: "Error!",
        text: err?.response?.data?.message || "Failed to create reminder.",
        icon: "error",
      });
    }
  };

  // Confirmation SweetAlert for Mark as Paid
  const handleMarkAsPaid = (reminder) => {
    Swal.fire({
      title: "Process Payment?",
      html: `Confirm transaction of <b>৳${reminder.amount}</b> for "<b>${reminder.title}</b>" in book "<b>${reminder.bookName}</b>"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Confirm!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        executePayment(reminder);
      }
    });
  };

  // Trigger Process Payment Mutation
  const executePayment = async (reminder) => {
    try {
      setProcessingId(reminder._id);
      await processPayment({ id: reminder._id, email: user.email });

      Swal.fire({
        title: "Paid!",
        text: "Transaction recorded and next due date updated!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Failed to process payment:", err);
      Swal.fire({
        title: "Failed!",
        text: err?.response?.data?.message || "Failed to process payment.",
        icon: "error",
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Confirmation SweetAlert for Delete
  const handleDeleteReminder = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this recurring reminder!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        confirmDelete(id);
      }
    });
  };

  const confirmDelete = async (id) => {
    try {
      await deleteReminder({ id, email: user.email });
      Swal.fire({
        title: "Deleted!",
        text: "Reminder has been deleted successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Failed to delete reminder:", err);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete reminder.",
        icon: "error",
      });
    }
  };

  if (isRemindersLoading || isBooksLoading || isCategoriesLoading) {
    return <Loader />;
  }

  return (
    <div className="pt-6 pb-12 space-y-6 max-w-7xl mx-auto px-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-base-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-gray-800">Recurring Reminders</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Manage your recurring bills, subscriptions, rent, and salary credits.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary/90 transition shadow-md shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> Add New Reminder
        </button>
      </div>

      {/* Reminders Grid */}
      {reminders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-base-100 shadow-sm space-y-3">
          <AlertCircle className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="text-sm font-bold text-gray-600">No Reminders Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            You don't have any active recurring reminders. Click button above to set up bills or income schedules.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {reminders.map((item) => {
              const isIncome =
                item.type === "INCOME" || item.type === "CASH_IN" || item.type === "cash-in";

              return (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-5 rounded-2xl border border-base-100 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Badge & Delete */}
                    <div className="flex items-start justify-between">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          isIncome
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-rose-50 text-rose-700 border border-rose-100"
                        }`}
                      >
                        {isIncome ? (
                          <ArrowDownRight className="w-3 h-3" />
                        ) : (
                          <ArrowUpRight className="w-3 h-3" />
                        )}
                        {isIncome ? "Income Credit" : "Expense Bill"}
                      </span>

                      <button
                        onClick={() => handleDeleteReminder(item._id)}
                        className="text-gray-400 hover:text-rose-500 p-1 transition"
                        title="Delete Reminder"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Title & Amount */}
                    <div>
                      <h3 className="font-bold text-base text-gray-800">{item.title}</h3>
                      <p
                        className={`text-lg font-black mt-0.5 ${
                          isIncome ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        ৳ {item.amount?.toLocaleString()}
                      </p>
                    </div>

                    {/* Metadata Details */}
                    <div className="space-y-1.5 pt-2 border-t border-gray-50 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-semibold text-gray-700">Book:</span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px] font-bold text-gray-800">
                          {item.bookName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-semibold text-gray-700">Category:</span>
                        <span>{item.category}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-semibold text-gray-700">Frequency:</span>
                        <span className="capitalize">{item.frequency}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-semibold text-gray-700">Next Due:</span>
                        <span className="font-bold text-primary">
                          {new Date(item.nextDueDate).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mark as Paid Action Button */}
                  <button
                    disabled={processingId === item._id}
                    onClick={() => handleMarkAsPaid(item)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold rounded-xl text-xs transition disabled:opacity-50 mt-2"
                  >
                    {processingId === item._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    {processingId === item._id
                      ? "Processing..."
                      : `Mark as Paid & Add to ${item.bookName}`}
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* CREATE REMINDER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-base-100 p-6 space-y-5"
          >
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-base text-gray-800">Add Recurring Reminder</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Reminder Title</label>
                  <input
                    type="text"
                    placeholder="e.g. House Rent, Internet Bill"
                    {...register("title", { required: "Title is required" })}
                    className="w-full text-xs font-semibold px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                  />
                  {errors.title && (
                    <span className="text-[10px] text-rose-500">{errors.title.message}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Amount (৳)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    {...register("amount", { required: "Amount is required" })}
                    className="w-full text-xs font-semibold px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                  />
                  {errors.amount && (
                    <span className="text-[10px] text-rose-500">{errors.amount.message}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Type</label>
                  <select
                    {...register("type", { required: true })}
                    className="w-full text-xs font-semibold px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                  >
                    <option value="EXPENSE">Expense Bill (Cash Out)</option>
                    <option value="INCOME">Income Credit (Cash In)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Target Book</label>
                  <select
                    {...register("bookId", { required: "Please select a book" })}
                    className="w-full text-xs font-semibold px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                  >
                    <option value="">Select Target Book</option>
                    {books.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.bookName}
                      </option>
                    ))}
                  </select>
                  {errors.bookId && (
                    <span className="text-[10px] text-rose-500">{errors.bookId.message}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Category</label>
                  <select
                    {...register("category", { required: "Category is required" })}
                    className="w-full text-xs font-semibold px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                  >
                    <option value="">Select Category</option>
                    {filteredCategories.map((c) => (
                      <option key={c._id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <span className="text-[10px] text-rose-500">{errors.category.message}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Frequency</label>
                  <select
                    {...register("frequency", { required: true })}
                    className="w-full text-xs font-semibold px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="daily">Daily</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">Next Due Date</label>
                <input
                  type="date"
                  {...register("nextDueDate", { required: "Due date is required" })}
                  className="w-full text-xs font-semibold px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                />
                {errors.nextDueDate && (
                  <span className="text-[10px] text-rose-500">{errors.nextDueDate.message}</span>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  disabled={isCreating}
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition shadow-sm disabled:opacity-50"
                >
                  {isCreating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Reminder
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RemindersPage;