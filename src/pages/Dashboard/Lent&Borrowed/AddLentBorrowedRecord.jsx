import { useForm } from "react-hook-form";
import { X, ArrowUpRight, ArrowDownLeft, Save, PlusCircle } from "lucide-react";


export const AddLentBorrowedRecord = () => {
  const {
    register,
    handleSubmit,
    // control,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      type: "LENT", // Matches Schema: "LENT" | "BORROWED"
      personName: "",
      phoneNumber: "",
      principalAmount: "",
      reason: "",
      createdDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      dueDate: "",
      note: "",
    },
  });

  const selectedType = watch("type");

  //   if (!isOpen) return null;

  const handleFormSubmit = (data) => {
    // Formats payload according to schema
    const formattedData = {
      ...data,
      principalAmount: parseFloat(data.principalAmount),
      remainingBalance: parseFloat(data.principalAmount),
      settledAmount: 0,
      status: "PENDING",
      createdDate: new Date(data.createdDate).toISOString(),
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
    };

    onSubmitRecord(formattedData);
    reset();
    // onClose();
  };

  return (
    <div className="flex items-center justify-cente backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-primary">
            <PlusCircle className="w-5 h-5" />
            <h3 className="font-bold text-base">Add New Record</h3>
          </div>
          <button
            // onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"
            onClick={() => document.getElementById("my_modal_5").close()}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-4"
        >
          {/* TRANSACTION TYPE */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold  uppercase tracking-wider">
              Transaction Type
            </label>
            <div className="bg-gray-100/80 p-1 rounded-xl flex items-center gap-1">
              <button
                type="button"
                onClick={() => setValue("type", "LENT")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition ${
                  selectedType === "LENT"
                    ? "bg-primary text-white shadow-sm"
                    : " hover:text-gray-700"
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                Lent
              </button>
              <button
                type="button"
                onClick={() => setValue("type", "BORROWED")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition ${
                  selectedType === "BORROWED"
                    ? "bg-primary text-white shadow-sm"
                    : " hover:text-gray-700"
                }`}
              >
                <ArrowDownLeft className="w-4 h-4" />
                Borrowed
              </button>
            </div>
          </div>

          {/* PERSON NAME & PHONE NUMBER */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold  uppercase tracking-wider">
                Person Name
              </label>
              <input
                type="text"
                placeholder="e.g. Rahim Ahmed"
                {...register("personName", { required: "Name is required" })}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-primary transition"
              />
              {errors.personName && (
                <p className="text-[10px] font-semibold text-rose-500">
                  {errors.personName.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold  uppercase tracking-wider">
                Phone Number (Optional)
              </label>
              <input
                type="text"
                placeholder="+880 1XXX-XXXXXX"
                {...register("phoneNumber")}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          {/* AMOUNT (BDT ৳) */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold  uppercase tracking-wider">
              Amount (BDT ৳)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
                ৳
              </span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("principalAmount", {
                  required: "Amount is required",
                  min: 1,
                })}
                className="w-full pl-7 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:border-primary transition"
              />
            </div>
            {errors.principalAmount && (
              <p className="text-[10px] font-semibold text-rose-500">
                {errors.principalAmount.message}
              </p>
            )}
          </div>

          {/* REASON */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold  uppercase tracking-wider">
              Reason
            </label>
            <input
              type="text"
              placeholder="e.g. Business Loan, Emergency"
              {...register("reason")}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-primary transition"
            />
          </div>

          {/* DATE & DUE DATE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold  uppercase tracking-wider">
                Date
              </label>
              <input
                type="date"
                {...register("createdDate", { required: true })}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:border-primary transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold  uppercase tracking-wider">
                Due Date
              </label>
              <input
                type="date"
                {...register("dueDate")}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          {/* NOTES */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold  uppercase tracking-wider">
              Notes
            </label>
            <textarea
              rows="3"
              placeholder="Additional details..."
              {...register("note")}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-primary transition resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => document.getElementById("my_modal_5").close()}
              type="button"
              //   onClick={onClose}
              className="px-5 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-[#00472B] transition shadow-sm"
            >
              <Save className="w-4 h-4" />
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
