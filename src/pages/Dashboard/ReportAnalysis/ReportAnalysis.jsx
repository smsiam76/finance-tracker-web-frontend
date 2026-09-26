import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useReports from "../../../hooks/useReportAnalytics";
import { Download, FileSpreadsheet } from "lucide-react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import Loader from "../../../component/Shared/Loader/Loader";
import { motion } from "framer-motion";
import ExpenseByCategoryChart from "../../../component/ExpenseByCategoryChart/ExpenseByCategoryChart";
import useDashboardSummary from "../../../hooks/useDashboardSummary";
import { handleExportData } from "../../../utility/settingsUtils";

export const ReportAnalysis = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Monthly");
  const [selectedBook, setSelectedBook] = useState("combined");

  // Custom hook call for report analytics
  const { reportAnalytics, isReportLoading } = useReports(
    user?.email,
    selectedBook,
    activeTab
  );

  // console.log(reportAnalytics);

  const { isLoading: isDashboardLoading } = useDashboardSummary(user?.email);

  const {
    totalIncome = 0,
    totalExpense = 0,
    currentBalance = 0,
    incomeGrowth = "0%",
    expenseGrowth = "0%",
    balanceTrend = [],
    categories = [],
    userBooks = [],
  } = reportAnalytics || {};

  if (isReportLoading || isDashboardLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6 pt-6 pb-12">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
        viewport={{ once: true, amount: 0.1 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <p className="text-sm text-gray-500">
            Track and analyze income, spending trends, and balances.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Per Book / Combined Selector */}
          <select
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            className="border border-gray-200 px-3 py-2 rounded-lg text-sm bg-white font-semibold text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="combined">All Books (Combined)</option>
            {userBooks?.map((book) => (
              <option key={book._id} value={book._id}>
                {book.bookName}
              </option>
            ))}
          </select>

          <button
            disabled
            className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition cursor-not-allowed opacity-60"
          >
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button
            onClick={() => handleExportData(user, "excel")}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Excel/CSV
          </button>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.18, ease: "easeInOut" }}
        viewport={{ once: true, amount: 0.1 }}
        className="flex items-center gap-6 border-b border-gray-200 pb-2"
      >
        {["Daily", "Weekly", "Monthly", "Yearly"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-semibold relative transition-colors cursor-pointer ${
              activeTab === tab
                ? "text-emerald-600 border-b-2 border-emerald-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeInOut" }}
          viewport={{ once: true, amount: 0.1 }}
          className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm"
        >
          <p className="text-sm text-gray-500 font-medium">Total Income</p>
          <h2 className="text-2xl font-bold text-gray-800 mt-1">
            ৳{Number(totalIncome).toLocaleString()}
          </h2>
          <span className="text-xs text-emerald-600 font-semibold">
            {incomeGrowth} from last period
          </span>
        </motion.div>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.22, ease: "easeInOut" }}
          viewport={{ once: true, amount: 0.1 }}
          className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm"
        >
          <p className="text-sm text-gray-500 font-medium">Total Expense</p>
          <h2 className="text-2xl font-bold text-gray-800 mt-1">
            ৳{Number(totalExpense).toLocaleString()}
          </h2>
          <span className="text-xs text-red-500 font-semibold">
            {expenseGrowth} from last period
          </span>
        </motion.div>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.24, ease: "easeInOut" }}
          viewport={{ once: true, amount: 0.1 }}
          className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm"
        >
          <p className="text-sm text-gray-500 font-medium">Net Savings</p>
          <h2 className="text-2xl font-bold text-emerald-700 mt-1">
            ৳{Number(currentBalance).toLocaleString()}
          </h2>
        </motion.div>
      </div>

      {/* Dynamic Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Balance Trend Area Chart */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25, ease: "easeInOut" }}
          viewport={{ once: true, amount: 0.1 }}
          className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
        >
          <h3 className="font-bold text-gray-800 mb-4">
            Balance Trend ({activeTab})
          </h3>
          <div className="h-64 w-full">
            {balanceTrend?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={balanceTrend}>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value) => [`৳${value}`, "Balance"]} />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.15}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                No balance trend data available
              </div>
            )}
          </div>
        </motion.div>

        {/* Expense Category Pie Chart */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.27, ease: "easeInOut" }}
          viewport={{ once: true, amount: 0.1 }}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between"
        >
          <div>
            <h3 className="font-bold text-gray-800 mb-2">
              Expense by Category
            </h3>

            <div className="w-full">
              {categories?.length > 0 ? (
                <ExpenseByCategoryChart chartData={categories} />
              ) : (
                <div className="h-64 flex items-center justify-center text-xs text-gray-400">
                  No categorical expense data available for this period
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};