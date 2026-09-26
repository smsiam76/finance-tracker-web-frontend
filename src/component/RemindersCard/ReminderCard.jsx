import {
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
  Tag,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

const ReminderCard = ({
  item,
  processingId,
  onMarkAsPaid,
  onDelete,
  formatDate,
}) => {
  const isIncome = ["INCOME", "CASH_IN", "cash-in"].includes(item.type);
  const isProcessing = processingId === item._id;

  return (
    <motion.div
      layout
      initial={{ x: -20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
      viewport={{ once: true, amount: 0.1 }}
      className="bg-white p-5 rounded-2xl border border-base-100 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
    >
      <div className="space-y-3">
        {/* Header Badge & Actions */}
        <div className="flex items-start justify-between">
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${
              isIncome
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-rose-50 text-rose-700 border border-rose-100"
            }`}
          >
            {isIncome ? (
              <ArrowDownRight className="w-3 h-3" />
            ) : (
              <ArrowUpRight className="w-3 h-3" />
            )}
            {isIncome ? "Income Credit" : "Expense Bill"}
          </span>

          <button
            onClick={() => onDelete(item._id)}
            className="text-gray-400 hover:text-rose-500 p-1 transition"
            title="Delete Reminder"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Amount */}
        <div>
          <h3 className="font-bold text-base text-gray-800">{item.title}</h3>
          <p
            className={`text-lg font-black mt-0.5 ${isIncome ? "text-emerald-600" : "text-rose-600"}`}
          >
            ৳ {item.amount?.toLocaleString()}
          </p>
        </div>

        {/* Details List */}
        <div className="space-y-1.5 pt-2 border-t border-gray-50 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-semibold text-gray-700">Book:</span>
            <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px] font-bold text-gray-800">
              {item.bookName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-semibold text-gray-700">Category:</span>
            <span>{item.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-semibold text-gray-700">Frequency:</span>
            <span className="capitalize">{item.frequency}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-semibold text-gray-700">Next Due:</span>
            <span className="font-bold text-primary">
              {formatDate(item.nextDueDate)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        disabled={isProcessing}
        onClick={() => onMarkAsPaid(item)}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold rounded-xl text-xs transition disabled:opacity-50 mt-2"
      >
        {isProcessing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <CheckCircle2 className="w-4 h-4" />
        )}
        {isProcessing ? "Processing..." : `Mark as Paid`}
      </button>
    </motion.div>
  );
};

export default ReminderCard;
