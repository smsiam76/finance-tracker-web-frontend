import { useState, useMemo, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  PlusCircle,
  MoreVertical,
  AlertTriangle,
  Utensils,
  ShoppingBag,
  Car,
  Zap,
  BarChart3,
  Sparkles,
  Filter,
  Pencil,
  Trash2,
  Plus,
  X,
} from "lucide-react";

import { motion } from "framer-motion";

// --- Sample Data ---
const booksList = [
  { id: "all", name: "Daily Expense" },
  { id: "b1", name: "Savings" },
  { id: "b2", name: "Family Expense" },
  { id: "b3", name: "Business" },
  { id: "b4", name: "Emergency Fund" },
];

const categoriesList = [
  "Food & Dining",
  "Shopping",
  "Transport",
  "Utilities",
  "Entertainment",
  "Healthcare",
];

const initialBudgets = [
  {
    id: "1",
    bookId: "b1",
    category: "Food & Dining",
    description: "Monthly grocery & dining allowance",
    spent: 450.0,
    budgetAmount: 800.0,
    period: "Monthly",
    icon: Utensils,
  },
  {
    id: "2",
    bookId: "b1",
    category: "Shopping",
    description: "Luxury & lifestyle expenses",
    spent: 620.0,
    budgetAmount: 500.0,
    period: "Monthly",
    icon: ShoppingBag,
  },
  {
    id: "3",
    bookId: "b2",
    category: "Transport",
    description: "Commute, fuel, and ride-sharing",
    spent: 180.0,
    budgetAmount: 300.0,
    period: "Monthly",
    icon: Car,
  },
  {
    id: "4",
    bookId: "b3",
    category: "Utilities",
    description: "Electricity, water, and internet",
    spent: 210.0,
    budgetAmount: 450.0,
    period: "Monthly",
    icon: Zap,
  },
];

export const Budget = () => {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [selectedFilterBook, setSelectedFilterBook] = useState("all");
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modals States
  const [editingBudget, setEditingBudget] = useState(null);
  const [expenseBudget, setExpenseBudget] = useState(null);

  const menuRef = useRef(null);

  // Close dropdown menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. Create Budget Form Handler
  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: errorsCreate },
  } = useForm({
    defaultValues: {
      bookId: "b1",
      category: "Food & Dining",
      budgetAmount: "",
      period: "Monthly",
    },
  });

  const handleSaveBudget = (data) => {
    const newBudget = {
      id: Date.now().toString(),
      bookId: data.bookId,
      category: data.category,
      description: `${data.period} allowance for ${data.category}`,
      spent: 0.0,
      budgetAmount: parseFloat(data.budgetAmount),
      period: data.period,
      icon: Utensils,
    };
    setBudgets([newBudget, ...budgets]);
    resetCreate();
  };

  // 2. Edit Budget Form Handler
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm();

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

  const handleUpdateBudget = (data) => {
    setBudgets(
      budgets.map((item) =>
        item.id === editingBudget.id
          ? {
              ...item,
              bookId: data.bookId,
              category: data.category,
              budgetAmount: parseFloat(data.budgetAmount),
              period: data.period,
              description: `${data.period} allowance for ${data.category}`,
            }
          : item,
      ),
    );
    setEditingBudget(null);
  };

  // 3. Add Expense Form Handler
  const {
    register: registerExpense,
    handleSubmit: handleSubmitExpense,
    reset: resetExpense,
    formState: { errors: errorsExpense },
  } = useForm();

  const handleAddExpense = (data) => {
    const expenseAmount = parseFloat(data.amount);
    setBudgets(
      budgets.map((item) =>
        item.id === expenseBudget.id
          ? {
              ...item,
              spent: item.spent + expenseAmount,
            }
          : item,
      ),
    );
    setExpenseBudget(null);
    resetExpense();
  };

  // Delete Budget
  const handleDeleteBudget = (id) => {
    setBudgets(budgets.filter((item) => item.id !== id));
    setActiveMenuId(null);
  };

  // Filtered Budgets
  const filteredBudgets = useMemo(() => {
    if (selectedFilterBook === "all") return budgets;
    return budgets.filter((b) => b.bookId === selectedFilterBook);
  }, [budgets, selectedFilterBook]);

  // Calculations
  const totalBudgeted = useMemo(
    () => filteredBudgets.reduce((acc, curr) => acc + curr.budgetAmount, 0),
    [filteredBudgets],
  );
  const totalSpent = useMemo(
    () => filteredBudgets.reduce((acc, curr) => acc + curr.spent, 0),
    [filteredBudgets],
  );
  const overallProgress = Math.min(
    Math.round((totalSpent / (totalBudgeted || 1)) * 100),
    100,
  );

  return (
    <div className="pt-6 pb-12">
      <div className="space-y-6">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Create Budget Form & Stat Card */}
          <div className="space-y-6">
            {/* Create Budget Card */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
              viewport={{ once: true, amount: 0.1 }}
              className="bg-white p-5 rounded-2xl border border-base-100 shadow-xl space-y-4"
            >
              <div className="flex items-center gap-2 text-primary">
                <PlusCircle className="w-5 h-5" />
                <h3 className="font-bold text-base ">Create Budget</h3>
              </div>

              <form
                onSubmit={handleSubmitCreate(handleSaveBudget)}
                className="space-y-3.5"
              >
                <div className="space-y-1">
                  <label className="text-[11px] font-bold  uppercase tracking-wider">
                    Book Name
                  </label>
                  <select
                    {...registerCreate("bookId", {
                      required: "Please select a book",
                    })}
                    className="w-full px-3 py-2 bg-primary/5 border border-emerald-100/80 rounded-xl text-xs font-semibold  focus:outline-none focus:border-primary"
                  >
                    {booksList
                      .filter((b) => b.id !== "all")
                      .map((book) => (
                        <option key={book.id} value={book.id}>
                          {book.name}
                        </option>
                      ))}
                  </select>
                  {errorsCreate.bookId && (
                    <p className="text-[10px] text-red-500 font-semibold">
                      {errorsCreate.bookId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold  uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    {...registerCreate("category", {
                      required: "Please select a category",
                    })}
                    className="w-full px-3 py-2 bg-primary/5 border border-emerald-100/80 rounded-xl text-xs font-semibold  focus:outline-none focus:border-primary"
                  >
                    {categoriesList.map((cat, idx) => (
                      <option key={idx} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold  uppercase tracking-wider">
                    Budget Amount (BDT)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...registerCreate("budgetAmount", {
                      required: "Amount is required",
                      min: {
                        value: 1,
                        message: "Amount must be greater than 0",
                      },
                    })}
                    className="w-full px-3 py-2 bg-primary/5 border border-emerald-100/80 rounded-xl text-xs font-bold  focus:outline-none focus:border-primary"
                  />
                  {errorsCreate.budgetAmount && (
                    <p className="text-[10px] text-red-500 font-semibold">
                      {errorsCreate.budgetAmount.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold  uppercase tracking-wider">
                    Period
                  </label>
                  <select
                    {...registerCreate("period", { required: true })}
                    className="w-full px-3 py-2 bg-primary/5 border border-emerald-100/80 rounded-xl text-xs font-semibold  focus:outline-none focus:border-primary"
                  >
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-primary hover:bg-[#00472B] text-white font-bold rounded-xl text-xs transition shadow-sm"
                >
                  Save Budget
                </button>
              </form>
            </motion.div>

            {/* Total Budgeted Stat Card */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.22, ease: "easeInOut" }}
              viewport={{ once: true, amount: 0.1 }}
              className="bg-primary/5 p-5 rounded-2xl border border-primary/10 space-y-3 shadow-xl"
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
                    })}
                  </div>
                </div>
                <div className="p-2.5 bg-emerald-200/60 text-primary rounded-xl">
                  <BarChart3 className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[11px] font-bold ">
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
            </motion.div>
          </div>

          {/* RIGHT: Cards Grid */}
          <div className="lg:col-span-2">
            {/* Top Filter Bar */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
              viewport={{ once: true, amount: 0.1 }}
              className="bg-white p-3.5 rounded-2xl border border-base-100 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 mb-8"
            >
              <div className="flex items-center gap-2 ">
                <Filter className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider ">
                  Filter by Book:
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedFilterBook}
                  onChange={(e) => setSelectedFilterBook(e.target.value)}
                  className="w-full sm:w-64 px-3 py-2 bg-primary/5 border border-primary/10 rounded-xl text-xs font-bold  focus:outline-none focus:border-primary transition"
                >
                  {booksList.map((book) => (
                    <option key={book?.id} value={book.id}>
                      {book.name}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.22, ease: "easeInOut" }}
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-8 auto-rows-max"
            >
              {filteredBudgets.length > 0 ? (
                filteredBudgets.map((item) => {
                  const IconComponent = item.icon || Utensils;
                  const isExceeded = item.spent > item.budgetAmount;
                  const diff = item.spent - item.budgetAmount;
                  const remaining = item.budgetAmount - item.spent;
                  const percentage = Math.min(
                    Math.round((item.spent / item.budgetAmount) * 100),
                    100,
                  );
                  const isMenuOpen = activeMenuId === item.id;

                  return (
                    <div
                      key={item.id}
                      className={`bg-white p-5 rounded-2xl border shadow-lg space-y-4 flex flex-col justify-between transition relative ${
                        isExceeded ? "border-red-200" : "border-base-100"
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div
                            className={`p-2.5 rounded-full ${isExceeded ? "bg-red-100 text-red-600" : "bg-emerald-100/70 text-primary"}`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>

                          <div className="flex items-center gap-2 relative">
                            {isExceeded && (
                              <span className="flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                                <AlertTriangle className="w-3 h-3" /> Exceeded
                              </span>
                            )}

                            <button
                              onClick={() =>
                                setActiveMenuId(
                                  activeMenuId === item.id ? null : item.id,
                                )
                              }
                              className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-primary/5 transition"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Action Dropdown Menu */}
                            {isMenuOpen && (
                              <div
                                ref={menuRef}
                                className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-lg border border-base-100 py-1.5 z-20 transition-all"
                              >
                                <button
                                  onClick={() => {
                                    setExpenseBudget(item);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs font-semibold  hover:bg-emerald-50 hover:text-primary flex items-center gap-2 transition"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  Add Expense
                                </button>

                                <button
                                  onClick={() => {
                                    setEditingBudget(item);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs font-semibold  hover:bg-emerald-50 hover:text-primary flex items-center gap-2 transition"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                  Edit Budget
                                </button>

                                <div className="h-px bg-base-100 my-1" />

                                <button
                                  onClick={() => handleDeleteBudget(item.id)}
                                  className="w-full text-left px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-base ">
                            {item.category}
                          </h4>
                          <p className="text-xs text-gray-400 font-medium mt-0.5">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              Spent
                            </span>
                            <p
                              className={`text-base font-black ${isExceeded ? "text-red-600" : ""}`}
                            >
                              ৳{item.spent.toFixed(2)}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              {isExceeded ? "Over Budget" : "Remaining"}
                            </span>
                            <p
                              className={`text-base font-black ${isExceeded ? "text-red-600" : "text-emerald-600"}`}
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
                            className={`h-full rounded-full transition-all duration-300 ${isExceeded ? "bg-red-600" : "bg-primary"}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="text-right text-[11px] font-semibold text-gray-400">
                          Budget: ৳{item.budgetAmount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 bg-white p-8 rounded-2xl text-center text-gray-400 font-medium border border-base-100">
                  No budgets found for the selected book.
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25, ease: "easeInOut" }}
          viewport={{ once: true, amount: 0.1 }}
          className="bg-primary text-white p-6 rounded-2xl flex flex-col md:flex-row items-center shadow-2xl justify-between gap-6 relative overflow-hidden"
        >
          <div className="space-y-1 z-10 max-w-xl">
            <h4 className="font-bold text-base ">
              Smart Saving Recommendations
            </h4>
            <p className="text-xs font-medium  leading-relaxed">
              You spent a bit extra on Shopping this month. Lowering small
              expenses will keep you right on track.
            </p>
          </div>

          <div className="relative z-10 flex-shrink-0">
            <div className="w-20 h-20 bg-white/40 rounded-full flex items-center justify-center border border-white/60 shadow-inner">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ==================== 1. EDIT BUDGET MODAL ==================== */}
      {editingBudget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-base-100 pb-3">
              <h3 className="font-bold text-base ">Edit Budget</h3>
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
                <label className="text-[11px] font-bold  uppercase tracking-wider">
                  Book Name
                </label>
                <select
                  {...registerEdit("bookId", { required: true })}
                  className="w-full px-3 py-2 bg-primary/5 border border-primary/10 rounded-xl text-xs font-semibold  focus:outline-none focus:border-primary"
                >
                  {booksList
                    .filter((b) => b.id !== "all")
                    .map((book) => (
                      <option key={book.id} value={book.id}>
                        {book.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold  uppercase tracking-wider">
                  Category
                </label>
                <select
                  {...registerEdit("category", { required: true })}
                  className="w-full px-3 py-2 bg-primary/5 border border-primary/10 rounded-xl text-xs font-semibold  focus:outline-none focus:border-primary"
                >
                  {categoriesList.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold  uppercase tracking-wider">
                  Budget Amount (BDT)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...registerEdit("budgetAmount", {
                    required: "Amount is required",
                    min: 1,
                  })}
                  className="w-full px-3 py-2 bg-primary/5 border border-primary/10 rounded-xl text-xs font-bold  focus:outline-none focus:border-primary"
                />
                {errorsEdit.budgetAmount && (
                  <p className="text-[10px] text-red-500 font-semibold">
                    {errorsEdit.budgetAmount.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold  uppercase tracking-wider">
                  Period
                </label>
                <select
                  {...registerEdit("period", { required: true })}
                  className="w-full px-3 py-2 bg-primary/5 border border-primary/10 rounded-xl text-xs font-semibold  focus:outline-none focus:border-primary"
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
                  className="w-1/2 py-2.5 bg-base-100 hover:bg-primary/10  font-bold rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-primary hover:bg-[#00472B] text-white font-bold rounded-xl text-xs transition"
                >
                  Update Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== 2. ADD EXPENSE MODAL ==================== */}
      {expenseBudget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-base-100 pb-3">
              <div>
                <h3 className="font-bold text-base ">Add Expense</h3>
                <p className="text-xs text-gray-400 font-medium">
                  Category: {expenseBudget.category}
                </p>
              </div>
              <button
                onClick={() => setExpenseBudget(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmitExpense(handleAddExpense)}
              className="space-y-3.5"
            >
              <div className="space-y-1">
                <label className="text-[11px] font-bold  uppercase tracking-wider">
                  Expense Amount (BDT)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...registerExpense("amount", {
                    required: "Please enter amount",
                    min: {
                      value: 0.01,
                      message: "Amount must be greater than 0",
                    },
                  })}
                  className="w-full px-3 py-2 bg-primary/5 border border-primary/10 rounded-xl text-xs font-bold  focus:outline-none focus:border-primary"
                />
                {errorsExpense.amount && (
                  <p className="text-[10px] text-red-500 font-semibold">
                    {errorsExpense.amount.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold  uppercase tracking-wider">
                  Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dinner with friends"
                  {...registerExpense("note")}
                  className="w-full px-3 py-2 bg-primary/5 border border-primary/10 rounded-xl text-xs font-medium  focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setExpenseBudget(null)}
                  className="w-1/2 py-2.5 bg-base-100 hover:bg-primary/10  font-bold rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-primary hover:bg-[#00472B] text-white font-bold rounded-xl text-xs transition-all duration-300 cursor-pointer"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
