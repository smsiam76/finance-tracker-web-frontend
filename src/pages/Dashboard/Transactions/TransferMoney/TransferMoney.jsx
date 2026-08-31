import { useForm } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
const TransferMoney = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fromBook: "Savings Account (Main)",
      toBook: "",
      date: "2023-11-24",
      reference: "",
      amount: "",
    },
  });

  const onSubmit = async (data) => {
    console.log("Form Submitted Data:", data);
    // Add your API call or submit handler here
  };

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
              <label className="block text-xs font-semibold tracking-wide">
                From Book
              </label>
              <div className="relative">
                <select
                  {...register("fromBook", {
                    required: "Source account is required",
                  })}
                  className="w-full bg-base-100 border border-primary/20 rounded-lg px-3.5 py-2.5 text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-transparent transition"
                >
                  <option value="Savings Account (Main)">
                    Savings Account (Main)
                  </option>
                  <option value="Daily Expense">Daily Expense</option>
                  <option value="Family Expense">Family Expense</option>
                  <option value="December Toru">December Tour</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none stroke-[2.5]" />
              </div>
              {errors.fromBook && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.fromBook.message}
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
                  {...register("toBook", {
                    required: "Destination account is required",
                  })}
                  className="w-full bg-base-100 border border-primary/20 rounded-lg px-3.5 py-2.5 text-sm font-medium  appearance-none focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-transparent transition"
                >
                  <option value="" disabled selected hidden>
                    Select Destination
                  </option>
                  <option value="Savings Account (Main)">
                    Savings Account (Main)
                  </option>
                  <option value="Daily Expense">Daily Expense</option>
                  <option value="Family Expense">Family Expense</option>
                  <option value="December Toru">December Tour</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none stroke-[2.5]" />
              </div>
              {errors.toBook && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.toBook.message}
                </p>
              )}
            </div>
          </div>

          {/* Middle Row: Date & Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Date */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold  tracking-wide">
                Date
              </label>
              <input
                type="date"
                {...register("date", { required: "Date is required" })}
                className="w-full bg-base-100 border border-primary/20 rounded-lg px-3.5 py-2 text-sm font-medium  focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-transparent transition"
              />
              {errors.date && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Reference/Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold  tracking-wide">
                Reference/Notes
              </label>
              <input
                type="text"
                placeholder="Internal quarterly rebalance"
                {...register("reference")}
                className="w-full bg-base-100 border border-primary/20 rounded-lg px-3.5 py-2 text-sm  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-transparent transition"
              />
            </div>
          </div>

          <div className="border-t border-gray-100 my-2"></div>

          {/* Bottom Field: Transfer Amount */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold  tracking-wide">
              Transfer Amount
            </label>
            <div className="relative flex items-center border border-primary/20 rounded-xl px-4 py-3 bg-base-100 focus-within:ring-2 focus-within:ring-[#006A4E] transition">
              {/* Bangladeshi Taka Icon/Symbol */}
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
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-[#005740] active:bg-[#004734] text-white font-medium py-3.5 px-6 rounded-xl shadow-md transition-all duration-300 ease-linear cursor-pointer flex items-center justify-center space-x-2 text-base disabled:opacity-50"
        >
          <span>{isSubmitting ? "Processing..." : "Confirm Transfer"}</span>
        </button>
      </form>
    </motion.div>
  );
};

export default TransferMoney;
