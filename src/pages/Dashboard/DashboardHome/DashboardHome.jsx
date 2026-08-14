import { BsPiggyBank } from "react-icons/bs";
import { motion } from "framer-motion";
import {
  FaBolt,
  FaCalendarAlt,
  FaExchangeAlt,
  FaPlus,
} from "react-icons/fa";
import { FaBook, FaMinus } from "react-icons/fa6";
import { GiTakeMyMoney } from "react-icons/gi";
import { IoMdTrendingDown, IoMdTrendingUp } from "react-icons/io";
import { Link } from "react-router";
import ExpenseByCategoryChart from "../../../component/ExpenseByCategoryChart/ExpenseByCategoryChart";
import RecentTransactions from "../../../component/RecentTransatcions/RecentTransactions";

const DashboardHome = () => {
  const quickActions = [
    {
      title: "Create Book",
      route: "/dashboard/create-book",
      icon: <FaBook />,
    },
    {
      title: "Cash In",
      route: "/dashboard/cash-in",
      icon: <FaPlus />,
    },
    {
      title: "Cash Out",
      route: "/dashboard/cash-out",
      icon: <FaMinus />,
    },
    {
      title: "Transfer Money",
      route: "/dashboard/transfer-money",
      icon: <FaExchangeAlt />,
    },
    {
      title: "Create Category",
      route: "/dashboard/create-category",
      icon: <FaPlus />,
    },
  ];

  const budgetItems = [
    {
      id: 1,
      name: "Groceries",
      spent: 4500,
      total: 6000,
    },
    {
      id: 2,
      name: "Electricity Bill",
      spent: 3200,
      total: 3000,
    },
  ];

  const lendingData = {
    lent: 4500,
    borrowed: 12000,
  };

  const reminderData = {
    id: 1,
    title: "Electricity Bill",
    dueDate: "15/10/2024",
  };

  return (
    <div className="py-12">
      {/* ------------------------------
          Part 1: Key Financial Metrics
      ------------------------------ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8 mb-12">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeInOut" }}
          viewport={{ once: true }}
          className="bg-primary text-white p-8 border border-primary shadow-md rounded-md"
        >
          <div className="flex items-center justify-between">
            <h4 className="md:text-xl font-semibold mb-3">Total Balance</h4>
            <div className="w-fit p-2.5 flex items-center justify-center bg-base-100 text-primary rounded-full">
              <GiTakeMyMoney className="text-3xl" />
            </div>
          </div>
          <h3 className="text-xl md:text-3xl font-bold ml-2 pb-4">৳ 65,200</h3>
        </motion.div>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
          viewport={{ once: true }}
          className="bg-white p-8 border border-primary/20 shadow-md rounded-md"
        >
          <div className="flex items-center justify-between">
            <h4 className="md:text-xl font-semibold mb-3">Total Income</h4>
            <div className="w-fit p-2.5 flex items-center justify-center bg-base-100 text-primary rounded-full">
              <IoMdTrendingUp className="text-2xl" />
            </div>
          </div>
          <h3 className="text-xl md:text-3xl pb-4 font-bold ml-2">৳ 50,200</h3>
        </motion.div>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeInOut" }}
          viewport={{ once: true }}
          className="bg-white p-8 border border-primary/20 shadow-md rounded-md"
        >
          <div className="flex items-center justify-between">
            <h4 className="md:text-xl font-semibold mb-3">Total Expense</h4>
            <div className="w-fit p-2.5 flex items-center justify-center bg-red-100 rounded-full">
              <IoMdTrendingDown className="text-2xl text-red-500" />
            </div>
          </div>
          <h3 className="text-xl md:text-3xl pb-4 font-bold ml-2">৳ 32,400</h3>
        </motion.div>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25, ease: "easeInOut" }}
          viewport={{ once: true }}
          className="bg-white p-8 border border-primary/20 shadow-md rounded-md"
        >
          <div className="flex items-center justify-between">
            <h4 className="md:text-xl font-semibold mb-3">Net Savings</h4>
            <div className="w-fit p-2.5 flex items-center justify-center bg-base-100 text-primary rounded-full">
              <BsPiggyBank className="text-2xl" />
            </div>
          </div>
          <h3 className="text-xl md:text-3xl pb-4 font-bold ml-2">৳ 17,800</h3>
        </motion.div>
      </div>

      {/* ------------------------------ 
          Part 2: Actions & Category Chart
      ------------------------------ */}
      <div className="mb-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* Quick Actions */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white w-full lg:w-2/3 p-6 md:p-10 shadow-xl rounded-xl"
          >
            <h3 className="text-2xl font-bold mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-8">
              {quickActions.map((action, idx) => {
                const isCashOut = action.title.toLowerCase() === "cash out";
                return (
                  <Link
                    to={action.route}
                    key={idx}
                    className="group hover:bg-primary border border-primary/20 rounded-lg shadow-lg p-4 text-center bg-base-100 transition-all duration-300 ease-in-out flex flex-col items-center justify-center"
                  >
                    <div className="mb-2">
                      <span
                        className={`transition-colors duration-300 ease-in-out inline-flex items-center justify-center p-3 text-xl rounded-md shadow-md ${
                          isCashOut
                            ? "bg-red-400 text-white group-hover:bg-white group-hover:text-red-700"
                            : "bg-primary/90 text-white group-hover:bg-white group-hover:text-primary"
                        }`}
                      >
                        {action.icon}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-800 group-hover:text-white transition-colors duration-300 ease-in-out text-sm md:text-base">
                      {action.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Expense Chart */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.28, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="w-full lg:w-1/3 p-6 md:p-10 bg-white shadow-xl rounded-xl"
          >
            <h3 className="text-2xl font-bold mb-6">Expense by Category</h3>
            <ExpenseByCategoryChart />
          </motion.div>
        </div>
      </div>

      {/* ------------------------------
          Part 3: Recent Transactions, Budget & Reminders
      ------------------------------ */}
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12">
        {/* Recent Transactions */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3, ease: "easeInOut" }}
          viewport={{ once: true, amount: 0.1 }}
          className="w-full lg:w-3/5 bg-white shadow-xl rounded-xl py-8"
        >
          <div className="flex justify-between items-center px-6 md:px-10">
            <h3 className="text-xl font-bold">Recent Transactions</h3>
            <Link
              to="/dashboard/transactions"
              className="font-medium text-primary hover:underline transition-all duration-300 ease-in-out"
            >
              View All
            </Link>
          </div>
          <div className="divider my-4"></div>
          <div className="px-4 md:px-10">
            <RecentTransactions />
          </div>
        </motion.div>

        {/* Budget, Lending & Reminder Column */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.33, ease: "easeInOut" }}
          viewport={{ once: true, amount: 0.1 }}
          className="w-full lg:w-2/5 flex flex-col justify-between gap-6"
        >
          {/* Budget Overview */}
          <div className="bg-white rounded-xl p-6 md:p-8 border border-gray-200 shadow-md">
            <h2 className="text-lg font-bold mb-4">Budget Overview</h2>
            <div className="space-y-5">
              {budgetItems.map((item) => {
                const isOverBudget = item.spent > item.total;
                const percentage = Math.min((item.spent / item.total) * 100, 100);

                return (
                  <div key={item.id} className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <span className="text-gray-800">{item.name}</span>
                      <span className="text-gray-500">
                        ৳{item.spent.toLocaleString()} / ৳{item.total.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                          isOverBudget ? "bg-red-500" : "bg-emerald-600"
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lent & Borrowed Card */}
          <div className="bg-white rounded-xl p-4 md:p-8 shadow-md grid grid-cols-2 gap-4">
            <div className="bg-primary/10 rounded-xl p-4 text-center">
              <span className="text-xs font-extrabold text-primary tracking-wider uppercase block mb-1">
                LENT
              </span>
              <span className="md:text-2xl font-bold text-primary">
                ৳{lendingData.lent.toLocaleString()}
              </span>
            </div>

            <div className="bg-red-50 rounded-xl p-4 text-center">
              <span className="text-xs font-extrabold text-red-600 tracking-wider uppercase block mb-1">
                BORROWED
              </span>
              <span className="md:text-2xl font-bold text-red-600">
                ৳{lendingData.borrowed.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Upcoming Reminders Banner */}
          <div className="bg-emerald-600 rounded-xl p-6 md:p-8 text-white shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <FaCalendarAlt className="text-xl" />
              <h3 className="text-lg font-bold">Upcoming Reminders</h3>
            </div>

            <div className="bg-emerald-500/60 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between border border-emerald-400/30">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <FaBolt className="text-emerald-700 text-lg" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm md:text-base leading-tight">
                    {reminderData.title}
                  </h4>
                  <p className="text-xs font-medium text-emerald-100 mt-0.5">
                    Due: {reminderData.dueDate}
                  </p>
                </div>
              </div>

              <Link
                to="/pay"
                className="bg-white text-emerald-700 font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm shadow-sm hover:bg-emerald-50 transition-colors shrink-0"
              >
                Pay Now
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;