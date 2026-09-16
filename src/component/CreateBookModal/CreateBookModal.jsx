import { IoClose } from "react-icons/io5";

import { useState } from "react";
import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router";
import {
  IoCheckmarkCircleOutline,
  IoWalletOutline,
  IoCardOutline,
  IoAirplaneOutline,
  IoHomeOutline,
  IoBagHandleOutline,
} from "react-icons/io5";
import { FaPiggyBank } from "react-icons/fa";
import useBooks from "../../hooks/useBooks";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const CreateBookModal = () => {
  //   const navigate = useNavigate();
  const { user } = useAuth();

  const { createBook, isCreating } = useBooks();

  // Icon Color and Type Selection State
  const [selectedIcon, setSelectedIcon] = useState("wallet");
  const [selectedColor, setSelectedColor] = useState("#006A4E");
  const [bookType, setBookType] = useState("STANDARD"); // <--- Book Type State
  // React Hook Form Configuration
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bookName: "",
      openingBalance: "",
      description: "",
    },
  });

  // Icon options setup
  const icons = [
    { id: "wallet", component: <IoWalletOutline className="w-6 h-6" /> },
    { id: "card", component: <IoCardOutline className="w-6 h-6" /> },
    { id: "piggy", component: <FaPiggyBank className="w-5 h-5" /> },
    { id: "plane", component: <IoAirplaneOutline className="w-6 h-6" /> },
    { id: "home", component: <IoHomeOutline className="w-6 h-6" /> },
    { id: "bag", component: <IoBagHandleOutline className="w-6 h-6" /> },
  ];

  // Theme color options
  const colors = [
    "#006A4E", // Emerald Green
    "#2E6F40", // Forest Green
    "#A83232", // Red
    "#054432", // Dark Teal
    "#326F5A", // Muted Teal
  ];

  const bookTypes = [
    { id: "STANDARD", label: "Standard Ledger" },
    { id: "SAVINGS", label: "Savings / Emergency" },
    { id: "TARGET_PROGRESS", label: "Target (Progress Bar)" },
    { id: "TARGET_REMAINING", label: "Target (Remaining)" },
  ];

  // Helper to safely close the modal
  // const closeModal = () => {
  //   const modal = document.getElementById("my_modal_5");
  //   if (modal && typeof modal.close === "function") {
  //     modal.close();
  //   }
  // };

  // Form Submission Handler
  const onSubmit = async (data) => {
    const bookInfo = {
      ...data,
      icon: selectedIcon,
      themeColor: selectedColor,
      openingBalance: parseFloat(data.openingBalance || 0),
      currentBalance: parseFloat(data.openingBalance || 0),
      createdAt: new Date().toISOString(),
      type: bookType,
      createdBy: {
        email: user?.email,
        displayName: user?.displayName || "",
        photoURL: user?.photoURL || "",
      },
      status: "active",
      totalIncome: 0,
      totalExpense: 0,
      budgets: [],
    };

    try {
      const res = await createBook(bookInfo);

      if (res?.insertedId || res?.acknowledged) {
        toast.success(`"${data.bookName}" created successfully!`);
        console.log("Submitted Data:", bookInfo);

        // reset input and default values
        reset();
        setSelectedIcon("wallet");
        setSelectedColor("#006A4E");
        setBookType("STANDARD");

        // close modal
        // closeModal();
        document.getElementById("create_book_modal_cashin")?.close();
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error?.message || `Failed to create "${data.bookName}"`);
    }
  };

  return (
    <div className="modal-box max-w-xl">
      <div className="flex items-center justify-between px-4 md:px-6 md:pt-6 pb-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Create New Book</h2>
          <p className="text-sm mt-1">
            Organize your finances into a dedicated ledger.
          </p>
        </div>
        <button
          // onClick={closeModal}
          onClick={() => document.getElementById("create_book_modal_cashin")?.close()}
          type="button"
          className="hover:text-gray-600 cursor-pointer hover:bg-primary/10 transition-colors p-1 rounded-lg"
        >
          <IoClose className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-5">
        {/* Book Name Field */}
        <div>
          <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider">
            Book Name
          </label>
          <input
            type="text"
            placeholder="e.g. Travel Fund 2026"
            {...register("bookName", {
              required: "Book name is required",
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters",
              },
            })}
            className={`w-full px-4 py-3 text-sm rounded-xl border border-primary/20 ${
              errors.bookName
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-100"
            } outline-none focus:ring-4 transition-all text-gray-800`}
          />
          {errors.bookName && (
            <span className="text-xs text-red-500 mt-1 block font-medium">
              {errors.bookName.message}
            </span>
          )}
        </div>

        {/* Book Type Select */}
        <div>
          <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider">
            Book Type
          </label>
          <select
            {...register("type", { required: "Please select a book type" })}
            className="w-full bg-base-100 px-4 py-3 text-sm rounded-xl border border-primary/20 focus:border-emerald-500 focus:ring-emerald-100 outline-none transition-all"
          >
            {bookTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
          {errors.type && (
            <span className="text-xs text-red-500 mt-1 block font-medium">
              {errors.type.message}
            </span>
          )}
        </div>

        {/* Balance & Target Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div
            className={
              bookType.startsWith("TARGET") ? "sm:col-span-6" : "sm:col-span-12"
            }
          >
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider">
              Opening Balance
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-base font-medium">৳</span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("openingBalance", {
                  min: { value: 0, message: "Balance cannot be negative" },
                })}
                className="w-full pl-8 pr-4 py-3 text-sm rounded-xl border border-primary/20 focus:border-emerald-500 focus:ring-emerald-100 outline-none transition-all text-gray-800"
              />
            </div>
          </div>

          {/* Target Amount Field (Only shows if TARGET is selected) */}
          {bookType.startsWith("TARGET") && (
            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider">
                Target Amount
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-base font-medium">৳</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="50000.00"
                  {...register("targetAmount", {
                    required: "Target amount is required for goal books",
                  })}
                  className="w-full pl-8 pr-4 py-3 text-sm rounded-xl border border-primary/20 focus:border-emerald-500 focus:ring-emerald-100 outline-none transition-all text-gray-800"
                />
              </div>
            </div>
          )}
        </div>

        {/* Icon Picker */}
        <div>
          <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider">
            Select Icon
          </label>
          <div className="flex items-center space-x-2 pt-0.5">
            {icons.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedIcon(item.id)}
                className={`text-sm p-2 rounded-xl transition-all duration-200 flex items-center justify-center ${
                  selectedIcon === item.id
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-500 shadow-sm"
                    : "text-gray-500 hover:bg-gray-100 border border-transparent"
                }`}
              >
                {item.component}
              </button>
            ))}
          </div>
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider">
            Description
          </label>
          <textarea
            rows="2"
            placeholder="What is the purpose of this book?"
            {...register("description")}
            className="w-full px-4 py-3 text-sm rounded-xl border border-primary/20 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-gray-800 resize-none"
          ></textarea>
        </div>

        {/* Theme Color Selection */}
        <div>
          <label className="block text-xs font-semibold mb-2 uppercase tracking-wider">
            Theme Color
          </label>
          <div className="flex items-center space-x-3">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                style={{ backgroundColor: color }}
                className={`w-8 h-8 rounded-full transition-transform ${
                  selectedColor === color
                    ? "ring-2 ring-offset-2 ring-emerald-600 scale-110"
                    : "hover:scale-105"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-100 mt-6">
          <button
            // onClick={closeModal}
            onClick={() => document.getElementById("create_book_modal_cashin")?.close()}
            type="button"
            className="px-5 py-2.5 text-sm font-semibold hover:bg-primary/10 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating}
            className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-primary hover:bg-emerald-900 text-white font-medium rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <IoCheckmarkCircleOutline className="w-5 h-5" />
            {isCreating ? (
              <span className="animate-pulse">Creating Book...</span>
            ) : (
              <span>Create Book</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBookModal;
