import { Link, useParams } from "react-router";
import { useEffect, useState, useMemo } from "react";
import {
  TrendingUp,
  Search,
  ChevronDown,
  Wallet,
  ArrowLeftRight,
} from "lucide-react";
import Loader from "../../../component/Shared/Loader/Loader";
import { motion } from "framer-motion";

const BookDetails = () => {
  const { id } = useParams();
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter & Sort States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("date-desc"); // default: Newest First

  useEffect(() => {
    setLoading(true);
    // Fetch data from public JSON
    fetch("/public/booksdata.json")
      .then((res) => res.json())
      .then((data) => {
        const currentBook =
          data.find((book) => String(book._id) === String(id)) || data[0];
        setBookData(currentBook);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading JSON data:", err);
        setLoading(false);
      });
  }, [id]);

  // Mock Transactions Data
  const rawTransactions = [
    {
      id: 1,
      date: "Oct 14, 2023",
      rawDate: "2023-10-14",
      title: "Rice & Lentils",
      subtitle: "Daily Bazaar",
      category: "Grocery",
      categoryBg: "bg-emerald-100 text-emerald-800",
      type: "Expense",
      amount: -850,
      isIncome: false,
    },
    {
      id: 2,
      date: "Oct 12, 2023",
      rawDate: "2023-10-12",
      title: "Salary Credit",
      subtitle: "TechFirm Corp Ltd.",
      category: "Income",
      categoryBg: "bg-emerald-100 text-emerald-800",
      type: "Income",
      amount: 45000,
      isIncome: true,
    },
    {
      id: 3,
      date: "Oct 11, 2023",
      rawDate: "2023-10-11",
      title: "Electricity Bill",
      subtitle: "DPDC Monthly Bill",
      category: "Utility",
      categoryBg: "bg-rose-100 text-rose-800",
      type: "Expense",
      amount: -2400,
      isIncome: false,
    },
    {
      id: 4,
      date: "Oct 10, 2023",
      rawDate: "2023-10-10",
      title: "Bus Fare",
      subtitle: "Mirpur to Dhanmondi",
      category: "Transport",
      categoryBg: "bg-emerald-100 text-emerald-800",
      type: "Expense",
      amount: -50,
      isIncome: false,
    },
  ];

  // Dynamically extract unique categories
  const categories = useMemo(() => {
    const list = rawTransactions.map((item) => item.category);
    return ["All", ...Array.from(new Set(list))];
  }, [rawTransactions]);

  // Filter & Sort Logic using useMemo for optimal performance
  const filteredTransactions = useMemo(() => {
    return rawTransactions
      .filter((item) => {
        // Search Filter (Title or Subtitle)
        const matchesSearch =
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(searchTerm.toLowerCase());

        // Category Filter
        const matchesCategory =
          selectedCategory === "All" || item.category === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "date-desc") {
          return new Date(b.rawDate) - new Date(a.rawDate);
        }
        if (sortBy === "date-asc") {
          return new Date(a.rawDate) - new Date(b.rawDate);
        }
        if (sortBy === "amount-high") {
          return Math.abs(b.amount) - Math.abs(a.amount);
        }
        if (sortBy === "amount-low") {
          return Math.abs(a.amount) - Math.abs(b.amount);
        }
        return 0;
      });
  }, [searchTerm, selectedCategory, sortBy]);

  // Budget Percentage Calculation
  const budgetUsagePercent =
    bookData?.totalExpense && bookData?.totalIncome
      ? Math.min(
          Math.round((bookData.totalExpense / bookData.totalIncome) * 100),
          100,
        )
      : 75;

  if (loading) {
    return <Loader />;
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
          className="md:col-span-4 bg-white p-5 rounded-2xl shadow-xl border border-primary/10 flex flex-col"
        >
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase">
              Current Balance
            </p>
            <h2 className="text-xl lg:text-3xl font-extrabold text-primary mt-2">
              ৳{bookData?.currentBalance?.toLocaleString() || "0"}
            </h2>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium mt-4">
            <TrendingUp size={14} />
            <span>4.2% from last month</span>
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
              <p className="text-xs font-semibold">Monthly Income</p>
              <p className="text-lg font-bold text-primary mt-1">
                ৳{bookData?.totalIncome?.toLocaleString() || "0"}
              </p>
            </div>
            <div className="pl-4 md:pl-0 lg:pl-4">
              <p className="text-xs font-semibold">Monthly Expense</p>
              <p className="text-lg font-bold text-[#D9383A] mt-1">
                ৳{bookData?.totalExpense?.toLocaleString() || "0"}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
              <span>Budget Usage</span>
              <span className="font-bold">{budgetUsagePercent}%</span>
            </div>
            <div className="w-full bg-base-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300"
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
              Budget Manegement
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
                className="absolute right-2.5 top-1/2 -translate-y-1/2  pointer-events-none"
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
              <tr className="border-b border-gray-100 text-[11px] font-bolduppercase tracking-wider">
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Description</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2">Type</th>
                <th className="py-3 px-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-3.5 px-2 text-xs ">{item.date}</td>
                    <td className="py-3.5 px-2">
                      <p className="font-bold  text-sm">{item.title}</p>
                      <p className="text-xs italic">{item.subtitle}</p>
                    </td>
                    <td className="py-3.5 px-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${item.categoryBg}`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td
                      className={`py-3.5 px-2 font-semibold text-xs ${
                        item.isIncome ? "text-primary" : "text-[#D9383A]"
                      }`}
                    >
                      {item.type}
                    </td>
                    <td
                      className={`py-3.5 px-2 text-right font-bold text-sm ${
                        item.isIncome ? "text-primary" : "text-[#D9383A]"
                      }`}
                    >
                      {item.isIncome
                        ? `+৳${item.amount.toLocaleString()}`
                        : `-৳${Math.abs(item.amount).toLocaleString()}`}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-xs">
                    No transactions found.
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
