import { useState, useMemo } from "react";
import { motion } from "framer-motion";

import {
  Search,
  ChevronDown,
  //   Download,
  //   FileSpreadsheet,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Building2,
  Smartphone,
  Repeat,
  Calendar,
  Filter,
} from "lucide-react";

// --- Sample Dataset Based on Backend Schemas ---
const mockTransactions = [
  {
    _id: "65b0f1a91a2b3c4d5e6f7a81",
    type: "CASH_IN",
    note: "Monthly Salary",
    subtitle: "Transaction ID: #TXN0832",
    categoryName: "Salary",
    bookName: "Personal",
    paymentMethod: "Bank",
    amount: 85000,
    status: "Completed",
    date: "2026-07-31T10:00:00.000Z",
  },
  {
    _id: "65b0f1a91a2b3c4d5e6f7a82",
    type: "CASH_OUT",
    note: "Daraz Shopping",
    subtitle: "Online Purchase",
    categoryName: "Shopping",
    bookName: "Daily Expenses",
    paymentMethod: "bKash",
    amount: 3500,
    status: "Completed",
    date: "2026-07-30T10:00:00.000Z",
  },
  {
    _id: "65b0f1a91a2b3c4d5e6f7a83",
    type: "CASH_OUT",
    note: "Electricity Bill",
    subtitle: "DESCO - House #12",
    categoryName: "Utilities",
    bookName: "Home",
    paymentMethod: "Nagad",
    amount: 2200,
    status: "Completed",
    date: "2026-07-29T10:00:00.000Z",
  },
  {
    _id: "65b0f1a91a2b3c4d5e6f7a84",
    type: "TRANSFER",
    note: "Transfer to Savings",
    subtitle: "Internal Transfer",
    categoryName: "Transfer",
    bookName: "Daily → Savings",
    paymentMethod: "Internal",
    amount: 10000,
    status: "Completed",
    date: "2026-07-28T10:00:00.000Z",
  },
  {
    _id: "65b0f1a91a2b3c4d5e6f7a85",
    type: "CASH_IN",
    note: "Freelance Payment",
    subtitle: "UI Design Project",
    categoryName: "Freelancing",
    bookName: "Business",
    paymentMethod: "Bank",
    amount: 18000,
    status: "Completed",
    date: "2026-07-27T10:00:00.000Z",
  },
  {
    _id: "65b0f1a91a2b3c4d5e6f7a86",
    type: "CASH_OUT",
    note: "Grocery Shopping",
    subtitle: "Unimart Supermarket",
    categoryName: "Grocery",
    bookName: "Daily Expenses",
    paymentMethod: "bKash",
    amount: 4500,
    status: "Completed",
    date: "2026-07-25T10:00:00.000Z",
  },
];

// Unique Category List extracted dynamically
const categories = [
  "ALL",
  "Salary",
  "Shopping",
  "Utilities",
  "Transfer",
  "Freelancing",
  "Grocery",
];

export const TransactionHistory = () => {
  // --- States for Filtering, Pagination, and Search ---
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [dateRangeFilter, setDateRangeFilter] = useState("ALL"); // ALL, LAST_7_DAYS, THIS_MONTH, LAST_MONTH
  const [sortOrder, setSortOrder] = useState("NEWEST");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- Filter and Sort Logic ---
  const filteredData = useMemo(() => {
    return mockTransactions
      .filter((item) => {
        // 1. Type Filter (CASH_IN, CASH_OUT, TRANSFER)
        if (typeFilter === "INCOME") return item.type === "CASH_IN";
        if (typeFilter === "EXPENSE") return item.type === "CASH_OUT";
        if (typeFilter === "TRANSFER") return item.type === "TRANSFER";
        return true;
      })
      .filter((item) => {
        // 2. Category Filter
        if (categoryFilter !== "ALL") {
          return (
            item.categoryName.toLowerCase() === categoryFilter.toLowerCase()
          );
        }
        return true;
      })
      .filter((item) => {
        // 3. Date Range Filter Logic
        if (dateRangeFilter === "ALL") return true;

        const txDate = new Date(item.date);
        const today = new Date("2026-08-01T00:00:00.000Z"); // Benchmark reference date

        if (dateRangeFilter === "LAST_7_DAYS") {
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(today.getDate() - 7);
          return txDate >= sevenDaysAgo && txDate <= today;
        }

        if (dateRangeFilter === "THIS_MONTH") {
          return txDate.getMonth() === 6 && txDate.getFullYear() === 2026; // July 2026
        }

        return true;
      })
      .filter((item) => {
        // 4. Search Term Filter
        const search = searchTerm.toLowerCase();
        return (
          item.note.toLowerCase().includes(search) ||
          item.bookName.toLowerCase().includes(search) ||
          item.categoryName.toLowerCase().includes(search)
        );
      })
      .sort((a, b) => {
        // 5. Sorting Logic
        if (sortOrder === "NEWEST") return new Date(b.date) - new Date(a.date);
        return new Date(a.date) - new Date(b.date);
      });
  }, [searchTerm, typeFilter, categoryFilter, dateRangeFilter, sortOrder]);

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

  // Helper for Payment Icons
  const getPaymentIcon = (method) => {
    if (method === "Bank") return <Building2 className="w-3.5 h-3.5 " />;
    if (method === "bKash" || method === "Nagad")
      return <Smartphone className="w-3.5 h-3.5 text-pink-500" />;
    return <Repeat className="w-3.5 h-3.5" />;
  };

  return (
    <div className="pt-6 pb-12">
      <div className="space-y-6">
        {/* --- Top 4 Stat Cards --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Transactions */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white p-5 rounded-2xl border border-base-100 shadow-sm flex items-start justify-between"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold  uppercase tracking-wider">
                  Total Transactions
                </p>
                <h3 className="text-2xl font-bold">124</h3>
              </div>
            </div>
            <span className="text-[11px] font-semibold  bg-primary/5 px-2 py-1 rounded-md">
              All Time
            </span>
          </motion.div>

          {/* Card 2: Total Income */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.18, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white p-5 rounded-2xl border border-base-100 shadow-sm flex items-start justify-between"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold  uppercase tracking-wider">
                  Total Income
                </p>
                <h3 className="text-2xl font-bold">৳85,000</h3>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              +12%
            </span>
          </motion.div>

          {/* Card 3: Total Expense */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.21, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white p-5 rounded-2xl border border-base-100 shadow-sm flex items-start justify-between"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                <ArrowDownRight className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold  uppercase tracking-wider">
                  Total Expense
                </p>
                <h3 className="text-2xl font-bold">৳42,500</h3>
              </div>
            </div>
            <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              -5%
            </span>
          </motion.div>

          {/* Card 4: Net Balance Highlight */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.24, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-primary p-5 rounded-2xl shadow-sm text-white flex items-start justify-between relative overflow-hidden"
          >
            <div className="space-y-2 z-10">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-white backdrop-blur-sm">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-emerald-200 uppercase tracking-wider">
                  Net Balance
                </p>
                <h3 className="text-2xl font-bold">৳42,500</h3>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/5 rounded-full pointer-events-none" />
          </motion.div>
        </div>

        {/* --- Search, Filter Controls & Exports --- */}
        <div className="space-y-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.27, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white p-4 rounded-2xl border border-base-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 " />
              <input
                type="text"
                placeholder="Search by description or book..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 bg-primary/5/50 border border-primary/10 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            {/* Dropdowns & Type Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Date Range Dropdown */}
              <div className="relative">
                <select
                  value={dateRangeFilter}
                  onChange={(e) => {
                    setDateRangeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none pl-8 pr-8 py-2 bg-white border border-primary/10 rounded-xl text-xs font-semibold  hover:bg-primary/5 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Dates</option>
                  <option value="LAST_7_DAYS">Last 7 Days</option>
                  <option value="THIS_MONTH">This Month (July 2026)</option>
                </select>
                <Calendar className="w-3.5 h-3.5  absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <ChevronDown className="w-3.5 h-3.5  absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Category Dropdown */}
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none pl-8 pr-8 py-2 bg-white border border-primary/10 rounded-xl text-xs font-semibold  hover:bg-primary/5 focus:outline-none cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "ALL" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
                <Filter className="w-3.5 h-3.5  absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <ChevronDown className="w-3.5 h-3.5  absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Type Switcher Pills */}
              <div className="bg-base-100 p-1 rounded-xl flex items-center gap-1">
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
                        : " hover:"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Sort Order Dropdown */}
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "NEWEST" ? "OLDEST" : "NEWEST")
                }
                className="flex items-center gap-2 px-3 py-2 bg-white border border-primary/10 rounded-xl text-xs font-semibold  hover:bg-primary/5"
              >
                {sortOrder === "NEWEST" ? "Newest First" : "Oldest First"}
                <ChevronDown className="w-3.5 h-3.5 " />
              </button>
            </div>
          </motion.div>

          {/* Export Buttons */}
          {/* <div className="flex justify-end gap-3">
            <button className="flex items-center gap-2 bg-white border border-primary/10  px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary/5 transition shadow-sm">
              <Download className="w-4 h-4 " />
              Export PDF
            </button>
            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#00472B] transition shadow-sm">
              <FileSpreadsheet className="w-4 h-4" />
              Export Excel
            </button>
          </div> */}
        </div>

        {/* --- Data Table --- */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.30, ease: "easeInOut" }}
          viewport={{ once: true, amount: 0.1 }}
          className="bg-white rounded-2xl border border-base-100 shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-base-100 text-[11px] font-bold  uppercase tracking-wider bg-primary/5/50">
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Description</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Book</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">Payment</th>
                  <th className="py-4 px-6">Amount(৳)</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-100 text-xs font-medium">
                {paginatedData.length > 0 ? (
                  paginatedData.map((tx) => {
                    const txDate = new Date(tx.date);
                    const formattedDate = `${txDate.getDate()} ${txDate.toLocaleString("default", { month: "short" })} ${txDate.getFullYear()}`;

                    return (
                      <tr
                        key={tx._id}
                        className="hover:bg-primary/5/60 transition"
                      >
                        {/* Date */}
                        <td className="py-4 px-6  w-24">
                          <span className="font-semibold block text-slate-700">
                            {formattedDate}
                          </span>
                        </td>

                        {/* Description */}
                        <td className="py-4 px-6">
                          <div className="font-bold text-xs">{tx.note}</div>
                          <div className="text-[10px]  mt-0.5">
                            {tx.subtitle}
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-6">
                          <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-md text-[11px]">
                            {tx.categoryName}
                          </span>
                        </td>

                        {/* Book */}
                        <td className="py-4 px-6  font-medium">
                          {tx.bookName}
                        </td>

                        {/* Type */}
                        <td className="py-4 px-6">
                          <span
                            className={`font-bold text-[11px] ${
                              tx.type === "CASH_IN"
                                ? "text-emerald-600"
                                : tx.type === "CASH_OUT"
                                  ? "text-red-500"
                                  : "text-slate-600"
                            }`}
                          >
                            {tx.type === "CASH_IN"
                              ? "Income"
                              : tx.type === "CASH_OUT"
                                ? "Expense"
                                : "Transfer"}
                          </span>
                        </td>

                        {/* Payment */}
                        <td className="py-4 px-6 ">
                          <div className="flex items-center gap-1.5 font-medium">
                            {getPaymentIcon(tx.paymentMethod)}
                            <span>{tx.paymentMethod}</span>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="py-4 px-6">
                          <span
                            className={`font-boldtext-xs ${
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
                                : "-"}
                            ৳{tx.amount.toLocaleString()}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-full text-[10px]">
                            {tx.status}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-4 px-6 text-right">
                          <button className="p-1 hover:bg-base-100 rounded-lg hover:">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-8  font-medium">
                      No transactions found matching your filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* --- Pagination Footer --- */}
          <div className="p-4 bg-emerald-50/30 border-t border-base-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium ">
            <div>
              Showing{" "}
              <span className="font-bold ">
                {filteredData.length === 0
                  ? 0
                  : (currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold ">
                {Math.min(currentPage * itemsPerPage, filteredData.length)}
              </span>{" "}
              of <span className="font-bold ">{filteredData.length}</span>{" "}
              transactions
            </div>

            <div className="flex items-center gap-1">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-primary/10 bg-white  disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/5 transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 rounded-lg font-bold text-xs transition ${
                      currentPage === page
                        ? "bg-primary text-white shadow-sm"
                        : "bg-white border border-primary/10  hover:bg-primary/5"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-primary/10 bg-white  disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/5 transition"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
