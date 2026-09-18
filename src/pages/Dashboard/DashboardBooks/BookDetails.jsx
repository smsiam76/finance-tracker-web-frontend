import { Link, useParams } from "react-router";
import { useState, useMemo } from "react";
import {
  TrendingUp,
  Search,
  ChevronDown,
  Wallet,
  ArrowLeftRight,
  Trash2,
} from "lucide-react";
import Loader from "../../../component/Shared/Loader/Loader";
import { motion } from "framer-motion";
import useAuth from "../../../hooks/useAuth";
import useBooks from "../../../hooks/useBooks";
import useTransactions from "../../../hooks/useTransactions";
import useCategories from "../../../hooks/useCategories";

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  // Filter & Sort States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("date-desc"); // default: Newest First

  // Fetching real book and transaction data from hooks
  const { singleBook, isSingleBookLoading, singleBookError } = useBooks(
    null,
    id,
  );

  console.log(singleBook);

  const {
    transactions = [],
    isLoading: isTransactionsLoading,
    deleteTransaction,
  } = useTransactions({ email: user?.email, bookId: id });

  const { categories: categoriesList = [], isLoading: isCategoriesLoading } =
    useCategories(user?.email);

  // Dynamically extract unique categories from backend transactions
  // const categories = useMemo(() => {
  //   const list = transactions
  //     .map((item) => item.category)
  //     .filter((cat) => Boolean(cat));
  //   return ["All", ...Array.from(new Set(list))];
  // }, [transactions]);

  // fast lookup match
  const categoryMap = useMemo(() => {
    return categoriesList.reduce((acc, cat) => {
      acc[cat._id] = cat.name;
      return acc;
    }, {});
  }, [categoriesList]);

  // extract category name for dropdown
  const categories = useMemo(() => {
    const list = transactions
      .map((item) => categoryMap[item.categoryId])
      .filter((name) => Boolean(name));
    return ["All", ...Array.from(new Set(list))];
  }, [transactions, categoryMap]);

  // Filter & Sort Logic
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((item) => {
        const categoryName = categoryMap[item.categoryId] || "";

        // Search Filter (Title, Category Name, or Note)
        const matchesSearch =
          (item.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.note || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          categoryName.toLowerCase().includes(searchTerm.toLowerCase());

        // Category Filter
        const matchesCategory =
          selectedCategory === "All" || categoryName === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt || 0);
        const dateB = new Date(b.date || b.createdAt || 0);
        const amountA = Math.abs(parseFloat(a.amount) || 0);
        const amountB = Math.abs(parseFloat(b.amount) || 0);

        if (sortBy === "date-desc") {
          return dateB - dateA;
        }
        if (sortBy === "date-asc") {
          return dateA - dateB;
        }
        if (sortBy === "amount-high") {
          return amountB - amountA;
        }
        if (sortBy === "amount-low") {
          return amountA - amountB;
        }
        return 0;
      });
  }, [transactions, searchTerm, selectedCategory, sortBy, categoryMap]);

  // Budget Percentage Calculation
  const totalIncome = parseFloat(singleBook?.totalIncome) || 0;
  const totalExpense = parseFloat(singleBook?.totalExpense) || 0;

  const budgetUsagePercent =
    totalIncome > 0
      ? Math.min(
          Math.round(
            (totalExpense / totalIncome) * 100,
          ),
          100,
        )
      : 0;

  const handleDeleteTransaction = async (txId) => {
    try {
      await deleteTransaction(txId);
    } catch (err) {
      console.error("Failed to delete transaction:", err);
    }
  };

  if (isSingleBookLoading || isTransactionsLoading || isCategoriesLoading) {
    return <Loader />;
  }

  if (singleBookError || !singleBook) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-bold">Book details not found.</p>
        <Link
          to="/dashboard"
          className="text-xs text-primary underline mt-2 inline-block"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="">
      {/* SECTION 1: TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-10">
        {/* Current Balance Card */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
          viewport={{ once: true, amount: 0.1 }}
          className="md:col-span-4 bg-white p-5 rounded-2xl shadow-xl border border-primary/10 flex flex-col justify-between"
        >
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase">
              Current Balance
            </p>
            <h2 className="text-xl lg:text-3xl font-extrabold text-primary mt-2">
              ৳
              {singleBook?.currentBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </h2>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium mt-4">
            <TrendingUp size={14} />
            <span>Book: {singleBook?.bookName || "Ledger"}</span>
          </div>
        </motion.div>

        {/* Monthly Income / Expense / Progress */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25, ease: "easeInOut" }}
          viewport={{ once: true, amount: 0.1 }}
          className="md:col-span-5 bg-white p-5 rounded-2xl shadow-xl border border-primary/10 flex flex-col"
        >
          <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 divide-x divide-gray-100">
            <div>
              <p className="text-xs font-semibold">Total Income</p>
              <p className="text-lg font-bold text-primary mt-1">
                ৳
                {singleBook?.totalIncome.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="pl-4 md:pl-0 lg:pl-4">
              <p className="text-xs font-semibold">Total Expense</p>
              <p className="text-lg font-bold text-[#D9383A] mt-1">
                ৳
                {singleBook?.totalExpense.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
              <span className="text-gray-600">Expense Ratio</span>
              <span className="font-bold text-gray-800">
                {budgetUsagePercent}%
              </span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-in-out ${
                  budgetUsagePercent >= 90
                    ? "bg-red-500"
                    : budgetUsagePercent >= 75
                      ? "bg-amber-500"
                      : "bg-primary"
                }`}
                style={{ width: `${budgetUsagePercent}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions Card */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35, ease: "easeInOut" }}
          viewport={{ once: true, amount: 0.1 }}
          className="col-span-3 bg-white p-5 rounded-2xl shadow-xl border border-primary/10 flex flex-col justify-between"
        >
          <p className="text-xs font-semibold tracking-wider uppercase mb-2">
            Quick Actions
          </p>
          <div className="flex flex-col gap-2">
            <Link
              to="/dashboard/budget-management"
              className="w-full bg-primary hover:bg-[#008f5b] text-white font-medium md:py-1 md:px-2 lg:py-2 lg:px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Wallet className="text-lg md:text-base lg:text-lg" />
              Create Budget
            </Link>
            <Link
              to="/dashboard/transfer-money"
              className="w-full bg-white hover:bg-emerald-50 text-primary border border-emerald-200 font-medium py-2 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeftRight
                size={18}
                className="rounded-full border border-primary"
              />
              Transfer Money
            </Link>
          </div>
        </motion.div>
      </div>

      {/* SECTION 2: TRANSACTIONS WITH FILTER & SORT */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.43, ease: "easeInOut" }}
        viewport={{ once: true, amount: 0.1 }}
        className="bg-white p-6 rounded-2xl shadow-xl border border-primary/10"
      >
        {/* Search & Filters Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-6">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2"
              size={16}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-9 pr-4 py-2 bg-base-100 border border-primary/20 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Date / Amount Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-base-100 border border-primary/25 rounded-xl px-3 py-2 pr-8 text-xs font-medium text-gray-600 focus:outline-none cursor-pointer"
              >
                <option value="date-desc">Date: Newest First</option>
                <option value="date-asc">Date: Oldest First</option>
                <option value="amount-high">Amount: High to Low</option>
                <option value="amount-low">Amount: Low to High</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>

            {/* Category Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-base-100 border border-primary/25 rounded-xl px-3 py-2 pr-8 text-xs font-medium text-gray-600 focus:outline-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>

            {/* Clear Filter Button */}
            {(searchTerm ||
              selectedCategory !== "All" ||
              sortBy !== "date-desc") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setSortBy("date-desc");
                }}
                className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-red-500 hover:bg-red-50 transition-colors"
                title="Reset Filters"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Description</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2">Type</th>
                <th className="py-3 px-2 text-right">Amount</th>
                <th className="py-3 px-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((item) => {
                  const isIncome = item.type === "CASH_IN";
                  const categoryName =
                    categoryMap[item.categoryId] || "General";

                  const formattedDate = item.date
                    ? new Date(item.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A";

                  return (
                    <tr
                      key={item._id || item.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-3.5 px-2 text-xs">{formattedDate}</td>
                      <td className="py-3.5 px-2">
                        {/* <p className="font-bold text-sm">
                          {item.title || categoryName}
                        </p> */}
                        {item.note && (
                          <p className="text-xs italic text-gray-500">
                            {item.note}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800">
                          {categoryName}
                        </span>
                      </td>
                      <td
                        className={`py-3.5 px-2 font-semibold text-xs ${
                          isIncome ? "text-primary" : "text-[#D9383A]"
                        }`}
                      >
                        {item.type}
                      </td>
                      <td
                        className={`py-3.5 px-2 text-right font-bold text-sm ${
                          isIncome ? "text-primary" : "text-[#D9383A]"
                        }`}
                      >
                        {isIncome
                          ? `+৳${(parseFloat(item.amount) || 0).toLocaleString()}`
                          : `-৳${Math.abs(parseFloat(item.amount) || 0).toLocaleString()}`}
                      </td>
                      <td className="py-3.5 px-2 text-center">
                        <button
                          disabled
                          onClick={() =>
                            handleDeleteTransaction(item._id || item.id)
                          }
                          className="text-gray-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Transaction"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-xs text-gray-400"
                  >
                    No transactions found for this book.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-4">
          <Link
            to="/dashboard/transcation-all"
            className="text-xs font-semibold text-primary hover:underline"
          >
            View More Transactions
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default BookDetails;
