import { useForm } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import useAuth from "../../../../hooks/useAuth";
import { useNavigate } from "react-router";
import useBooks from "../../../../hooks/useBooks";
import useTransactions from "../../../../hooks/useTransactions";
import Loader from "../../../../component/Shared/Loader/Loader";
import { useEffect } from "react";
import toast from "react-hot-toast";

const TransferMoney = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { books = [], isLoading: isBooksLoading } = useBooks(user?.email);
  const { createTransaction, isCreating } = useTransactions();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      type: "TRANSFER",
      userEmail: user?.email,
      amount: "0.00",
      sourceBookId: "",
      destinationBookId: "",
      date: new Date().toISOString().split("T")[0],
      note: "",
      receiptUrl: null,
    },
  });

  // UPDATE: Watch variables are now actively used below for balance & dropdown filtering
  const selectedSource = watch("sourceBookId");
  const selectedDestination = watch("destinationBookId");

  // UPDATE: Calculate current selected source book details to show balance
  const currentSourceBook = books.find((b) => b._id === selectedSource);

  useEffect(() => {
    if (books.length >= 2) {
      setValue("sourceBookId", books[0]._id);
      setValue("destinationBookId", books[1]._id);
    } else if (books.length === 1) {
      setValue("sourceBookId", books[0]._id);
    }
  }, [books, setValue]);

  const onSubmit = async (data) => {
    console.log("Form Submitted Data:", data);

    if (data.sourceBookId === data.destinationBookId) {
      return toast.error("Source and Destination books cannot be the same!");
    }

    try {
      const payload = {
        userId: user?._id || user?.uid || "",
        userEmail: user?.email,
        bookId: data.sourceBookId,
        type: "TRANSFER",
        categoryId: null,
        amount: parseFloat(data.amount),
        date: new Date(data.date).toISOString(),
        note: data.note || "",
        receiptUrl: null,
        transferDetails: {
          transferPairId: `TP-${Date.now()}`,
          sourceBookId: data.sourceBookId,
          destinationBookId: data.destinationBookId,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const res = await createTransaction(payload);
      if (res?.insertedId) {
        toast.success("Money transferred successfully!");
        reset({
          type: "TRANSFER",
          amount: "0.00",
          sourceBookId: books[0]?._id || "",
          destinationBookId: books[1]?._id || "",
          date: new Date().toISOString().split("T")[0],
          note: "",
          receiptUrl: null,
        });
        navigate(`/dashboard/my-books/book-details/${data?.sourceBookId}`);
      }
    } catch (error) {
      console.error("Transfer submission failed:", error);
      toast.error(error?.message || "Transfer failed!");
    }
  };

  if (isBooksLoading) {
    return <Loader />;
  }

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2, ease: "easeInOut" }}
      viewport={{ once: true }}
      className="w-full md:max-w-1/2 mx-auto pt-6 pb-12 sm:p-6 flex flex-col justify-center"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Form Container Card */}
        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-primary/10 space-y-6">
          {/* Top Row: Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* From Book */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold tracking-wide">
                  From Book
                </label>
                {/* Display live available balance of selected source book */}
                {/* {currentSourceBook && (
                  <span className="text-[10px] text-gray-500 font-medium">
                    Balance: ৳{currentSourceBook.balance ?? 0}
                  </span>
                )} */}
              </div>
              <div className="relative">
                <select
                  {...register("sourceBookId", {
                    required: "Source account is required",
                  })}
                  className="w-full bg-base-100 border border-primary/20 rounded-lg px-3.5 py-2.5 text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-transparent transition"
                >
                  <option value="" disabled hidden>
                    Select Source
                  </option>
                  {/* UPDATE: Hide option if already selected in Destination */}
                  {books
                    .filter((book) => book._id !== selectedDestination)
                    .map((book) => (
                      <option key={book._id} value={book._id}>
                        {book.bookName}
                      </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none stroke-[2.5]" />
              </div>
              {errors.sourceBookId && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.sourceBookId.message}
                </p>
              )}
            </div>

            {/* To Book */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold tracking-wide">
                To Book
              </label>
              <div className="relative">
                <select
                  {...register("destinationBookId", {
                    required: "Destination account is required",
                  })}
                  className="w-full bg-base-100 border border-primary/20 rounded-lg px-3.5 py-2.5 text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-transparent transition"
                >
                  <option value="" disabled hidden>
                    Select Destination
                  </option>
                  {/* UPDATE: Hide option if already selected in Source */}
                  {books
                    .filter((book) => book._id !== selectedSource)
                    .map((book) => (
                      <option key={book._id} value={book._id}>
                        {book.bookName}
                      </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none stroke-[2.5]" />
              </div>
              {errors.destinationBookId && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.destinationBookId.message}
                </p>
              )}
            </div>
          </div>

          {/* Middle Row: Date & Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Date */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold tracking-wide">
                Date
              </label>
              <input
                type="date"
                {...register("date", { required: "Date is required" })}
                className="w-full bg-base-100 border border-primary/20 rounded-lg px-3.5 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-transparent transition"
              />
              {errors.date && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Reference/Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold tracking-wide">
                Reference/Notes
              </label>
              <input
                type="text"
                placeholder="Internal quarterly rebalance"
                {...register("note")}
                className="w-full bg-base-100 border border-primary/20 rounded-lg px-3.5 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-transparent transition"
              />
            </div>
          </div>

          <div className="border-t border-gray-100 my-2"></div>

          {/* Bottom Field: Transfer Amount */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold tracking-wide">
              Transfer Amount
            </label>
            <div className="relative flex items-center border border-primary/20 rounded-xl px-4 py-3 bg-base-100 focus-within:ring-2 focus-within:ring-[#006A4E] transition">
              <span className="text-[#006A4E] text-2xl font-bold select-none pr-2">
                ৳
              </span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("amount", {
                  required: "Amount is required",
                  min: {
                    value: 0.01,
                    message: "Amount must be greater than 0",
                  },
                })}
                className="w-full text-right text-3xl font-semibold text-gray-800 focus:outline-none bg-transparent placeholder-gray-400"
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-red-500 mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isCreating}
          className="w-full bg-primary hover:bg-[#005740] active:bg-[#004734] text-white font-medium py-3.5 px-6 rounded-xl shadow-md transition-all duration-300 ease-linear cursor-pointer flex items-center justify-center space-x-2 text-base disabled:opacity-50"
        >
          {isSubmitting || isCreating ? (
            <span className="animate-pulse">Processing...</span>
          ) : (
            "Confirm Transfer"
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default TransferMoney;