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
          className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${book.icon === "shield" ? "bg-red-50" : "bg-primary/20"}`}
        >
          {renderIcon(book.icon)}
        </div>

        {/* Book Title & Description */}
        <h3 className="text-xl font-bold">{book.title}</h3>
        <p className="text-sm mb-4">{book.description}</p>

        {/* Card Inner Content Box */}
        <div className="bg-primary/5  p-6 lg:p-8 rounded-xl space-y-3">
          {/* Standard Income/Expense Ledger */}
          {book.type === "STANDARD" && (
            <>
              <div className="flex flex-wrap justify-between items-center font-medium">
                <span className="font-bold">Balance</span>
                <span className="lg:text-lg font-bold">
                  {formatCurrency(book.currentBalance)}
                </span>
              </div>
              <span className="divider"></span>
              <div className="flex flex-wrap justify-between items-center pt-1">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold">
                    Income
                  </p>
                  <p className="text-sm font-bold text-primary">
                    {formatCurrency(book.totalIncome)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider font-bold">
                    Expense
                  </p>
                  <p className="text-sm font-bold text-red-500">
                    {formatCurrency(book.totalExpense)}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Savings Card Type */}
          {book.type === "SAVINGS" && (
            <div className="py-2">
              <div className="flex flex-wrap justify-between items-center font-medium mb-2">
                <span className="font-bold">Balance</span>
                <span className="lg:text-lg font-bold text-primary">
                  {formatCurrency(book.currentBalance)}
                </span>
              </div>
              <p className="text-[11px] flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full border  text-center text-[8px] leading-3">
                  i
                </span>
                {book.note}
              </p>
            </div>
          )}

          {/* Target Progress Card Type */}
          {book.type === "TARGET_PROGRESS" && (
            <div className="py-1">
              <div className="flex flex-wrap justify-between items-center font-medium mb-2">
                <span className="font-bold">Balance</span>
                <span className="lg:text-lg font-bold">
                  {formatCurrency(book.currentBalance)}
                </span>
              </div>
              <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden my-2">
                <div className="bg-red-700 h-full rounded-full w-[40%]" />
              </div>
              <p className="text-right text-[11px] font-bold text-red-700">
                {book.progressPercent}% of target
              </p>
            </div>
          )}

          {/* Target Remaining Card Type */}
          {book.type === "TARGET_REMAINING" && (
            <div className="py-1 space-y-1">
              <div className="flex flex-wrap justify-between items-center font-medium">
                <span className="font-bold">Saved</span>
                <span className="lg:text-lg font-bold ">
                  {formatCurrency(book.currentBalance)}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                {formatCurrency(book.targetRemaining)} to go
              </p>
            </div>
          )}
        </div>
      </div>

      {/* View Details Button */}
      <Link
        to={`/dashboard/my-books/book-details/${book._id}`}
        state={{ bookTitle: book.title }}
        className="w-full py-2.5 px-4 rounded-xl bg-primary/10 border border-primary/10 hover:bg-primary hover:border-primary/50 text-primary hover:text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ease-linear cursor-pointer"
      >
        View Details <FiArrowRight />
      </Link>
    </motion.div>
  );
};

export default BooksCard;
