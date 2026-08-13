import { BsPiggyBank } from "react-icons/bs";
import { motion } from "framer-motion";
import {
  FaBolt,
  FaCalendarAlt,
  FaExchangeAlt,
  FaMoneyBillAlt,
  FaMoneyBillWave,
  FaPlus,
} from "react-icons/fa";
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
      icon: <FaPlus />,
    },
    {
      title: "Cash In",
      route: "/dashboard/cash-in",
      icon: <FaMoneyBillWave />,
    },
    {
      title: "Cash Out",
      route: "/dashboard/cash-out",
      icon: <FaMoneyBillAlt className="text-xl text-red-200" />,
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
    <>
      <div className="py-12">
        {/* ------------------------------
            part 1
        ------------------------------ */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8 mb-12">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeInOut" }}
            className="bg-primary text-white p-8 border border-primary shadow-md rounded-md"
          >
            <div className="flex items-center justify-between">
              <h4 className="md:text-xl font-semibold mb-3">Total Balance</h4>
              <div className="w-fit p-2.5 flex items-center justify-center bg-base-100 text-primary rounded-full">
                <GiTakeMyMoney className="text-3xl" />
              </div>
            </div>
            <h3 className="text-xl md:text-3xl font-bold ml-2 pb-4">65200</h3>
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
            className="bg-white p-8 border border-primary/20 shadow-md rounded-md"
          >
            <div className="flex items-center justify-between">
              <h4 className="md:text-xl font-semibold mb-3">Total Income</h4>
              <div className="w-fit p-2.5 flex items-center justify-center bg-base-100 text-primary rounded-full">
                <IoMdTrendingUp className="text-2xl" />
              </div>
            </div>
            <h3 className="text-xl md:text-3xl pb-4 font-bold ml-2">50200</h3>
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeInOut" }}
            className="bg-white p-8 border border-primary/20 shadow-md rounded-md"
          >
            <div className="flex items-center justify-between">
              <h4 className="md:text-xl font-semibold mb-3">Total Expense</h4>
              <div className="w-fit p-2.5 flex items-center justify-center bg-red-200 text-primary rounded-full">
                <IoMdTrendingDown className="text-2xl text-red-400" />
              </div>
            </div>
            <h3 className="text-xl md:text-3xl pb-4 font-bold ml-2">50200</h3>
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25, ease: "easeInOut" }}
            className="bg-white p-8 border border-primary/20 shadow-md rounded-md"
          >
            <div className="flex items-center justify-between">
              <h4 className="md:text-xl font-semibold mb-3">Net Savings</h4>
              <div className="w-fit p-2.5 flex items-center justify-center bg-base-100 text-primary rounded-full">
                <BsPiggyBank className="text-2xl" />
              </div>
            </div>
            <h3 className="text-xl md:text-3xl pb-4 font-bold ml-2">50200</h3>
          </motion.div>
        </div>

        {/* ------------------------------ 
            part 2
        ------------------------------ */}
        <div className="mb-12">
          <div className="flex gap-12">
            {/* left portion */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3, ease: "easeInOut" }}
              viewport={{once: true, amount: .1}}
              className="bg-white w-2/3 p-10 shadow-xl rounded-xl"
            >
              <h3 className="text-2xl font-bold mb-6">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-12">
                {quickActions?.map((action, idx) => (
                  <Link
                    to={`${action?.route}`}
                    key={idx}
                    className="group hover:bg-primary border border-primary/20 rounded-lg shadow-lg p-4 text-center bg-base-100 transition-all duration-300 ease-in-out"
                  >
                    <div className="flex justify-center mb-2">
                      <span className="group-hover:bg-base-100 group-hover:text-primary transition-colors ease-in-out w-fit bg-primary/90 p-3 text-base-100 text-xl rounded-md shadow-md">
                        {action?.icon}
                      </span>
                    </div>
                    <span className="font-semibold group-hover:text-white transition-colors ease-in-out">
                      {action.title}
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
            {/* right portion category wise pie chart */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.28, ease: "easeInOut" }}
              viewport={{once: true, amount: .1}}
              className="w-1/3 p-10 bg-white shadow-xl rounded-xl"
            >
              <h3 className="text-2xl font-bold mb-6">Expense by Category</h3>
              <ExpenseByCategoryChart />
            </motion.div>
          </div>
        </div>

        {/* ------------------------------
            part 3 | Recent Transaction  and Budget
        ------------------------------ */}
        <div className="flex flex-col md:flex-row gap-12">
          {/* left portion: recent transaction */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeInOut" }}
            viewport={{once: true, amount: .1}}
            className="w-3/5 bg-white shadow-xl rounded-xl py-10"
          >
            <div className="flex justify-between px-10">
              <h3 className="text-xl font-bold">Recent Transaction</h3>
              <Link
                to="/dashboard"
                className="font-medium hover:text-primary transition-all duration-300 ease-in-out"
              >
                View All
              </Link>
            </div>
            <span className="divider"></span>
            <RecentTransactions />
          </motion.div>

          {/* right portion: budget, lent borrwed, reminder */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.33, ease: "easeInOut" }}
            viewport={{once: true, amount: .1}}
            className="w-2/5 flex flex-col justify-around gap-8"
          >
            {/* budget overview */}
            <div className="bg-white rounded-xl p-10 border border-gray-200 shadow-md">
              <h2 className="text-lg font-bold mb-6">Budget Overview</h2>

              <div className="space-y-6">
                {budgetItems.map((item) => {
                  const isOverBudget = item.spent > item.total;
                  const percentage = Math.min(
                    (item.spent / item.total) * 100,
                    100,
                  );

                  return (
                    <div key={item.id} className="space-y-2">
                      <div className="flex justify-between items-center text-base font-semibold">
                        <span className="text-gray-800">{item.name}</span>
                        <span className="text-gray-500">
                          ৳{item.spent.toLocaleString()} / ৳
                          {item.total.toLocaleString()}
                        </span>
                      </div>

                      {/* Progress Bar Container */}
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            isOverBudget ? "bg-red-700" : "bg-emerald-800"
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Lent & Borrowed Card */}
            <div className="bg-white rounded-xl p-10 shadow-sm grid grid-cols-2 gap-8">
              {/* Lent Box */}
              <div className="bg-primary/10 rounded-xl p-4 text-center">
                <span className="text-xs font-extrabold text-primary tracking-wider uppercase block mb-1">
                  LENT
                </span>
                <span className="text-2xl font-bold text-primary">
                  ৳{lendingData.lent.toLocaleString()}
                </span>
              </div>

              {/* Borrowed Box */}
              <div className="bg-red-100/60 rounded-xl p-4 text-center">
                <span className="text-xs font-extrabold text-red-800 tracking-wider uppercase block mb-1">
                  BORROWED
                </span>
                <span className="text-2xl font-bold text-red-800">
                  ৳{lendingData.borrowed.toLocaleString()}
                </span>
              </div>
            </div>

            {/* 3. Upcoming Reminders Banner */}
            <div className="bg-emerald-500 rounded-xl p-10 text-white shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <FaCalendarAlt className="text-xl" />
                <h3 className="text-lg font-bold">Upcoming Reminders</h3>
              </div>

              {/* Reminder Details Box */}
              <div className="bg-emerald-400/50 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between border border-emerald-300/30">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-200/80 flex items-center justify-center shrink-0">
                    <FaBolt className="text-emerald-800 text-xl" />
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 text-base leading-tight">
                      {reminderData.title}
                    </h4>
                    <p className="text-xs font-medium text-emerald-900/80 mt-0.5">
                      Due: {reminderData.dueDate}
                    </p>
                  </div>
                </div>

                <Link
                  to="/pay"
                  className="bg-white text-emerald-700 font-bold px-4 py-2 rounded-xl text-sm shadow-sm hover:bg-emerald-50 transition-colors"
                >
                  Pay Now
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
