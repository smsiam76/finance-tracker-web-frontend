import { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Calculator, Camera, Loader2, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

// Custom Hooks & Components
import useBooks from "../../../../hooks/useBooks";
import useAuth from "../../../../hooks/useAuth";
import useTransactions from "../../../../hooks/useTransactions";
import Loader from "../../../../component/Shared/Loader/Loader";
import { CalculatorModal } from "../../../../component/CalculatorModal/CalculatorModal";
import CreateBookModal from "../../../../component/CreateBookModal/CreateBookModal";

import useCategories from "../../../../hooks/useCategories";
import { renderCategoryIcon } from "../../../../utility/renderCategoryIcon";
import { renderIcon } from "../../../../utility/renderIcon";
import { uploadToImageBB } from "../../../../utility/uploadToImageBB";
import { useNavigate } from "react-router";

export const CashIn = () => {
  const { user } = useAuth();
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  // Loading and Preview States for Image Upload
  const [uploading, setUploading] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const navigate = useNavigate();

  // Get books and categories filtered by logged-in user email
  const { books = [], isLoading: isBooksLoading } = useBooks(user?.email);
  const { categories = [], isLoading: isCategoriesLoading } = useCategories(
    user?.email
  );

  // Filter Categories specifically for CASH_IN (INCOME)
  const incomeCategories = useMemo(() => {
    return categories.filter(
      (cat) => cat?.type?.toUpperCase() === "INCOME"
    );
  }, [categories]);

  // Transaction mutation hook
  const { createTransaction, isCreating } = useTransactions();

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "CASH_IN",
      amount: "",
      bookId: "",
      categoryId: "",
      date: new Date().toISOString().split("T")[0],
      note: "",
      receiptUrl: "",
    },
  });

  // Dynamically set first book when data fetching finishes
  useEffect(() => {
    if (books.length > 0) {
      setValue("bookId", books[0]._id);
    }
  }, [books, setValue]);

  // Set default category to the first INCOME category
  useEffect(() => {
    if (incomeCategories.length > 0) {
      setValue("categoryId", incomeCategories[0]._id);
    }
  }, [incomeCategories, setValue]);

  // Handle Image Upload to ImageBB
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please select a valid image file!");
    }

    try {
      setUploading(true);

      // Utility Call
      const imageUrl = await uploadToImageBB(file);

      setValue("receiptUrl", imageUrl);
      setReceiptPreview(imageUrl);
    } catch (error) {
      console.error("Image Upload Error:", error);
      toast.error(error.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  // Remove Uploaded Image
  const handleRemoveImage = () => {
    setValue("receiptUrl", "");
    setReceiptPreview(null);
  };

  // Form Submission Handler
  const onSubmit = async (data) => {
    try {
      const payload = {
        userId: user?._id || user?.uid || "",
        userEmail: user?.email,
        bookId: data.bookId,
        categoryId: data.categoryId,
        type: "CASH_IN",
        amount: parseFloat(data.amount),
        date: new Date(data.date).toISOString(),
        note: data.note || "",
        receiptUrl: data.receiptUrl || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // API Request via useTransactions Hook
      const res = await createTransaction(payload);

      if (res?.insertedId) {
        toast.success("Cash In added successfully!");

        // Reset Form state & image preview after success
        reset({
          type: "CASH_IN",
          amount: "0.00",
          bookId: books[0]?._id || "",
          categoryId: incomeCategories[0]?._id || "",
          date: new Date().toISOString().split("T")[0],
          note: "",
          receiptUrl: "",
        });
        setReceiptPreview(null);
        navigate(`/dashboard/my-books/book-details/${data?.bookId}`);
      }
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error(error?.message || "Something went wrong!");
    }
  };

  if (isBooksLoading || isCategoriesLoading) {
    return <Loader />;
  }

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.25, ease: "easeInOut" }}
      viewport={{ once: true }}
      className="flex flex-col items-center justify-center pt-6 pb-12"
    >
      <Toaster position="top-right" reverseOrder={false} />

      {/* Main CashIn Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full md:max-w-xl bg-white rounded-2xl p-6 shadow-xl space-y-5 border border-gray-100"
      >
        {/* Hidden Enum Type Field */}
        <input type="hidden" {...register("type")} />

        {/* Amount Input Section */}
        <div>
          <div className="bg-primary/5 border border-primary/30 rounded-xl p-3">
            <label className="text-xs text-primary block mb-1 font-bold">
              Amount (BDT)
            </label>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 w-full">
                <Plus className="text-primary" size={20} />
                <input
                  type="text"
                  placeholder="0.00"
                  {...register("amount", {
                    required: "Amount is required",
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: "Enter a valid positive amount",
                    },
                    validate: (value) =>
                      parseFloat(value) > 0 || "Amount must be greater than 0",
                  })}
                  className="bg-transparent text-2xl font-semibold text-primary focus:outline-none w-full"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsCalcOpen(true)}
                className="text-primary hover:text-white p-2 rounded-lg hover:bg-primary transition-all duration-300 ease-linear cursor-pointer"
                title="Open Calculator"
              >
                <Calculator size={18} />
              </button>
            </div>
          </div>
          {errors.amount && (
            <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
          )}
        </div>

        {/* Select Book Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-primary block font-bold text-sm">
              Select Book
            </label>
            <button
              type="button"
              onClick={() =>
                document.getElementById("create_book_modal_cashin").showModal()
              }
              className="text-xs text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} /> Create Book
            </button>
          </div>

          {books.length === 0 ? (
            <div className="text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-xs text-gray-500 mb-2">
                No books found for this user.
              </p>
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("create_book_modal_cashin")
                    .showModal()
                }
                className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                + Create First Book
              </button>
            </div>
          ) : (
            <Controller
              name="bookId"
              control={control}
              rules={{ required: "Please select a book" }}
              render={({ field }) => (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {books.map((book) => {
                    const isSelected = field.value === book._id;
                    const bookColor =
                      book.themeColor || book.color || "#006A4E";
                    const iconColor = isSelected ? "#ffffff" : bookColor;

                    return (
                      <button
                        key={book._id}
                        type="button"
                        onClick={() => field.onChange(book._id)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center space-x-2 whitespace-nowrap transition border cursor-pointer ${
                          isSelected
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                      >
                        {renderIcon(book.icon, iconColor, "w-4 h-4")}
                        <span>{book.bookName || book.title || book.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            />
          )}

          {errors.bookId && (
            <p className="text-red-500 text-xs mt-1">{errors.bookId.message}</p>
          )}
        </div>

        {/* Category Grid Section (Only INCOME Categories) */}
        <div>
          <label className="text-primary block mb-2 font-bold text-sm">
            Category
          </label>
          {incomeCategories.length === 0 ? (
            <div className="text-center py-3 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-xs text-gray-500">
              No income categories found.
            </div>
          ) : (
            <Controller
              name="categoryId"
              control={control}
              rules={{ required: "Please select a category" }}
              render={({ field }) => (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {incomeCategories.map((cat) => {
                    const isSelected = field.value === cat._id;
                    const activeIconColor = isSelected
                      ? "#ffffff"
                      : cat.color || "#22c55e";

                    return (
                      <button
                        key={cat._id}
                        type="button"
                        onClick={() => field.onChange(cat._id)}
                        className={`p-2.5 font-semibold rounded-xl flex flex-col items-center justify-center transition border cursor-pointer ${
                          isSelected
                            ? "bg-primary text-white border-primary"
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        <div className="mb-1">
                          {renderCategoryIcon(
                            cat.icon,
                            activeIconColor,
                            "w-5 h-5"
                          )}
                        </div>
                        <span className="text-[10px] truncate max-w-full capitalize">
                          {cat.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            />
          )}
          {errors.categoryId && (
            <p className="text-red-500 text-xs mt-1">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        {/* Date Input */}
        <div>
          <label className="text-primary block mb-1 font-bold text-sm">
            Date
          </label>
          <input
            type="date"
            {...register("date", { required: "Date is required" })}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary"
          />
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
          )}
        </div>

        {/* Note Input */}
        <div>
          <label className="text-primary block mb-1 font-bold text-sm">
            Note
          </label>
          <input
            type="text"
            placeholder="Add a note..."
            {...register("note", {
              maxLength: {
                value: 100,
                message: "Note cannot exceed 100 characters",
              },
            })}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary placeholder-gray-400"
          />
          {errors.note && (
            <p className="text-red-500 text-xs mt-1">{errors.note.message}</p>
          )}
        </div>

        {/* Attach Receipt Section */}
        <div>
          <label className="text-primary block mb-1 font-bold text-sm">
            Receipt Photo (Optional)
          </label>
          <input type="hidden" {...register("receiptUrl")} />

          {receiptPreview ? (
            <div className="relative w-24 h-24 rounded-xl border border-gray-200 overflow-hidden group">
              <img
                src={receiptPreview}
                alt="Receipt Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs shadow hover:bg-red-600 transition cursor-pointer"
                title="Remove image"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ) : (
            <label className="flex items-center gap-2 border border-dashed border-gray-300 bg-gray-50 p-2.5 rounded-xl text-xs text-gray-600 hover:border-primary hover:text-primary transition cursor-pointer w-max">
              {uploading ? (
                <>
                  <Loader2 size={16} className="animate-spin text-primary" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Camera size={16} />
                  <span>Upload Receipt</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isCreating || uploading}
          className="w-full bg-primary hover:bg-emerald-800 disabled:opacity-50 font-semibold py-3 rounded-xl transition shadow-md text-white cursor-pointer"
        >
          {isCreating ? "Processing..." : "Cash In"}
        </button>
      </form>

      {/* Calculator Modal */}
      <CalculatorModal
        isOpen={isCalcOpen}
        onClose={() => setIsCalcOpen(false)}
        onApply={(val) => setValue("amount", val, { shouldValidate: true })}
      />

      {/* Create Book Dialog Modal */}
      <dialog
        id="create_book_modal_cashin"
        className="modal modal-bottom sm:modal-middle px-4 md:px-0"
      >
        <CreateBookModal />
      </dialog>
    </motion.div>
  );
};