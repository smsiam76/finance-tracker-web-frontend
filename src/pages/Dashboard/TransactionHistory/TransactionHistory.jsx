import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Calendar,
  Filter,
  Trash2,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import useTransactions from "../../../hooks/useTransactions";

export const TransactionHistory = () => {
  const { user } = useAuth(); // Logged-in user information
  const { transactions, isLoading, deleteTransaction, isDeleting } = useTransactions({
    email: user?.email,
  });

  // --- Local States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [dateRangeFilter, setDateRangeFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("NEWEST");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dynamically Extract Categories / Books from incoming transactions
  const categories = useMemo(() => {
    const list = new Set(["ALL"]);
    transactions.forEach((tx) => {
      if (tx.bookDetails?.name) list.add(tx.bookDetails.name);
    });
    return Array.from(list);
  }, [transactions]);

  // --- Dynamic Stat Computations ---
  const stats = useMemo(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach((tx) => {
      if (tx.type === "CASH_IN") income += tx.amount || 0;
      if (tx.type === "CASH_OUT") expense += tx.amount || 0;
    });

    return {
      totalCount: transactions.length,
      totalIncome: income,
      totalExpense: expense,
      netBalance: income - expense,
    };
  }, [transactions]);

  // --- Filter and Sort Logic ---
  const filteredData = useMemo(() => {
    return transactions
      .filter((item) => {
        if (typeFilter === "INCOME") return item.type === "CASH_IN";
        if (typeFilter === "EXPENSE") return item.type === "CASH_OUT";
        if (typeFilter === "TRANSFER") return item.type === "TRANSFER";
        return true;
      })
      .filter((item) => {
        if (categoryFilter !== "ALL") {
          return item.bookDetails?.name?.toLowerCase() === categoryFilter.toLowerCase();
        }
        return true;
      })
      .filter((item) => {
        if (dateRangeFilter === "ALL") return true;

        const txDate = new Date(item.date);
        const today = new Date();

        if (dateRangeFilter === "LAST_7_DAYS") {
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(today.getDate() - 7);
          return txDate >= sevenDaysAgo && txDate <= today;
        }

        if (dateRangeFilter === "THIS_MONTH") {
          return (
            txDate.getMonth() === today.getMonth() &&
            txDate.getFullYear() === today.getFullYear()
          );
        }

        return true;
      })
      .filter((item) => {
        const search = searchTerm.toLowerCase();
        const noteMatch = item.note?.toLowerCase().includes(search);
        const bookMatch = item.bookDetails?.name?.toLowerCase().includes(search);
        return noteMatch || bookMatch;
      })
      .sort((a, b) => {
        if (sortOrder === "NEWEST") return new Date(b.date) - new Date(a.date);
        return new Date(a.date) - new Date(b.date);
      });
  }, [transactions, searchTerm, typeFilter, categoryFilter, dateRangeFilter, sortOrder]);

  // --- Pagination Slice ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteTransaction(id);
      } catch (err) {
        console.error("Failed to delete", err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-emerald-600"></span>
      </div>
    );
  }

  return (
    <div className="pt-6 pb-12">
      <div className="space-y-10">
        {/* --- Dynamic Top 4 Stat Cards --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Transactions */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white p-5 rounded-2xl border border-base-100 shadow-lg flex items-start justify-between"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Total Transactions
                </p>
                <h3 className="text-2xl font-bold">{stats.totalCount}</h3>
              </div>
            </div>
            <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md">
              All Time
            </span>
          </motion.div>

          {/* Card 2: Total Income */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.18, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white p-5 rounded-2xl border border-base-100 shadow-lg flex items-start justify-between"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Total Income
                </p>
                <h3 className="text-2xl font-bold">৳{stats.totalIncome.toLocaleString()}</h3>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Total Expense */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.21, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white p-5 rounded-2xl border border-base-100 shadow-lg flex items-start justify-between"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                <ArrowDownRight className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Total Expense
                </p>
                <h3 className="text-2xl font-bold">৳{stats.totalExpense.toLocaleString()}</h3>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Net Balance */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.24, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-emerald-800 p-5 rounded-2xl shadow-lg text-white flex items-start justify-between relative overflow-hidden"
          >
            <div className="space-y-2 z-10">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-white backdrop-blur-sm">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-emerald-200 uppercase tracking-wider">
                  Net Balance
                </p>
                <h3 className="text-2xl font-bold">৳{stats.netBalance.toLocaleString()}</h3>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/5 rounded-full pointer-events-none" />
          </motion.div>
        </div>

        {/* --- Search & Filters Controls --- */}
        <div>
          <div className="space-y-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.27, ease: "easeInOut" }}
              viewport={{ once: true, amount: 0.1 }}
              className="bg-white mb-8 p-4 rounded-2xl border border-base-100 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by note or book name..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              {/* Dropdowns */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Date Filter */}
                <div className="relative">
                  <select
                    value={dateRangeFilter}
                    onChange={(e) => {
                      setDateRangeFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="appearance-none pl-8 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50 focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">All Dates</option>
                    <option value="LAST_7_DAYS">Last 7 Days</option>
                    <option value="THIS_MONTH">This Month</option>
                  </select>
                  <Calendar className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                </div>

                {/* Category/Book Filter */}
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="appearance-none pl-8 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50 focus:outline-none cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === "ALL" ? "All Books" : cat}
                      </option>
                    ))}
                  </select>
                  <Filter className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                </div>

                {/* Type Switcher */}
                <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
                  {[
                    { label: "All", value: "ALL" },
                    { label: "Income", value: "INCOME" },
                    { label: "Expense", value: "EXPENSE" },
                    { label: "Transfer", value: "TRANSFER" },
                  ].map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => {
                        setTypeFilter(tab.value);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        typeFilter === tab.value
                          ? "bg-white text-emerald-700 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Sort Button */}
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "NEWEST" ? "OLDEST" : "NEWEST")
                  }
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {sortOrder === "NEWEST" ? "Newest First" : "Oldest First"}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* --- Dynamic Data Table --- */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white rounded-2xl border border-base-100 shadow-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-base-100 text-[11px] font-bold uppercase tracking-wider bg-slate-50 text-slate-500">
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6">Note</th>
                    <th className="py-4 px-6">Book</th>
                    <th className="py-4 px-6">Type</th>
                    <th className="py-4 px-6">Amount(৳)</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-100 text-xs font-medium">
                  {paginatedData.length > 0 ? (
                    paginatedData.map((tx) => {
                      const txDate = new Date(tx.date);
                      const formattedDate = `${txDate.getDate()} ${txDate.toLocaleString(
                        "default",
                        { month: "short" }
                      )} ${txDate.getFullYear()}`;

                      return (
                        <tr key={tx._id} className="hover:bg-slate-50 transition">
                          {/* Date */}
                          <td className="py-4 px-6 w-28">
                            <span className="font-semibold block text-slate-700">
                              {formattedDate}
                            </span>
                          </td>

                          {/* Note / Description */}
                          <td className="py-4 px-6">
                            <div className="font-bold text-xs text-slate-800">
                              {tx.note || "No note provided"}
                            </div>
                          </td>

                          {/* Book Details */}
                          <td className="py-4 px-6 font-medium">
                            <span
                              className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-white"
                              style={{
                                backgroundColor: tx.bookDetails?.color || "#10B981",
                              }}
                            >
                              {tx.bookDetails?.name || "N/A"}
                            </span>
                          </td>

                          {/* Type */}
                          <td className="py-4 px-6">
                            <span
                              className={`font-bold text-[11px] ${
                                tx.type === "CASH_IN"
                                  ? "text-emerald-600"
                                  : tx.type === "CASH_OUT"
                                  ? "text-red-500"
                                  : "text-amber-600"
                              }`}
                            >
                              {tx.type === "CASH_IN"
                                ? "Income"
                                : tx.type === "CASH_OUT"
                                ? "Expense"
                                : "Transfer"}
                            </span>
                          </td>

                          {/* Amount */}
                          <td className="py-4 px-6">
                            <span
                              className={`font-bold text-xs ${
                                tx.type === "CASH_IN"
                                  ? "text-emerald-600"
                                  : tx.type === "CASH_OUT"
                                  ? "text-red-500"
                                  : "text-slate-700"
                              }`}
                            >
                              {tx.type === "CASH_IN"
                                ? "+"
                                : tx.type === "CASH_OUT"
                                ? "-"
                                : ""}
                              ৳{tx.amount?.toLocaleString()}
                            </span>
                          </td>

                          {/* Action */}
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => handleDelete(tx._id)}
                              disabled={isDeleting}
                              className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition"
                              title="Delete Transaction"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-8 font-medium text-slate-500">
                        No transactions found matching your filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* --- Pagination Footer --- */}
            <div className="p-4 bg-slate-50 border-t border-base-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-600">
              <div>
                Showing{" "}
                <span className="font-bold text-slate-900">
                  {filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-bold text-slate-900">
                  {Math.min(currentPage * itemsPerPage, filteredData.length)}
                </span>{" "}
                of <span className="font-bold text-slate-900">{filteredData.length}</span>{" "}
                transactions
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 rounded-lg font-bold text-xs transition ${
                      currentPage === page
                        ? "bg-emerald-700 text-white shadow-sm"
                        : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};