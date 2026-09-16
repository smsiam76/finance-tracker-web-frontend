import { FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { Link } from "react-router";

const BooksCard = ({ book, renderIcon, formatCurrency }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
      viewport={{ once: true, amount: 0.3 }}
      key={book._id}
      className="bg-white p-6 rounded-2xl shadow-xl border border-primary/10 flex flex-col justify-between space-y-5"
    >
      <div>
        {/* Book Header Icon */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
          style={{
            backgroundColor: book?.themeColor
              ? `${book.themeColor}20` // Dynamic Hex Color with Transparency
              : "rgba(0, 104, 74, 0.1)",
          }}
        >
          {renderIcon(book?.icon)}
        </div>

        {/* Book Name & Description */}
        <h3 className="text-xl font-bold text-gray-900">{book.bookName}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {book.description || "No description provided."}
        </p>

        {/* Card Inner Content Box */}
        <div className="bg-primary/5 p-5 lg:p-6 rounded-xl space-y-3">
          {/* Current Balance */}
          <div className="flex flex-wrap justify-between items-center font-medium">
            <span className="font-bold text-gray-700">Balance</span>
            <span className="lg:text-lg font-bold text-gray-900">
              {formatCurrency(book.currentBalance)}
            </span>
          </div>

          <div className="border-t border-gray-200/60 my-2"></div>

          {/* Income & Expense Breakdown */}
          <div className="flex flex-wrap justify-between items-center pt-1">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
                Income
              </p>
              <p className="text-sm font-bold text-emerald-600">
                {formatCurrency(book.totalIncome)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
                Expense
              </p>
              <p className="text-sm font-bold text-red-500">
                {formatCurrency(book.totalExpense)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* View Details Button */}
      <Link
        to={`/dashboard/my-books/book-details/${book._id}`}
        state={{ bookTitle: book.bookName }}
        className="w-full py-2.5 px-4 rounded-xl bg-primary/10 border border-primary/10 hover:bg-primary hover:border-primary/50 text-primary hover:text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ease-linear cursor-pointer"
      >
        View Details <FiArrowRight />
      </Link>
    </motion.div>
  );
};

export default BooksCard;
