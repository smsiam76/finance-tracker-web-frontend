import { useState, useMemo, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  PlusCircle,
  MoreVertical,
  AlertTriangle,
  BarChart3,
  Sparkles,
  Filter,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import useAuth from "../../../hooks/useAuth";
import useBooks from "../../../hooks/useBooks";
import useCategories from "../../../hooks/useCategories";
import useBudgets from "../../../hooks/useBudgets";
import useTransactions from "../../../hooks/useTransactions";

import Loader from "../../../component/Shared/Loader/Loader";
import { renderCategoryIcon } from "../../../utility/renderCategoryIcon";

export const Budget = () => {
  const { user } = useAuth();

  const { transactions = [], isLoading: isTransactionsLoading } =
    useTransactions(user?.email);

  // States
  const [selectedFilterBook, setSelectedFilterBook] = useState("all");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [editingBudget, setEditingBudget] = useState(null);

  // Pagination State (Max 4 per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const menuRef = useRef(null);

  // Books
  const { books = [], isLoading: isBookLoading } = useBooks(user?.email);

  // Categories
  const { categories = [], isLoading: isCategoriesLoading } = useCategories(
    user?.email,
  );

  // Budgets
  const {
    budgets = [],
    isLoading: isBudgetsLoading,
    createBudget,
    isCreating,
    updateBudget,
    isUpdating,
    deleteBudget,
    isDeleting,
  } = useBudgets(user?.email);

  // Filter change hole auto page 1-e reset hawya
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilterBook]);

  // Close Dropdown On Outside Click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // CREATE BUDGET FORM
  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: errorsCreate },
  } = useForm({
    defaultValues: {
      bookId: "",
      category: "",
      budgetAmount: "",
      period: "Monthly",
    },
  });

  // Create Budget (React Hot Toast integrated)
  const handleSaveBudget = async (data) => {
    try {
      const isDuplicate = budgets.some(
        (b) =>
          String(b?.bookId) === String(data?.bookId) &&
          b?.category?.toLowerCase() === data?.category?.toLowerCase(),
      );

      if (isDuplicate) {
        return toast.error(
          `A budget for "${data.category}" already exists in the selected book!`,
        );
      }

      const newBudget = {
        userEmail: user?.email,
        bookId: data.bookId,
        category: data.category,
        description: `${data.period} allowance for ${data.category}`,
        spent: 0,
        budgetAmount: Number(data.budgetAmount),
        period: data.period,
        createdAt: new Date(),
      };

      const res = await createBudget(newBudget);

      if (res?.insertedId) {
        toast.success("Your Budget Added Successfully!");
        resetCreate();
      }
      console.log(newBudget);
    } catch (error) {
      console.error("Failed to create budget:", error);
      toast.error(error?.message || "Failed to create budget");
    }
  };

  // EDIT BUDGET FORM
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm();

  // Set Edit Form Data
  useEffect(() => {
    if (editingBudget) {
      resetEdit({
        bookId: editingBudget.bookId,
        category: editingBudget.category,
        budgetAmount: editingBudget.budgetAmount,
        period: editingBudget.period,
      });
    }
  }, [editingBudget, resetEdit]);

  // Update Budget
  const handleUpdateBudget = async (data) => {
    try {
      const isDuplicate = budgets.some(
        (b) =>
          b?._id !== editingBudget._id &&
          String(b?.bookId) === String(data?.bookId) &&
          b?.category?.toLowerCase() === data?.category?.toLowerCase(),
      );

      if (isDuplicate) {
        return toast.error(
          `A budget for "${data.category}" already exists in the selected book!`,
        );
      }

      const updateBudgetInfo = {
        bookId: data.bookId,
        category: data.category,
        budgetAmount: Number(data.budgetAmount),
        period: data.period,
        description: `${data.period} allowance for ${data.category}`,
      };

      await updateBudget({
        id: editingBudget._id,
        updateBudgetInfo,
      });

      toast.success("Budget updated successfully!");
      setEditingBudget(null);
    } catch (error) {
      console.error("Failed to update budget:", error);
      toast.error(error?.message || "Failed to update budget");
    }
  };

  // DELETE BUDGET
  const handleDeleteBudget = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await deleteBudget(id);
        toast.success("Budget deleted successfully!");
        setActiveMenuId(null);
      }
    } catch (error) {
      console.error("Failed to delete budget:", error);
      toast.error(error?.message || "Failed to delete budget");
    }
  };

  // CALCULATED SPENT
  const budgetsWithCalculatedSpent = useMemo(() => {
    return budgets.map((budget) => {
      const matchedCategory = categories.find((cat) => {
        const name = cat?.name || cat;
        return name?.toLowerCase() === budget?.category?.toLowerCase();
      });

      const categoryId = matchedCategory?._id;

      const calculatedSpent = transactions
        .filter((t) => {
          const isCashOut = t?.type === "CASH_OUT";
          const isBookMatched = String(t?.bookId) === String(budget?.bookId);
          const isCategoryMatched =
            (categoryId && String(t?.categoryId) === String(categoryId)) ||
            t?.category?.toLowerCase() === budget?.category?.toLowerCase();

          return isCashOut && isBookMatched && isCategoryMatched;
        })
        .reduce((total, t) => total + Number(t?.amount || 0), 0);

      return {
        ...budget,
        spent: calculatedSpent,
      };
    });
  }, [budgets, transactions, categories]);

  // FILTERED BUDGETS
  const filteredBudgets = useMemo(() => {
    if (selectedFilterBook === "all") {
      return budgetsWithCalculatedSpent;
    }

    return budgetsWithCalculatedSpent.filter(
      (budget) => budget.bookId === selectedFilterBook,
    );
  }, [budgetsWithCalculatedSpent, selectedFilterBook]);

  // PAGINATED BUDGETS (Max 4 items)
  const paginatedBudgets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBudgets.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBudgets, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredBudgets.length / itemsPerPage);

  // TOTAL BUDGET
  const totalBudgeted = useMemo(() => {
    return filteredBudgets.reduce(
      (acc, curr) => acc + Number(curr.budgetAmount || 0),
      0,
    );
  }, [filteredBudgets]);

  // TOTAL SPENT
  const totalSpent = useMemo(() => {
    return filteredBudgets.reduce(
      (acc, curr) => acc + Number(curr.spent || 0),
      0,
    );
  }, [filteredBudgets]);

  // OVERALL PROGRESS
  const overallProgress =
    totalBudgeted > 0
      ? Math.min(Math.round((totalSpent / totalBudgeted) * 100), 100)
      : 0;

  // GET BOOK NAME
  const getBookName = (bookId) => {
    const book = books.find(
      (b) =>
        String(b?._id) === String(bookId) || String(b?.id) === String(bookId),
    );
    return book?.bookName || book?.name || "Unknown Book";
  };

  // CATEGORY ICON INFO
  const getBudgetIconInfo = (categoryName) => {
    const matchedCategory = categories.find((cat) => {
      const name = cat?.name || cat;
      return name?.toLowerCase() === categoryName?.toLowerCase();
    });

    const iconName =
      matchedCategory?.icon ||
      matchedCategory?.iconName ||
      getFallbackIconKey(categoryName);

    const iconColor = matchedCategory?.color || "#22c55e";

    return { iconName, iconColor };
  };

  // FALLBACK ICON
  const getFallbackIconKey = (name = "") => {
    const lower = name.toLowerCase();

    if (
      lower.includes("food") ||
      lower.includes("utensil") ||
      lower.includes("dining")
    ) {
      return "utensils";
    }
    if (
      lower.includes("bus") ||
      lower.includes("travel") ||
      lower.includes("transport")
    ) {
      return "bus";
    }
    if (lower.includes("shop") || lower.includes("buy")) {
      return "shopping-bag";
    }
    if (lower.includes("med") || lower.includes("health")) {
      return "pill";
    }
    if (lower.includes("movie") || lower.includes("film")) {
      return "film";
    }
    if (lower.includes("edu") || lower.includes("study")) {
      return "graduation-cap";
    }
    if (lower.includes("bill") || lower.includes("electric")) {
      return "lightbulb";
    }
    if (lower.includes("home") || lower.includes("rent")) {
      return "home";
    }
    if (lower.includes("salary") || lower.includes("cash")) {
      return "banknote";
    }

    return "circle";
  };

  // LOADING
  if (
    isBudgetsLoading ||
    isBookLoading ||
    isCategoriesLoading ||
    isTransactionsLoading
  ) {
    return <Loader />;
  }

  return (
    <div className="pt-6 pb-12">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6 flex flex-col justify-between">
            {/* CREATE BUDGET */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
              viewport={{ once: true, amount: 0.1 }}
              className="bg-white py-6 px-5 rounded-2xl border border-base-100 shadow-xl space-y-4"
            >
              <div className="flex items-center gap-2 text-primary">
                <PlusCircle className="w-5 h-5" />
                <h3 className="font-bold text-base">Create Budget</h3>
              </div>
              <span className="divider"></span>
              <form
                onSubmit={handleSubmitCreate(handleSaveBudget)}
                className="space-y-4"
              >
                {/* BOOK */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider">
                    Book Name
                  </label>
                  <select
                    {...registerCreate("bookId", {
                      required: "Please select a book",
                    })}
                    className="w-full px-3 py-2 bg-primary/5 border border-emerald-100/80 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary"
                  >
                    <option value="">Select a Book</option>
                    {books.map((book) => {
                      const bookId = book?._id;
                      return (
                        <option key={bookId} value={bookId}>
                          {book?.bookName || book?.name}
                        </option>
                      );
                    })}
                  </select>
                  {errorsCreate.bookId && (
                    <p className="text-[10px] text-red-500 font-semibold">
                      {errorsCreate.bookId.message}
                    </p>
                  )}
                </div>

                {/* CATEGORY */}
                {/* <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    {...registerCreate("category", {
                      required: "Please select a category",
                    })}
                    className="w-full px-3 py-2 bg-primary/5 border border-emerald-100/80 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat, idx) => (
                      <option key={cat?._id || idx} value={cat?.name || cat}>
                        {cat?.name || cat}
                      </option>
                    ))}
                  </select>
                  {errorsCreate.category && (
                    <p className="text-[10px] text-red-500 font-semibold">
                      {errorsCreate.category.message}
                    </p>
                  )}
                </div> */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    {...registerCreate("category", {
                      required: "Please select a category",
                    })}
                    className="w-full px-3 py-2 bg-primary/5 border border-emerald-100/80 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary"
                  >
                    <option value="">Select Category</option>
                    {categories
                      // Expense/CASH_OUT 
                      .filter(
                        (cat) =>
                          cat?.type === "EXPENSE" || cat?.type === "CASH_OUT",
                      )
                      .map((cat, idx) => (
                        <option key={cat?._id || idx} value={cat?.name || cat}>
                          {cat?.name || cat}
                        </option>
                      ))}
                  </select>
                  {errorsCreate.category && (
                    <p className="text-[10px] text-red-500 font-semibold">
                      {errorsCreate.category.message}
                    </p>
                  )}
                </div>

                {/* AMOUNT */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider">
                    Budget Amount (BDT)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="0.00"
                    {...registerCreate("budgetAmount", {
                      required: "Amount is required",
                      min: {
                        value: 1,
                        message: "Amount must be greater than 0",
                      },
                    })}
                    className="w-full px-3 py-2 bg-primary/5 border border-emerald-100/80 rounded-xl text-xs font-bold focus:outline-none focus:border-primary"
                  />
                  {errorsCreate.budgetAmount && (
                    <p className="text-[10px] text-red-500 font-semibold">
                      {errorsCreate.budgetAmount.message}
                    </p>
                  )}
                </div>

                {/* PERIOD */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider">
                    Period
                  </label>
                  <select
                    {...registerCreate("period", {
                      required: "Please select a period",
                    })}
                    className="w-full px-3 py-2 bg-primary/5 border border-emerald-100/80 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary"
                  >
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>

                {/* SAVE */}
                <button
                  type="submit"
                  disabled={isCreating}
                  className="mt-6 w-full py-3.5 bg-primary hover:bg-[#00472B] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs transition shadow-sm"
                >
                  {isCreating ? "Saving..." : "Save Budget"}
                </button>
              </form>
            </motion.div>

            {/* SUMMARY CARD */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.22, ease: "easeInOut" }}
              viewport={{ once: true, amount: 0.1 }}
              className="bg-white p-5 rounded-2xl border border-primary/10 space-y-3 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                    TOTAL BUDGETED
                  </span>
                  <div className="text-2xl font-black text-primary mt-0.5">
                    ৳
                    {totalBudgeted.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
                <div className="p-2.5 bg-emerald-200/60 text-primary rounded-xl">
                  <BarChart3 className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span>Overall Progress</span>
                  <span>{overallProgress}%</span>
                </div>
                <div className="w-full bg-primary/10 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-300"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-gray-400 font-semibold">
                <span>Spent: ৳{totalSpent.toFixed(2)}</span>
                <span>
                  {filteredBudgets.length} budget
                  {filteredBudgets.length !== 1 ? "s" : ""}
                </span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2">
            {/* FILTER */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
              viewport={{ once: true, amount: 0.1 }}
              className="bg-white p-3.5 rounded-2xl border border-base-100 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 mb-8"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Filter by Book:
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedFilterBook}
                  onChange={(e) => setSelectedFilterBook(e.target.value)}
                  className="w-full sm:w-64 px-3 py-2 bg-primary/5 border border-primary/10 rounded-xl text-xs font-bold focus:outline-none focus:border-primary transition"
                >
                  <option value="all">All Books</option>
                  {books.map((book) => {
                    const bookId = book?._id || book?.id;
                    return (
                      <option key={bookId} value={bookId}>
                        {book?.bookName || book?.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </motion.div>

            {/* BUDGET CARDS */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.22, ease: "easeInOut" }}
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-8 auto-rows-max"
            >
              {paginatedBudgets.length > 0 ? (
                paginatedBudgets.map((item) => {
                  const budgetAmount = Number(item?.budgetAmount || 0);
                  const spent = Number(item?.spent || 0);
                  const isExceeded = spent > budgetAmount;
                  const diff = spent - budgetAmount;
                  const remaining = budgetAmount - spent;
                  const percentage =
                    budgetAmount > 0
                      ? Math.min(Math.round((spent / budgetAmount) * 100), 100)
                      : 0;

                  const isMenuOpen = activeMenuId === item?._id;
                  const { iconName, iconColor } = getBudgetIconInfo(
                    item?.category,
                  );
                  const bookName = getBookName(item?.bookId);

                  return (
                    <div
                      key={item?._id}
                      className={`bg-white p-5 rounded-2xl border shadow-lg space-y-4 flex flex-col justify-between transition relative ${
                        isExceeded ? "border-red-200" : "border-base-100"
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-2 items-center">
                            <span
                              className={`p-2.5 rounded-full block w-fit ${
                                isExceeded ? "bg-red-100" : "bg-emerald-100/70"
                              }`}
                            >
                              {renderCategoryIcon(
                                iconName,
                                isExceeded ? "#dc2626" : iconColor,
                                "w-5 h-5",
                              )}
                            </span>

                            <div>
                              <h4 className="font-bold text-sm">
                                {item?.category}
                              </h4>
                              <p className="text-[10px] text-gray-400 font-semibold">
                                {bookName}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 relative">
                            {isExceeded && (
                              <span className="flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                                <AlertTriangle className="w-3 h-3" />
                                Exceeded
                              </span>
                            )}

                            <button
                              onClick={() =>
                                setActiveMenuId(
                                  activeMenuId === item?._id ? null : item?._id,
                                )
                              }
                              className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-primary/5 transition"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {isMenuOpen && (
                              <div
                                ref={menuRef}
                                className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-lg border border-base-100 py-1.5 z-20"
                              >
                                <button
                                  onClick={() => {
                                    setEditingBudget(item);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs font-semibold hover:bg-emerald-50 hover:text-primary flex items-center gap-2 transition"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                  Edit Budget
                                </button>

                                <div className="h-px bg-base-100 my-1" />

                                <button
                                  onClick={() => handleDeleteBudget(item?._id)}
                                  disabled={isDeleting}
                                  className="w-full text-left px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 transition disabled:opacity-50"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  {isDeleting ? "Deleting..." : "Delete"}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 font-medium mt-0.5">
                            {item?.description}
                          </p>

                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-primary font-bold">
                              {item?.period}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              Spent
                            </span>

                            <p
                              className={`text-base font-black ${
                                isExceeded ? "text-red-600" : ""
                              }`}
                            >
                              ৳{spent.toFixed(2)}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              {isExceeded ? "Over Budget" : "Remaining"}
                            </span>

                            <p
                              className={`text-base font-black ${
                                isExceeded ? "text-red-600" : "text-emerald-600"
                              }`}
                            >
                              {isExceeded
                                ? `-৳${diff.toFixed(2)}`
                                : `৳${remaining.toFixed(2)}`}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-primary/5">
                        <div className="w-full bg-base-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isExceeded ? "bg-red-600" : "bg-primary"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400">
                          <span>{percentage}% used</span>
                          <span>Budget: ৳{budgetAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 bg-white p-8 rounded-2xl text-center text-gray-400 font-medium border border-base-100">
                  No budgets found.
                </div>
              )}
            </motion.div>

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.24, ease: "easeInOut" }}
                viewport={{ once: true, amount: 0.1 }}
                className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-base-100 shadow-md mt-6"
              >
                <p className="text-xs font-semibold text-gray-400">
                  Page{" "}
                  <span className="text-primary font-bold">{currentPage}</span>{" "}
                  of <span className="font-bold">{totalPages}</span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 bg-primary/5 hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed text-primary font-bold rounded-xl text-xs transition"
                  >
                    Previous
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                            currentPage === pageNum
                              ? "bg-primary text-white shadow-sm"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {pageNum}
                        </button>
                      ),
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 bg-primary/5 hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed text-primary font-bold rounded-xl text-xs transition"
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* SMART SAVING */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25, ease: "easeInOut" }}
          viewport={{ once: true, amount: 0.1 }}
          className="bg-primary text-white p-6 rounded-2xl flex flex-col md:flex-row items-center shadow-2xl justify-between gap-6 relative overflow-hidden"
        >
          <div className="space-y-1 z-10 max-w-xl">
            <h4 className="font-bold text-base">
              Smart Saving Recommendations
            </h4>

            <p className="text-xs font-medium leading-relaxed">
              {filteredBudgets.some(
                (budget) =>
                  Number(budget?.spent || 0) >
                  Number(budget?.budgetAmount || 0),
              )
                ? "Some of your budgets have been exceeded. Consider reviewing those expenses."
                : "You are currently within your budget limits. Keep tracking your expenses to stay on track."}
            </p>
          </div>

          <div className="relative z-10 flex-shrink-0">
            <div className="w-20 h-20 bg-white/40 rounded-full flex items-center justify-center border border-white/60 shadow-inner">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* EDIT BUDGET MODAL */}
      {editingBudget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-base-100 pb-3">
              <h3 className="font-bold text-base">Edit Budget</h3>

              <button
                onClick={() => setEditingBudget(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmitEdit(handleUpdateBudget)}
              className="space-y-3.5"
            >
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider">
                  Book Name
                </label>

                <select
                  {...registerEdit("bookId", {
                    required: "Please select a book",
                  })}
                  className="w-full px-3 py-2 bg-primary/5 border border-primary/10 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary"
                >
                  <option value="">Select a Book</option>
                  {books.map((book) => {
                    const bookId = book?._id || book?.id;
                    return (
                      <option key={bookId} value={bookId}>
                        {book?.bookName || book?.name}
                      </option>
                    );
                  })}
                </select>

                {errorsEdit.bookId && (
                  <p className="text-[10px] text-red-500 font-semibold">
                    {errorsEdit.bookId.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider">
                  Category
                </label>

                <select
                  {...registerEdit("category", {
                    required: "Please select a category",
                  })}
                  className="w-full px-3 py-2 bg-primary/5 border border-primary/10 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat, idx) => (
                    <option key={cat?._id || idx} value={cat?.name || cat}>
                      {cat?.name || cat}
                    </option>
                  ))}
                </select>

                {errorsEdit.category && (
                  <p className="text-[10px] text-red-500 font-semibold">
                    {errorsEdit.category.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider">
                  Budget Amount (BDT)
                </label>

                <input
                  type="number"
                  step="0.01"
                  min="1"
                  {...registerEdit("budgetAmount", {
                    required: "Amount is required",
                    min: {
                      value: 1,
                      message: "Amount must be greater than 0",
                    },
                  })}
                  className="w-full px-3 py-2 bg-primary/5 border border-primary/10 rounded-xl text-xs font-bold focus:outline-none focus:border-primary"
                />

                {errorsEdit.budgetAmount && (
                  <p className="text-[10px] text-red-500 font-semibold">
                    {errorsEdit.budgetAmount.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider">
                  Period
                </label>

                <select
                  {...registerEdit("period", {
                    required: "Please select a period",
                  })}
                  className="w-full px-3 py-2 bg-primary/5 border border-primary/10 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary"
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBudget(null)}
                  className="w-1/2 py-2.5 bg-base-100 hover:bg-primary/10 font-bold rounded-xl text-xs transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-1/2 py-2.5 bg-primary hover:bg-[#00472B] disabled:bg-gray-400 text-white font-bold rounded-xl text-xs transition"
                >
                  {isUpdating ? "Updating..." : "Update Budget"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
