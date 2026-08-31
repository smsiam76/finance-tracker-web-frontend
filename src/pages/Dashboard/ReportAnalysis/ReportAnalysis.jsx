import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Download,
  FileSpreadsheet,
  Wallet,
  ShoppingCart,
  CheckCircle2,
  ChevronDown,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";

// --- Data Sets mapped to Tabs (Daily, Weekly, Monthly, Yearly) ---
const dashboardData = {
  Daily: {
    totalIncome: 1500,
    totalExpense: 850,
    currentBalance: 650,
    incomeGrowth: "+2.1%",
    expenseGrowth: "-5.0%",
    balanceTrend: [
      { time: "08:00", balance: 200 },
      { time: "12:00", balance: 500 },
      { time: "16:00", balance: 400 },
      { time: "20:00", balance: 650 },
    ],
    categories: [
      { name: "Food", value: 400, color: "#10B981" },
      { name: "Transport", value: 250, color: "#F87171" },
      { name: "Shopping", value: 200, color: "#E5E7EB" },
    ],
    comparison: {
      label1: "Yesterday",
      label2: "Today",
      v1: "৳1,200 vs ৳1,000",
      v2: "৳1,500 vs ৳850",
    },
    transactions: [
      {
        id: "1",
        name: "Coffee & Snacks",
        date: "Today, 10:30 AM",
        amount: 350,
        type: "CASH_OUT",
        brand: "Food",
        bgColor: "bg-orange-100",
        textColor: "text-orange-600",
      },
      {
        id: "2",
        name: "Freelance Payout",
        date: "Today, 02:15 PM",
        amount: 1500,
        type: "CASH_IN",
        brand: null,
        bgColor: "bg-emerald-100",
        textColor: "text-emerald-700",
      },
    ],
  },
  Weekly: {
    totalIncome: 12000,
    totalExpense: 8200,
    currentBalance: 3800,
    incomeGrowth: "+5.4%",
    expenseGrowth: "+1.2%",
    balanceTrend: [
      { time: "Mon", balance: 1000 },
      { time: "Wed", balance: 2500 },
      { time: "Fri", balance: 3000 },
      { time: "Sun", balance: 3800 },
    ],
    categories: [
      { name: "Grocery", value: 3500, color: "#10B981" },
      { name: "Utility", value: 2000, color: "#065F46" },
      { name: "Transport", value: 1500, color: "#F87171" },
      { name: "Shopping", value: 1200, color: "#E5E7EB" },
    ],
    comparison: {
      label1: "Last Week",
      label2: "This Week",
      v1: "৳10,000 vs ৳9,000",
      v2: "৳12,000 vs ৳8,200",
    },
    transactions: [
      {
        id: "1",
        name: "Weekly Supermarket",
        date: "26/08/2026",
        amount: 3500,
        type: "CASH_OUT",
        brand: "Nagad",
        bgColor: "bg-orange-100",
        textColor: "text-orange-600",
      },
      {
        id: "2",
        name: "Client Retainer",
        date: "24/08/2026",
        amount: 12000,
        type: "CASH_IN",
        brand: "bKash",
        bgColor: "bg-pink-100",
        textColor: "text-pink-600",
      },
    ],
  },
  Monthly: {
    totalIncome: 45000,
    totalExpense: 32500,
    currentBalance: 12500,
    incomeGrowth: "+12.5%",
    expenseGrowth: "+4.2%",
    balanceTrend: [
      { time: "01/09", balance: 5000 },
      { time: "07/09", balance: 12000 },
      { time: "14/09", balance: 24000 },
      { time: "21/09", balance: 29000 },
      { time: "28/09", balance: 35000 },
    ],
    categories: [
      { name: "Grocery", value: 12000, color: "#10B981" },
      { name: "Utility", value: 8500, color: "#065F46" },
      { name: "Transport", value: 6000, color: "#F87171" },
      { name: "Shopping", value: 6000, color: "#E5E7EB" },
    ],
    comparison: {
      label1: "August 2026",
      label2: "September 2026",
      v1: "৳42,000 vs ৳38,000",
      v2: "৳45,000 vs ৳32,500",
    },
    transactions: [
      {
        id: "1",
        name: "Digital Wallet Transfer",
        date: "14/09/2026",
        amount: 15000,
        type: "CASH_IN",
        brand: "bKash",
        bgColor: "bg-pink-100",
        textColor: "text-pink-600",
      },
      {
        id: "2",
        name: "Utility Bill Payment",
        date: "12/09/2026",
        amount: 2450,
        type: "CASH_OUT",
        brand: "Nagad",
        bgColor: "bg-orange-100",
        textColor: "text-orange-600",
      },
      {
        id: "3",
        name: "Local Bank Transfer",
        date: "10/09/2026",
        amount: 25000,
        type: "CASH_IN",
        brand: null,
        bgColor: "bg-emerald-100",
        textColor: "text-emerald-700",
      },
    ],
  },
  Yearly: {
    totalIncome: 540000,
    totalExpense: 390000,
    currentBalance: 150000,
    incomeGrowth: "+18.2%",
    expenseGrowth: "+2.5%",
    balanceTrend: [
      { time: "Q1", balance: 30000 },
      { time: "Q2", balance: 75000 },
      { time: "Q3", balance: 110000 },
      { time: "Q4", balance: 150000 },
    ],
    categories: [
      { name: "Grocery", value: 144000, color: "#10B981" },
      { name: "Utility", value: 102000, color: "#065F46" },
      { name: "Transport", value: 72000, color: "#F87171" },
      { name: "Shopping", value: 72000, color: "#E5E7EB" },
    ],
    comparison: {
      label1: "Year 2025",
      label2: "Year 2026",
      v1: "৳480,000 vs ৳410,000",
      v2: "৳540,000 vs ৳390,000",
    },
    transactions: [
      {
        id: "1",
        name: "Annual Bonus",
        date: "15/01/2026",
        amount: 100000,
        type: "CASH_IN",
        brand: null,
        bgColor: "bg-emerald-100",
        textColor: "text-emerald-700",
      },
      {
        id: "2",
        name: "Insurance Premium",
        date: "10/03/2026",
        amount: 24000,
        type: "CASH_OUT",
        brand: "Nagad",
        bgColor: "bg-orange-100",
        textColor: "text-orange-600",
      },
    ],
  },
};

export const ReportAnalysis = () => {
  const [activeTab, setActiveTab] = useState("Monthly");
  const activeData = dashboardData[activeTab];

  return (
    <div className="pt-6 pb-12">
      <div className="space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
          viewport={{ once: true, amount: 0.1 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <p className="text-sm  font-medium">
              Deep dive into your financial growth and spending habits.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 cursor-pointer  bg-white border border-primary/10  px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">
              <Download className="w-4 h-4 " />
              Export PDF
            </button>
            <button className="flex items-center gap-2 cursor-pointer bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#00472B] transition">
              <FileSpreadsheet className="w-4 h-4" />
              Export Excel
            </button>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeInOut" }}
          viewport={{ once: true, amount: 0.1 }}
          className="flex items-center gap-8 border-b border-base-100 pb-1 bg-white pt-4 px-4 rounded-md"
          role="tablist"
        >
          {["Daily", "Weekly", "Monthly", "Yearly"].map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-semibold relative transition-colors cursor-pointer ${
                activeTab === tab ? "text-primary" : " hover:text-gray-600"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </motion.div>

        {/* Dynamic Metric Cards */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25, ease: "easeInOut" }}
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {/* Income Card */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-base-100 flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Total Income
              </span>
              <div className="text-2xl font-bold text-emerald-900">
                ৳{activeData.totalIncome.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium pt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{activeData.incomeGrowth} from previous period</span>
              </div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
              <Wallet className="w-5 h-5" />
            </div>
          </div>

          {/* Expense Card */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-base-100 flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-semibold  uppercase tracking-wider">
                Total Expense
              </span>
              <div className="text-2xl font-bold text-red-700">
                ৳{activeData.totalExpense.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-xs text-red-500 font-medium pt-1">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>{activeData.expenseGrowth} from previous period</span>
              </div>
            </div>
            <div className="p-3 bg-red-50 rounded-full text-red-400">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>

          {/* Net Savings Highlight Card */}
          <div className="bg-primary p-5 rounded-2xl shadow-sm text-white flex justify-between items-start relative overflow-hidden">
            <div className="space-y-1 z-10">
              <span className="text-xs font-medium text-emerald-200">
                Net Savings
              </span>
              <div className="text-2xl font-bold">
                ৳{activeData.currentBalance.toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-200 font-medium pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Positive trajectory</span>
              </div>
            </div>
            <div className="p-2.5 bg-white/10 rounded-full text-white backdrop-blur-sm z-10">
              <div className="w-5 h-5 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold">
                ★
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />
          </div>
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Area Chart: Balance Trend */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-base-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold  text-lg">Balance Trend</h3>
                <p className="text-xs ">
                  Growth over selected period ({activeTab})
                </p>
              </div>
              <button className="flex items-center gap-1 text-xs  bg-gray-50 px-3 py-1.5 rounded-lg border border-primary/10 font-medium">
                {activeTab} View
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activeData.balanceTrend}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorBalance"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop
                        offset="95%"
                        stopColor="#10B981"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorBalance)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pie Chart: Expense by Category */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.18, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-base-100 flex flex-col justify-between"
          >
            <div>
              <h3 className="font-bold  text-lg mb-4">Expense by Category</h3>

              <div className="h-44 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activeData.categories}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {activeData.categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                  <span className="text-sm font-bold ">
                    ৳{(activeData.totalExpense / 1000).toFixed(1)}k
                  </span>
                  <p className="text-[10px]  uppercase tracking-wide">Total</p>
                </div>
              </div>
            </div>

            {/* Category Legend List */}
            <div className="space-y-2 mt-4">
              {activeData.categories.map((cat) => (
                <div
                  key={cat.name}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-gray-600 font-medium">
                      {cat.name}
                    </span>
                  </div>
                  <span className="font-semibold ">
                    ৳{cat.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Details Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Comparison Card */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.23, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-base-100 space-y-6"
          >
            <h3 className="font-bold  text-lg">{activeTab} Comparison</h3>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="">{activeData.comparison.label1}</span>
                <span className="">{activeData.comparison.v1}</span>
              </div>
              <div className="h-3 w-full bg-red-100 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: "80%" }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="">{activeData.comparison.label2}</span>
                <span className="">{activeData.comparison.v2}</span>
              </div>
              <div className="h-3 w-full bg-red-100 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: "72%" }}
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-xs  font-medium">
                <span className="w-3 h-3 bg-emerald-500 rounded-sm" />
                <span>INCOME</span>
              </div>
              <div className="flex items-center gap-2 text-xs  font-medium">
                <span className="w-3 h-3 bg-red-100 rounded-sm" />
                <span>EXPENSE</span>
              </div>
            </div>
          </motion.div>

          {/* Transaction History */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-base-100 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold  text-lg">Transaction History</h3>
              <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                View All
              </button>
            </div>

            <div className="divide-y divide-base-100">
              {activeData.transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="py-3 flex items-center justify-between first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full ${tx.bgColor} ${tx.textColor} flex items-center justify-center font-bold text-xs`}
                    >
                      {tx.brand ? tx.brand : <Building2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold ">{tx.name}</p>
                      <p className="text-[10px] ">{tx.date}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold ${tx.type === "CASH_IN" ? "text-emerald-600" : "text-red-500"}`}
                  >
                    {tx.type === "CASH_IN" ? "+" : "-"}৳
                    {tx.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
