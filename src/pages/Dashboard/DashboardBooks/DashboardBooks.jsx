import { useNavigate } from "react-router";
import {
  FiPlus,
  FiFilter,
  FiTrendingUp,
  FiTrendingDown,
  FiPieChart,
  FiBook
} from "react-icons/fi";
import { CiWallet } from "react-icons/ci";
import { FaMoneyBills } from "react-icons/fa6";
import BooksCard from "../../../component/BooksCard/BooksCard";
import { motion } from "framer-motion";
import CreateBookModal from "../../../component/CreateBookModal/CreateBookModal";
import useBooks from "../../../hooks/useBooks";
import Loader from "../../../component/Shared/Loader/Loader";
import { FaPiggyBank } from "react-icons/fa";
import { IoAirplaneOutline, IoBagHandleOutline, IoCardOutline, IoHomeOutline, IoWalletOutline } from "react-icons/io5";
import useAuth from "../../../hooks/useAuth";

const MyBooks = () => {
  const {user} = useAuth();
  const navigate = useNavigate();

  // get books data through useBooks
  const { books = [], isLoading } = useBooks(user?.email);

  // Dynamic calculations based on fetched books
  const totalNetWorth = books.reduce(
    (acc, curr) => acc + (curr.currentBalance || 0),
    0,
  );
  const totalExpense = books.reduce(
    (acc, curr) => acc + (curr.totalExpense || 0),
    0,
  );

  console.log("books from usebooks ", books);

  // Utility formatter for BDT Currency
  const formatCurrency = (amount) => {
    return `৳${amount.toLocaleString("en-IN")}`;
  };

  const renderIcon = (iconName, color = "#006A4E") => {
  const iconStyle = { color: color };
  
  switch (iconName?.toLowerCase()) {
    case "wallet":
      return <IoWalletOutline className="w-6 h-6" style={iconStyle} />;
    case "card":
      return <IoCardOutline className="w-6 h-6" style={iconStyle} />;
    case "piggy":
      return <FaPiggyBank className="w-5 h-5" style={iconStyle} />;
    case "plane":
      return <IoAirplaneOutline className="w-6 h-6" style={iconStyle} />;
    case "home":
      return <IoHomeOutline className="w-6 h-6" style={iconStyle} />;
    case "bag":
      return <IoBagHandleOutline className="w-6 h-6" style={iconStyle} />;
    default:
      return <FiPieChart className="w-6 h-6" style={iconStyle} />;
  }
};
  // loading states
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="pt-6 pb-12">
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
              onClick={() => document.getElementById("create_book_modal_cashin").showModal()}
              className="flex items-center gap-2 px-4 py-2 bg-primary/80 hover:bg-primary text-white font-medium rounded-xl text-sm shadow-sm cursor-pointer transition-all duration-300 ease-linear"
            >
              <FiPlus className="md:text-sm lg:text-lg" /> Create Book
            </button>
            {/* modal will open here  */}
            <dialog
              id="create_book_modal_cashin"
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
              {formatCurrency(totalNetWorth)}
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-2">
              <FiTrendingUp /> Active Total
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
              {formatCurrency(totalExpense)}
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-red-500 mt-2">
              <FiTrendingDown /> Accross all books
            </div>
          </motion.div>

          {/* Total Books */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white p-5 rounded-2xl shadow-lg border border-primary/20 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase mb-2 text-gray-600">
                <FiBook className="text-emerald-700 text-base" /> Total Books
              </div>
              <div className="text-2xl md:text-xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                {books?.length || 0}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 mt-3">
              <span>Active Books</span>
              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                {books?.length || 0} Active
              </span>
            </div>
          </motion.div>
        </div>

        {/* Ledgers Grid / Empty State */}
        {books.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">
              No books found. Create one to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
            {books.map((book) => (
              <BooksCard
                key={book._id}
                book={book}
                formatCurrency={formatCurrency}
                renderIcon={renderIcon}
                navigate={navigate}
              />
            ))}
          </div>
        )}

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
            onClick={() => document.getElementById("create_book_modal_cashin").showModal()}
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
