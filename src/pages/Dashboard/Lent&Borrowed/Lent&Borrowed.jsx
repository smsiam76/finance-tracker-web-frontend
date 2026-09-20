import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  TrendingUp,
  Minus,
  Calendar,
  AlertTriangle,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  User,
  Plus,
  Loader2,
} from "lucide-react";
import { AddLentBorrowedRecord } from "./AddLentBorrowedRecord";
import { motion } from "framer-motion";
import useDebts from "../../../hooks/useDebts";
import Loader from "../../../component/Shared/Loader/Loader";

// Helper function moved to top level
const debtStatusCalc = (record) => {
  if (record.status === "PAID") return "PAID";
  if (record.dueDate) {
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const isPast = new Date(record.dueDate) < todayEnd;
    if (isPast) return "OVERDUE";
  }
  return record.status || "PENDING";
};

export const LentAndBorrowed = () => {
  const [loadingDebtId, setLoadingDebtId] = useState(null);

  const { debts = [], isLoading, isError, settleDebt, isSettling } = useDebts();

  const [activeTab, setActiveTab] = useState("LENT"); // LENT or BORROWED
  const [searchTerm, setSearchTerm] = useState("");

  // --- Dynamic Stats Calculations ---
  const stats = useMemo(() => {
    let totalLent = 0;
    let totalBorrowed = 0;
    let toReceive = 0;
    let toPay = 0;
    let pendingLentCount = 0;

    debts.forEach((debt) => {
      const principal = Number(debt.principalAmount) || 0;
      const remaining = Number(debt.remainingBalance) || 0;

      if (debt.type === "LENT") {
        totalLent += principal;
        toReceive += remaining;
        if (debt.status !== "PAID" && remaining > 0) {
          pendingLentCount++;
        }
      } else if (debt.type === "BORROWED") {
        totalBorrowed += principal;
        toPay += remaining;
      }
    });

    return { totalLent, totalBorrowed, toReceive, toPay, pendingLentCount };
  }, [debts]);

  // --- Dynamic Chart Data (Grouped by Month) ---
  const chartData = useMemo(() => {
    const monthlyMap = {};

    debts.forEach((debt) => {
      const date = new Date(debt.createdAt || debt.dueDate);
      if (isNaN(date.getTime())) return;

      const monthName = date.toLocaleString("en-US", { month: "short" });
      const amount = Number(debt.principalAmount) || 0;

      if (!monthlyMap[monthName]) {
        monthlyMap[monthName] = { month: monthName, lent: 0, borrowed: 0 };
      }

      if (debt.type === "LENT") {
        monthlyMap[monthName].lent += amount;
      } else if (debt.type === "BORROWED") {
        monthlyMap[monthName].borrowed += amount;
      }
    });

    return Object.values(monthlyMap);
  }, [debts]);

  // --- Filter Records ---
  const filteredRecords = useMemo(() => {
    return debts.filter((record) => {
      const matchesTab = record.type === activeTab;
      const matchesSearch =
        record.personName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.note?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [debts, activeTab, searchTerm]);

  // --- Upcoming / Urgent Reminders ---
  const upcomingReminders = useMemo(() => {
    return debts
      .filter((d) => d.status !== "PAID" && Number(d.remainingBalance) > 0)
      .slice(0, 3);
  }, [debts]);

  // --- Single handleMarkAsPaid Function ---
  const handleMarkAsPaid = async (debt) => {
    try {
      setLoadingDebtId(debt._id);
      await settleDebt({
        id: debt._id,
        settlementData: {
          amount: Number(debt.remainingBalance),
          note: "Full Settlement",
        },
      });
    } catch (err) {
      console.error("Failed to settle debt", err);
    } finally {
      setLoadingDebtId(null);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500 font-semibold bg-red-50 rounded-2xl my-6">
        Failed to load debt records. Please try refreshing the page.
      </div>
    );
  }

  return (
    <div className="pt-6 pb-12">
      <div className="space-y-10">
        {/* --- Top 4 Stat Cards --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Lent */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white p-5 rounded-2xl border border-base-100 shadow-sm space-y-1"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Total Lent
            </span>
            <div className="text-2xl font-black text-emerald-600">
              ৳{stats.totalLent.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold pt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Overall Lended Amount</span>
            </div>
          </motion.div>

          {/* Card 2: Total Borrowed */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.18, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white p-5 rounded-2xl border border-base-100 shadow-sm space-y-1"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Total Borrowed
            </span>
            <div className="text-2xl font-black text-red-800">
              ৳{stats.totalBorrowed.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 font-semibold pt-1">
              <Minus className="w-3.5 h-3.5" />
              <span>Overall Borrowed Amount</span>
            </div>
          </motion.div>

          {/* Card 3: To Receive */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.21, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white p-5 rounded-2xl border border-base-100 shadow-sm space-y-1"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              To Receive
            </span>
            <div className="text-2xl font-black text-gray-800">
              ৳{stats.toReceive.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold pt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{stats.pendingLentCount} payments pending</span>
            </div>
          </motion.div>

          {/* Card 4: To Pay */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.24, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white p-5 rounded-2xl border border-base-100 shadow-sm space-y-1"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              To Pay
            </span>
            <div className="text-2xl font-black text-red-600">
              ৳{stats.toPay.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-red-500 font-semibold pt-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Remaining balance to clear</span>
            </div>
          </motion.div>
        </div>

        {/* --- Main Dashboard Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Records & Controls */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.27, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Filter Bar & Search */}
            <div className="bg-white p-2.5 rounded-2xl border border-base-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Toggle Buttons */}
              <div className="bg-base-100/80 p-1 rounded-xl flex items-center w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab("LENT")}
                  className={`flex-1 sm:flex-none px-6 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === "LENT"
                      ? "bg-white text-emerald-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Lent
                </button>
                <button
                  onClick={() => setActiveTab("BORROWED")}
                  className={`flex-1 sm:flex-none px-6 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === "BORROWED"
                      ? "bg-white text-emerald-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Borrowed
                </button>
              </div>

              {/* Search & Filter Button */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search person or note..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
                <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500">
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Itemized Record List */}
            <div className="space-y-4">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => {
                  const createdDateStr = record.createdAt
                    ? new Date(record.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A";

                  const dueDateObj = record.dueDate
                    ? new Date(record.dueDate)
                    : null;
                  const dueDateStr = dueDateObj
                    ? dueDateObj.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "No Due Date";

                  const calculatedStatus = debtStatusCalc(record);
                  const isOverdue = calculatedStatus === "OVERDUE";
                  const isItemLoading = loadingDebtId === record._id;

                  const statusClass =
                    record.status === "PAID"
                      ? "bg-emerald-100 text-emerald-700"
                      : isOverdue
                        ? "bg-red-100 text-red-600"
                        : "bg-amber-100 text-amber-700";

                  return (
                    <div
                      key={record._id}
                      className="bg-white p-5 rounded-2xl border border-base-100 shadow-md space-y-4"
                    >
                      {/* Top Person Info */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                              isOverdue
                                ? "bg-red-100 text-red-600"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {record.personPhoto ? (
                              <img
                                src={record.personPhoto}
                                alt={record.personName}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <h4
                              className={`font-bold text-sm ${
                                isOverdue ? "text-red-600" : "text-gray-800"
                              }`}
                            >
                              {record.personName}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Purpose: {record.note || "N/A"} • Created:{" "}
                              {createdDateStr}
                            </p>
                          </div>
                        </div>

                        {/* Amount & Status Badge */}
                        <div className="text-right space-y-1">
                          <div
                            className={`text-base font-black ${
                              record.status === "PAID"
                                ? "text-gray-700"
                                : isOverdue
                                  ? "text-red-600"
                                  : "text-emerald-700"
                            }`}
                          >
                            ৳{Number(record.remainingBalance).toLocaleString()}
                          </div>
                          <span
                            className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${statusClass}`}
                          >
                            {isOverdue ? "OVERDUE" : record.status}
                          </span>
                        </div>
                      </div>

                      {/* Footer Actions / Info */}
                      <div className="pt-2 border-t border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div
                          className={`flex items-center gap-1.5 text-xs font-bold ${
                            isOverdue ? "text-red-600" : "text-gray-500"
                          }`}
                        >
                          {isOverdue ? (
                            <AlertTriangle className="w-4 h-4" />
                          ) : (
                            <Calendar className="w-4 h-4" />
                          )}
                          <span>
                            {isOverdue ? "Was due" : "Due"}: {dueDateStr}
                          </span>
                        </div>

                        {record.status !== "PAID" && (
                          <div className="flex items-center gap-2">
                            <button
                              disabled={isSettling || isItemLoading}
                              onClick={() => handleMarkAsPaid(record)}
                              className="px-4 py-2 bg-emerald-700 text-white font-bold rounded-xl text-xs hover:bg-emerald-800 transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                            >
                              {isItemLoading && (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              )}
                              <span>
                                {isItemLoading ? "Processing..." : "Mark as Paid"}
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-white p-8 rounded-2xl text-center text-gray-500 font-medium border border-base-100">
                  No records found for {activeTab.toLowerCase()}.
                </div>
              )}
            </div>

            {/* Bottom Floating Action Add Button */}
            <div>
              <button
                onClick={() =>
                  document.getElementById("my_modal_5")?.showModal()
                }
                className="flex items-center gap-2 cursor-pointer bg-emerald-700 text-white px-5 py-3 rounded-2xl font-bold text-xs hover:bg-emerald-800 transition-all duration-300 shadow-md"
              >
                <Plus className="w-4 h-4" />
                Add Record
              </button>
              <dialog
                id="my_modal_5"
                className="modal modal-bottom sm:modal-middle"
              >
                <div>
                  <AddLentBorrowedRecord />
                </div>
              </dialog>
            </div>
          </motion.div>

          {/* Right Column: Chart & Reminders */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-6"
          >
            {/* Chart: Lent vs Borrowed Stacked Bar */}
            <div className="bg-white p-5 rounded-2xl border border-base-100 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-gray-800">
                  Lent vs Borrowed
                </h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div className="h-48 w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#9CA3AF" }}
                      />
                      <Tooltip />
                      <Bar
                        dataKey="lent"
                        stackId="a"
                        fill="#005A36"
                        radius={[0, 0, 0, 0]}
                      />
                      <Bar
                        dataKey="borrowed"
                        stackId="a"
                        fill="#B91C1C"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-gray-400">
                    No data available for chart
                  </div>
                )}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
                  <span className="text-gray-600">Lent</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B91C1C]" />
                  <span className="text-gray-600">Borrowed</span>
                </div>
              </div>
            </div>

            {/* Upcoming Reminders Card */}
            <div className="bg-white p-5 rounded-2xl border border-base-100 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-gray-800">
                  Upcoming Reminders
                </h3>
              </div>

              <div className="space-y-3">
                {upcomingReminders.length > 0 ? (
                  upcomingReminders.map((reminder) => {
                    const isBorrow = reminder.type === "BORROWED";
                    return (
                      <div
                        key={reminder._id}
                        className={`p-3 bg-gray-50 rounded-xl border-l-4 flex items-center justify-between ${
                          isBorrow ? "border-red-500" : "border-emerald-600"
                        }`}
                      >
                        <div>
                          <h5 className="font-bold text-xs text-gray-800">
                            {reminder.personName}
                          </h5>
                          <p className="text-[10px] font-semibold text-gray-500 mt-0.5">
                            Due:{" "}
                            {reminder.dueDate
                              ? new Date(reminder.dueDate).toLocaleDateString(
                                  "en-GB"
                                )
                              : "N/A"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-xs text-gray-800">
                            ৳
                            {Number(reminder.remainingBalance).toLocaleString()}
                          </div>
                          <span
                            className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                              isBorrow
                                ? "bg-red-100 text-red-600"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {reminder.type}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-400 text-center py-2">
                    No pending reminders
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};