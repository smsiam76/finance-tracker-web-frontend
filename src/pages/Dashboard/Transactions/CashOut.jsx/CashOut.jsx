import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Calculator,
  Camera,
  Briefcase,
  Laptop,
  Building2,
  TrendingUp,
  Gift,
  MoreHorizontal,
  CreditCard,
  Landmark,
  Plane,
  Minus,
} from "lucide-react";
import { CalculatorModal } from "../../../../component/CalculatorModal/CalculatorModal";
import { motion } from "framer-motion";

export const CashOut = () => {
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  // Categories mapped with real database IDs
  const categories = [
    {
      _id: "cat_salary_01",
      label: "Salary",
      icon: Briefcase,
      color: "text-pink-400",
    },
    {
      _id: "cat_freelance_02",
      label: "Freelance",
      icon: Laptop,
      color: "text-cyan-400",
    },
    {
      _id: "cat_business_03",
      label: "Business",
      icon: Building2,
      color: "text-indigo-400",
    },
    {
      _id: "cat_invest_04",
      label: "Investment",
      icon: TrendingUp,
      color: "text-purple-400",
    },
    { _id: "cat_gift_05", label: "Gift", icon: Gift, color: "text-amber-400" },
    {
      _id: "cat_other_06",
      label: "Other",
      icon: MoreHorizontal,
      color: "text-emerald-400",
    },
  ];

  // Books mapped with real database IDs
  const books = [
    {
      _id: "65b0f1001a2b3c4d5e6f7a01",
      name: "Daily Expenses",
      icon: CreditCard,
    },
    { _id: "65b0f1001a2b3c4d5e6f7a02", name: "Savings", icon: Landmark },
    { _id: "65b0f1001a2b3c4d5e6f7a03", name: "December Tour", icon: Plane },
  ];

  // Initialize React Hook Form with Schema-compliant field names
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      type: "CASH_IN",
      amount: "0.00",
      bookId: books[0]._id,
      categoryId: categories[0]._id,
      date: new Date().toISOString().split("T")[0],
      note: "",
      receiptUrl: "",
    },
  });

  // Form Submission Handler
  const onSubmit = (data) => {
    // Transform amount to number and date to ISO String format matching DB payload
    const payload = {
      ...data,
      amount: parseFloat(data.amount),
      date: new Date(data.date).toISOString(),
    };

    console.log("Database Ready Payload:", payload);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2, ease: "easeInOut" }}
      viewport={{ once: true }}
      className="flex items-center justify-center pt-6 pb-12"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-1/2 rounded-2xl p-4 shadow-xl space-y-5 bg-primary/5"
      >
        {/* Hidden Enum Type Field */}
        <input type="hidden" {...register("type")} />

        {/* Amount Input Section */}
        <div>
          <div className="bg-red-200 border border-red-300 rounded-xl p-3">
            <label className="text text-red-500 block mb-1 font-bold">
              Amount (BDT)
            </label>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 w-full">
                <Minus className="text-red-500" size={20} />
                <input
                  type="text"
                  {...register("amount", {
                    required: "Amount is required",
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: "Enter a valid positive amount",
                    },
                    validate: (value) =>
                      parseFloat(value) > 0 || "Amount must be greater than 0",
                  })}
                  className="bg-transparent text-2xl font-semibold text-red-500 focus:outline-none w-full"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsCalcOpen(true)}
                className="text-red-500 hover:text-white p-2 rounded-lg hover:bg-red-700 transition-all duration-300 ease-linear cursor-pointer"
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

        {/* Book Selection (bookId) */}
        <div>
          <label className="text-primary block mb-2 font-bold">Book</label>
          <Controller
            name="bookId"
            control={control}
            rules={{ required: "Please select a book" }}
            render={({ field }) => (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {books.map((book) => {
                  const Icon = book.icon;
                  const isSelected = field.value === book._id;
                  return (
                    <button
                      key={book._id}
                      type="button"
                      onClick={() => field.onChange(book._id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 whitespace-nowrap transition border cursor-pointer ${
                        isSelected
                          ? "bg-primary border-primary/10 text-base-100"
                          : "bg-brimary/20 border-slate-800 hover:text-white"
                      }`}
                    >
                      <Icon size={14} />
                      <span>{book.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          />
          {errors.bookId && (
            <p className="text-red-500 text-xs mt-1">{errors.bookId.message}</p>
          )}
        </div>

        {/* Category Grid (categoryId) */}
        <div>
          <label className="text-primary block mb-2 font-medium">
            Category
          </label>
          <Controller
            name="categoryId"
            control={control}
            rules={{ required: "Please select a category" }}
            render={({ field }) => (
              <div className="grid grid-cols-5 gap-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = field.value === cat._id;
                  return (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() => field.onChange(cat._id)}
                      className={`p-2.5 font-bold rounded-xl flex flex-col items-center justify-center transition border cursor-pointer ${
                        isSelected
                          ? "bg-primary border-base-100"
                          : "bg-primary/5 border-base-100 hover:bg-primary/60"
                      }`}
                    >
                      <Icon className={`${cat.color} mb-1.5`} size={20} />
                      <span className="text-[10px] text-black">
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          />
          {errors.categoryId && (
            <p className="text-red-500 text-xs mt-1">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        {/* Date Input */}
        <div>
          <label className="text-primary block mb-1 font-bold">Date</label>
          <div className="relative">
            <input
              type="date"
              {...register("date", { required: "Date is required" })}
              className="w-full bg-primary/5 border border-primary/10 rounded-xl px-3 py-2 focus:outline-none"
            />
          </div>
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
          )}
        </div>

        {/* Note Input */}
        <div>
          <label className="text-primary block mb-1 font-bold">Note</label>
          <input
            type="text"
            placeholder="Add a note..."
            {...register("note", {
              maxLength: {
                value: 100,
                message: "Note cannot exceed 100 characters",
              },
            })}
            className="w-full bg-primary/5 border border-primary/10 rounded-xl px-3 py-2 focus:outline-none placeholder-slate-600"
          />
          {errors.note && (
            <p className="text-red-500 text-xs mt-1">{errors.note.message}</p>
          )}
        </div>

        {/* Attach Receipt (receiptUrl) */}
        <div>
          <label className="text-primary block mb-1 font-bold">
            Receipt Photo (Optional)
          </label>
          <input type="hidden" {...register("receiptUrl")} />
          <button
            type="button"
            className="flex items-center space-x-2 border border-dashed border-primary/10 bg-primary/5 px-3 py-2 rounded-xl text-xs hover:text-primary hover:border-slate-500 transition cursor-pointer"
          >
            <Camera size={14} />
            <input type="file" name="" id="" placeholder="Attach receipt" />
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-400 hover:bg-red-700 disabled:opacity-50 font-semibold py-2.5 rounded-xl transition shadow-lg shadow-emerald-950/20 cursor-pointer text-white"
        >
          Cash Out
        </button>

        {/* Calculator Modal Integration */}
        <CalculatorModal
          isOpen={isCalcOpen}
          onClose={() => setIsCalcOpen(false)}
          onApply={(val) => setValue("amount", val, { shouldValidate: true })}
        />
      </form>
    </motion.div>
  );
};
