import { useNavigate } from "react-router";
import {
  FiPlus,
  FiFilter,
  FiTrendingUp,
  FiTrendingDown,
  FiShoppingCart,
  FiUsers,
  FiBriefcase,
  FiShield,
  FiNavigation,
  FiPieChart,
} from "react-icons/fi";
import { CiWallet } from "react-icons/ci";
import { FaMoneyBills } from "react-icons/fa6";
import { BsPiggyBank } from "react-icons/bs";
import BooksCard from "../../../component/BooksCard/BooksCard";
import { motion } from "framer-motion";
import CreateBookModal from "../../../component/CreateBookModal/CreateBookModal";

// Demo JSON Data structured matching your provided JSON schema
const initialBooksData = [
  {
    _id: "book1",
    userId: "user1",
    title: "Daily Expenses",
    description: "Personal household & food",
    currentBalance: 12500,
    totalIncome: 45000,
    totalExpense: 32500,
    status: "ACTIVE",
    type: "STANDARD",
    icon: "shopping-cart",
    budgets: [{ categoryId: "cat1", monthlyLimit: 300 }],
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-08-05T10:00:00Z",
  },
  {
    _id: "book2",
    userId: "user1",
    title: "Family Expenses",
    description: "Shared costs for dependents",
    currentBalance: 8200,
    totalIncome: 20000,
    totalExpense: 11800,
    status: "ACTIVE",
    type: "STANDARD",
    icon: "users",
    budgets: [{ categoryId: "cat2", monthlyLimit: 500 }],
    createdAt: "2026-01-10T00:00:00Z",
    updatedAt: "2026-08-05T10:00:00Z",
  },
  {
    _id: "book3",
    userId: "user1",
    title: "Business",
    description: "Consulting & freelancing ops",
    currentBalance: 145000,
    totalIncome: 320000,
    totalExpense: 175000,
    status: "ACTIVE",
    type: "STANDARD",
    icon: "briefcase",
    budgets: [{ categoryId: "cat3", monthlyLimit: 2000 }],
    createdAt: "2026-02-01T00:00:00Z",
    updatedAt: "2026-08-05T10:00:00Z",
  },
  {
    _id: "book4",
    userId: "user1",
    title: "Savings",
    description: "Long-term wealth building",
    currentBalance: 50000,
    totalIncome: 50000,
    totalExpense: 0,
    status: "ACTIVE",
    type: "SAVINGS",
    note: "Compound interest enabled",
    icon: "wallet",
    budgets: [],
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-08-05T10:00:00Z",
  },
  {
    _id: "book5",
    userId: "user1",
    title: "Emergency Fund",
    description: "6 months of safety net",
    currentBalance: 25000,
    targetAmount: 62500,
    totalIncome: 25000,
    totalExpense: 0,
    status: "ACTIVE",
    type: "TARGET_PROGRESS",
    progressPercent: 40,
    icon: "shield",
    budgets: [],
    createdAt: "2026-03-01T00:00:00Z",
    updatedAt: "2026-08-05T10:00:00Z",
  },
  {
    _id: "book6",
    userId: "user1",
    title: "December Tour",
    description: "Sajek Valley Trip 2024",
    currentBalance: 5000,
    targetRemaining: 15000,
    totalIncome: 5000,
    totalExpense: 0,
    status: "ACTIVE",
    type: "TARGET_REMAINING",
    icon: "navigation",
    budgets: [],
    createdAt: "2026-04-15T00:00:00Z",
    updatedAt: "2026-08-05T10:00:00Z",
  },
];

const MyBooks = () => {
  const navigate = useNavigate();

  // Utility formatter for BDT Currency
  const formatCurrency = (amount) => {
    return `৳${amount.toLocaleString("en-IN")}`;
  };

  // Icon selector helper
  const renderIcon = (iconName) => {
    const className = "text-emerald-800 text-xl";
    switch (iconName) {
      case "shopping-cart":
        return <FiShoppingCart className={className} />;
      case "users":
        return <FiUsers className={className} />;
      case "briefcase":
        return <FiBriefcase className={className} />;
      case "wallet":
        return <CiWallet className={className} />;
      case "shield":
        return <FiShield className="text-red-700 text-xl" />;
      case "navigation":
        return <FiNavigation className={className} />;
      default:
        return <FiPieChart className={className} />;
    }
  };

  return (
    <div className="">
      <div className="space-y-6">
        {/* --- Top Header Section --- */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
          viewport={{ once: true, amount: 0.1 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <p className="font-medium text-sm sm:text-base">
            Overview of all your financial ledgers and savings goals.
          </p>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-300 hover:bg-gray-200 font-medium rounded-xl text-sm transition-all duration-300 ease-linear cursor-pointer">
              <FiFilter /> Filter
            </button>
            <button
              onClick={() => document.getElementById("my_modal_5").showModal()}
              className="flex items-center gap-2 px-4 py-2 bg-primary/80 hover:bg-primary text-white font-medium rounded-xl text-sm shadow-sm cursor-pointer transition-all duration-300 ease-linear"
            >
              <FiPlus className="md:text-sm lg:text-lg" /> Create Book
            </button>
            {/* modal will open here  */}
            <dialog
              id="my_modal_5"
              className="modal modal-bottom sm:modal-middle px-4 md:px-0"
            >
              <CreateBookModal />
            </dialog>
          </div>
        </motion.div>

        {/* -----------------
            Summary Metrics Cards 
        --------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-5">
          {/* Net Worth */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white p-5 rounded-2xl shadow-lg border border-primary/20"
          >
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase mb-2">
              <CiWallet className="text-emerald-700 text-base" /> Total Net
              Worth
            </div>
            <div className="text-2xl md:text-xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              {formatCurrency(245700)}
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-2">
              <FiTrendingUp /> +12.5% this month
            </div>
          </motion.div>

          {/* Monthly Expenses */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white p-5 rounded-2xl shadow-lg border border-primary/20"
          >
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase mb-2">
              <FaMoneyBills className="text-red-600 text-base" /> Monthly
              Expenses
            </div>
            <div className="text-2xl md:text-xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              {formatCurrency(219300)}
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-red-500 mt-2">
              <FiTrendingDown /> ~4.2% from budget
            </div>
          </motion.div>

          {/* Savings Goal Progress */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white p-5 rounded-2xl shadow-lg border border-primary/20 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase mb-2">
                <BsPiggyBank className="text-emerald-700 text-base" /> Savings
                Goal Progress
              </div>
              <div className="text-2xl md:text-xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                82%
              </div>
            </div>
            <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden mt-3">
              <div className="bg-[#00684a] h-full rounded-full w-[82%]" />
            </div>
          </motion.div>
        </div>

        {/* --- Ledgers / Books Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          {initialBooksData.map((book) => (
            <BooksCard
              book={book}
              formatCurrency={formatCurrency}
              renderIcon={renderIcon}
              navigate={navigate}
            />
          ))}
        </div>

        {/* --- Bottom Call-to-Action Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* All Finances Banner */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="lg:col-span-2 bg-gradient-to-r from-primary to-[#008f66] text-white p-8 rounded-3xl relative overflow-hidden flex flex-col justify-center min-h-[180px]"
          >
            <div className="relative z-10 max-w-lg space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                All Your Finances in One Place
              </h2>
              <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
                Sync your accounts and monitor your spending automatically.
                Managing your money has never been this simple.
              </p>
            </div>
            {/* Background Decorative SVG */}
            <div className="absolute right-[-20px] bottom-[-40px] opacity-20 pointer-events-none">
              <svg
                width="240"
                height="240"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
          </motion.div>

          {/* Add a New Book Quick Card */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            onClick={() => document.getElementById("my_modal_5").showModal()}
            className="border-2 border-dashed border-gray-300 hover:border-primary bg-gray-100/70 hover:bg-emerald-50/30 rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group min-h-[180px]"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm mb-3 group-hover:scale-110 transition-transform">
              <FiPlus className="text-2xl" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
              Add a New Book
            </h4>
            <p className="text-xs text-gray-500 max-w-[200px] mt-1">
              Start tracking a new goal or project
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MyBooks;
