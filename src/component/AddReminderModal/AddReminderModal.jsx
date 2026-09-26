import { useForm } from "react-hook-form";
import {

  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

const AddReminderModal = ({
  isOpen,
  onClose,
  onSubmit,
  books,
  categories,
  isCreating,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { type: "EXPENSE", frequency: "monthly" },
  });

  const selectedType = watch("type", "EXPENSE");
  const filteredCategories = categories.filter(
    (cat) => !cat.type || cat.type.toUpperCase() === selectedType.toUpperCase(),
  );

  const handleFormSubmit = (data) => {
    onSubmit(data, reset);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-base-100 p-6 space-y-5"
      >
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-bold text-base text-gray-800">
            Add Recurring Reminder
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600">
                Reminder Title
              </label>
              <input
                type="text"
                placeholder="e.g. House Rent, Internet Bill"
                {...register("title", { required: "Title is required" })}
                className="w-full text-xs font-semibold px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
              />
              {errors.title && (
                <span className="text-[10px] text-rose-500">
                  {errors.title.message}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600">
                Amount (৳)
              </label>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                {...register("amount", { required: "Amount is required" })}
                className="w-full text-xs font-semibold px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
              />
              {errors.amount && (
                <span className="text-[10px] text-rose-500">
                  {errors.amount.message}
                </span>
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
              <label className="text-xs font-bold text-gray-600">
                Target Book
              </label>
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
                <span className="text-[10px] text-rose-500">
                  {errors.bookId.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600">
                Category
              </label>
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
                <span className="text-[10px] text-rose-500">
                  {errors.category.message}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600">
                Frequency
              </label>
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
            <label className="text-xs font-bold text-gray-600">
              Next Due Date
            </label>
            <input
              type="date"
              {...register("nextDueDate", { required: "Due date is required" })}
              className="w-full text-xs font-semibold px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
            />
            {errors.nextDueDate && (
              <span className="text-[10px] text-rose-500">
                {errors.nextDueDate.message}
              </span>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
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
  );
};

export default AddReminderModal;