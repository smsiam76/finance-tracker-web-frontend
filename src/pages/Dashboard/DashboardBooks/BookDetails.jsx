import { Link, useParams } from "react-router";
import { useState, useMemo } from "react";
import {
  TrendingUp,
  Search,
  ChevronDown,
  Wallet,
  ArrowLeftRight,
  // Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import Loader from "../../../component/Shared/Loader/Loader";
import useAuth from "../../../hooks/useAuth";
import useBooks from "../../../hooks/useBooks";
import useTransactions from "../../../hooks/useTransactions";
import useCategories from "../../../hooks/useCategories";

const BalanceCard = ({ balance = 0, bookName = "Ledger" }) => (
  <motion.div
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="md:col-span-4 bg-white p-5 rounded-2xl shadow-xl border border-primary/10 flex flex-col justify-between"
  >
    <div>
      <p className="text-xs font-semibold tracking-wider uppercase text-gray-500">
        Current Balance
      </p>
      <h2 className="text-xl lg:text-3xl font-extrabold text-primary mt-2">
        ৳{Number(balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </h2>
    </div>
    <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium mt-4">
      <TrendingUp size={14} />
      <span>Book: {bookName}</span>
    </div>
  </motion.div>
);

const ExpenseRatioCard = ({ totalIncome = 0, totalExpense = 0 }) => {
  const usagePercent =
    totalIncome > 0
      ? Math.min(Math.round((totalExpense / totalIncome) * 100), 100)
      : 0;

  const getProgressColor = (percent) => {
    if (percent >= 90) return "bg-red-500";
    if (percent >= 75) return "bg-amber-500";
    return "bg-primary";
  };

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="md:col-span-5 bg-white p-5 rounded-2xl shadow-xl border border-primary/10 flex flex-col"
    >
      <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 divide-x divide-gray-100">
        <div>
          <p className="text-xs font-semibold text-gray-500">Total Income</p>
          <p className="text-lg font-bold text-primary mt-1">
            ৳{totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="pl-4 md:pl-0 lg:pl-4">
          <p className="text-xs font-semibold text-gray-500">Total Expense</p>
          <p className="text-lg font-bold text-[#D9383A] mt-1">
            ৳
            {totalExpense.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
          <span className="text-gray-600">Expense Ratio</span>
          <span className="font-bold text-gray-800">{usagePercent}%</span>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
              usagePercent,
            )}`}
            style={{ width: `${usagePercent}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

const QuickActionsCard = () => (
  <motion.div
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.3, delay: 0.2 }}
    className="col-span-3 bg-white p-5 rounded-2xl shadow-xl border border-primary/10 flex flex-col justify-between"
  >
    <p className="text-xs font-semibold tracking-wider uppercase text-gray-500 mb-2">
      Quick Actions
    </p>
    <div className="flex flex-col gap-2">
      <Link
        to="/dashboard/budget-management"
        className="w-full bg-primary hover:bg-[#008f5b] text-white font-medium py-2 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
      >
        <Wallet className="text-lg" />
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
);

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  // Filter & Sort State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("date-desc");

  // API Hooks
  const { singleBook, isSingleBookLoading, singleBookError } = useBooks(
    null,
    id,
  );
  const {
    transactions = [],
    isLoading: isTransactionsLoading,
    // deleteTransaction,
  } = useTransactions({ email: user?.email, bookId: id });
  const { categories: categoriesList = [], isLoading: isCategoriesLoading } =
    useCategories(user?.email);

  // Category ID-to-Name Lookup Map
  const categoryMap = useMemo(() => {
    return categoriesList.reduce((acc, cat) => {
      acc[cat._id] = cat.name;
      return acc;
    }, {});
  }, [categoriesList]);

  // Book Specific Transactions
  const bookTransactions = useMemo(() => {
    if (!singleBook?._id) return [];
    return transactions.filter(
      (tx) => String(tx.bookId) === String(singleBook._id),
    );
  }, [transactions, singleBook]);

  // Dynamic Category Options for Dropdown
  const categoryOptions = useMemo(() => {
    const list = bookTransactions
      .map((tx) => categoryMap[tx.categoryId])
      .filter(Boolean);
    return ["All", ...Array.from(new Set(list))];
  }, [bookTransactions, categoryMap]);

  // Processed Transactions Data
  const filteredTransactions = useMemo(() => {
    return bookTransactions
      .filter((tx) => {
        const catName = categoryMap[tx.categoryId] || "";
        const search = searchTerm.toLowerCase();

        const matchesSearch =
          (tx.title || "").toLowerCase().includes(search) ||
          (tx.note || "").toLowerCase().includes(search) ||
          catName.toLowerCase().includes(search);

        const matchesCategory =
          selectedCategory === "All" || catName === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt || 0);
        const dateB = new Date(b.date || b.createdAt || 0);
        const amountA = Math.abs(parseFloat(a.amount) || 0);
        const amountB = Math.abs(parseFloat(b.amount) || 0);

        switch (sortBy) {
          case "date-asc":
            return dateA - dateB;
          case "amount-high":
            return amountB - amountA;
          case "amount-low":
            return amountA - amountB;
          case "date-desc":
          default:
            return dateB - dateA;
        }
      });
  }, [bookTransactions, searchTerm, selectedCategory, sortBy, categoryMap]);

  // const handleDelete = async (txId) => {
  //   try {
  //     await deleteTransaction(txId);
  //   } catch (err) {
  //     console.error("Delete failed:", err);
  //   }
  // };

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

  const isFiltered =
    searchTerm !== "" || selectedCategory !== "All" || sortBy !== "date-desc";

  return (
    <div>
      {/* SECTION 1: TOP SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-10">
        <BalanceCard
          balance={singleBook?.currentBalance}
          bookName={singleBook?.bookName}
        />
        <ExpenseRatioCard
          totalIncome={parseFloat(singleBook?.totalIncome) || 0}
          totalExpense={parseFloat(singleBook?.totalExpense) || 0}
        />
        <QuickActionsCard />
      </div>

      {/* SECTION 2: TRANSACTIONS TABLE */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-white p-6 rounded-2xl shadow-xl border border-primary/10"
      >
        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-6">
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
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
            {/* Sort Dropdown */}
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
                className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-base-100 border border-primary/25 rounded-xl px-3 py-2 pr-8 text-xs font-medium text-gray-600 focus:outline-none cursor-pointer"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
              />
            </div>

            {/* Reset Filters */}
            {isFiltered && (
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

        {/* Table Render */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Note</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2">Type</th>
                <th className="py-3 px-2 text-right">Amount</th>
                <th className="py-3 px-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredTransactions.map((tx) => {
                // Check if transaction is Income / Money-In
                const isIncome =
                  tx.type === "CASH_IN" ||
                  (tx.type === "TRANSFER" && tx.transferType === "IN");

                const categoryName =
                  categoryMap[tx.categoryId] || tx.category || "General";

                const formattedDate = tx.date
                  ? new Date(tx.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "N/A";

                // Display Custom Label for Transfer Types
                const getTypeDisplay = (transaction) => {
                  if (transaction.type === "TRANSFER") {
                    return transaction.transferType === "IN"
                      ? "Transfer (Inflow)"
                      : "Transfer (Outflow)";
                  }
                  return transaction.type;
                };

                return (
                  <tr
                    key={tx._id || tx.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-3.5 px-2 text-xs">{formattedDate}</td>
                    <td className="py-3.5 px-2">
                      <p className="text-xs font-medium text-gray-700">
                        {tx.note || tx.title || "—"}
                      </p>
                    </td>
                    <td className="py-3.5 px-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800">
                        {categoryName}
                      </span>
                    </td>
                    {/* Dynamic Type & Color Highlight */}
                    <td
                      className={`py-3.5 px-2 font-semibold text-xs ${
                        isIncome ? "text-primary" : "text-[#D9383A]"
                      }`}
                    >
                      {getTypeDisplay(tx)}
                    </td>
                    {/* Dynamic Amount Sign & Color */}
                    <td
                      className={`py-3.5 px-2 text-right font-bold text-sm ${
                        isIncome ? "text-primary" : "text-[#D9383A]"
                      }`}
                    >
                      {isIncome ? "+" : "-"}৳
                      {Math.abs(parseFloat(tx.amount) || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      {/* Action Buttons */}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default BookDetails;
