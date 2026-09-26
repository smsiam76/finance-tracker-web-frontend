import { useState } from "react";
import { Bell, Plus, AlertCircle } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

import useAuth from "../../../hooks/useAuth";
import useBooks from "../../../hooks/useBooks";
import useCategories from "../../../hooks/useCategories";
import useReminders from "../../../hooks/useReminders";
import Loader from "../../../component/Shared/Loader/Loader";
import ReminderCard from "../../../component/RemindersCard/ReminderCard";
import AddReminderModal from "../../../component/AddReminderModal/AddReminderModal";
import { motion } from "framer-motion";

// Utility Helpers
const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const RemindersPage = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  // Fetching Data
  const { books = [], isLoading: isBooksLoading } = useBooks(user?.email);
  const { categories = [], isLoading: isCategoriesLoading } = useCategories(
    user?.email,
  );
  const {
    reminders = [],
    isLoading: isRemindersLoading,
    createReminder,
    isCreating,
    processPayment,
    deleteReminder,
  } = useReminders(user?.email);

  // 1. CREATE REMINDER
  const handleCreateReminder = async (formData, resetForm) => {
    try {
      const selectedBook = books.find((b) => b._id === formData.bookId);

      const newReminder = {
        ...formData,
        userEmail: user.email,
        amount: parseFloat(formData.amount),
        bookName: selectedBook ? selectedBook.bookName : "General Book",
        status: "active",
      };

      await createReminder(newReminder);

      // React Hot Toast on success
      toast.success("Recurring reminder created successfully!");

      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      // console.error("Failed to add reminder:", err);
      toast.error(err?.response?.data?.message || "Failed to create reminder.");
    }
  };

  // 2. MARK AS PAID (Confirmation Modal + react-hot-toast)
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setProcessingId(reminder._id);
          await processPayment({ id: reminder._id, email: user.email });

          // React Hot Toast on successful payment
          toast.success("Transaction recorded and next due date updated!");
        } catch (err) {
          // console.error("Failed to process payment:", err);
          toast.error(
            err?.response?.data?.message || "Failed to process payment.",
          );
        } finally {
          setProcessingId(null);
        }
      }
    });
  };

  // 3. DELETE REMINDER
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteReminder({ id, email: user.email });

          // SweetAlert success dialog for delete action
          Swal.fire({
            title: "Deleted!",
            text: "Reminder has been deleted successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (err) {
          // console.error("Failed to delete reminder:", err);
          Swal.fire({
            title: "Error!",
            text: err?.response?.data?.message || "Failed to delete reminder.",
            icon: "error",
          });
        }
      }
    });
  };

  // only active reminders
  const activeReminders = reminders.filter((item) => item.status === "active");

  if (isRemindersLoading || isBooksLoading || isCategoriesLoading) {
    return <Loader />;
  }

  return (
    <div className="pt-6 pb-12 space-y-6 max-w-7xl mx-auto px-4">
      {/* Header Bar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
        viewport={{ once: true, amount: 0.1 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-base-100 shadow-sm"
      >
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-gray-800">
              Recurring Reminders
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Manage your recurring bills, subscriptions, rent, and salary
            credits.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary/90 transition shadow-md shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> Add New Reminder
        </button>
      </motion.div>

      {/* Reminders List / Empty State */}
      {reminders.length === 0 ? (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.19, ease: "easeInOut" }}
          viewport={{ once: true, amount: 0.1 }}
          className="bg-white p-12 text-center rounded-2xl border border-base-100 shadow-sm space-y-3"
        >
          <AlertCircle className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="text-sm font-bold text-gray-600">
            No Reminders Found
          </h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            You don't have any active recurring reminders. Click button above to
            set up bills or income schedules.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {activeReminders.map((item) => (
              <ReminderCard
                key={item._id}
                item={item}
                processingId={processingId}
                onMarkAsPaid={handleMarkAsPaid}
                onDelete={handleDeleteReminder}
                formatDate={formatDate}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <AddReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateReminder}
        books={books}
        categories={categories}
        isCreating={isCreating}
      />
    </div>
  );
};

export default RemindersPage;
