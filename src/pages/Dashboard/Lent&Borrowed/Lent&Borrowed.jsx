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
  //   BellRing
} from "lucide-react";
import { AddLentBorrowedRecord } from "./AddLentBorrowedRecord";
import { motion } from "framer-motion";

// --- Sample Data Based on Provided CreditDebit & User JSON Schemas ---
const mockCreditDebitData = [
  {
    _id: "65b0f3001a2b3c4d5e6f7b10",
    userId: "user1",
    bookId: "book1",
    personName: "Rahim Ahmed",
    personPhoto: null,
    personEmail: "rahim@example.com",
    type: "LENT",
    principalAmount: 5000.0,
    settledAmount: 0.0,
    remainingBalance: 5000.0,
    dueDate: "2026-08-20T00:00:00.000Z",
    createdDate: "2026-07-20T00:00:00.000Z",
    status: "PENDING", // PENDING, PAID, OVERDUE, PARTIAL
    note: "Laptop Purchase",
  },
  {
    _id: "65b0f3001a2b3c4d5e6f7b11",
    userId: "user1",
    bookId: "book1",
    personName: "Nusrat Jahan",
    personPhoto: null,
    personEmail: "nusrat@example.com",
    type: "LENT",
    principalAmount: 3500.0,
    settledAmount: 3500.0,
    remainingBalance: 0.0,
    dueDate: "2026-08-01T00:00:00.000Z",
    createdDate: "2026-07-15T00:00:00.000Z",
    status: "PAID",
    note: "Emergency",
  },
  {
    _id: "65b0f3001a2b3c4d5e6f7b12",
    userId: "user1",
    bookId: "book1",
    personName: "Sabbir Hasan",
    personPhoto: null,
    personEmail: "sabbir@example.com",
    type: "LENT",
    principalAmount: 10000.0,
    settledAmount: 0.0,
    remainingBalance: 10000.0,
    dueDate: "2026-07-15T00:00:00.000Z",
    createdDate: "2026-07-01T00:00:00.000Z",
    status: "OVERDUE",
    lateDays: 15,
    note: "Business Support",
  },
  {
    _id: "65b0f3001a2b3c4d5e6f7b13",
    userId: "user1",
    bookId: "book1",
    personName: "Alex Smith",
    personPhoto: null,
    personEmail: "alex@example.com",
    type: "BORROWED",
    principalAmount: 9200.0,
    settledAmount: 2400.0,
    remainingBalance: 6800.0,
    dueDate: "2026-09-05T00:00:00.000Z",
    createdDate: "2026-07-10T00:00:00.000Z",
    status: "PENDING",
    note: "Flight Booking Loan",
  },
];

const chartData = [
  { month: "May", lent: 7000, borrowed: 1000 },
  { month: "Jun", lent: 5000, borrowed: 3500 },
  { month: "Jul", lent: 9000, borrowed: 4000 },
  { month: "Aug", lent: 6500, borrowed: 2000 },
];

export const LentAndBorrowed = () => {
  const [activeTab, setActiveTab] = useState("LENT"); // LENT or BORROWED
  const [searchTerm, setSearchTerm] = useState("");

  // --- Filter Records ---
  const filteredRecords = useMemo(() => {
    return mockCreditDebitData.filter((record) => {
      const matchesTab = record.type === activeTab;
      const matchesSearch =
        record.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.note.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchTerm]);

  return (
    <div className="pt-6 pb-12">
      <div className="space-y-6">
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
            <span className="text-[11px] font-bold  uppercase tracking-wider">
              Total Lent
            </span>
            <div className="text-2xl font-black text-emerald-600">৳18,500</div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold pt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12% this month</span>
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
            <span className="text-[11px] font-bold  uppercase tracking-wider">
              Total Borrowed
            </span>
            <div className="text-2xl font-black text-red-800">৳9,200</div>
            <div className="flex items-center gap-1 text-xs  font-semibold pt-1">
              <Minus className="w-3.5 h-3.5" />
              <span>Stable position</span>
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
            <span className="text-[11px] font-bold  uppercase tracking-wider">
              To Receive
            </span>
            <div className="text-2xl font-black ">৳12,000</div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold pt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>3 payments pending</span>
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
            <span className="text-[11px] font-bold  uppercase tracking-wider">
              To Pay
            </span>
            <div className="text-2xl font-black text-red-600">৳6,800</div>
            <div className="flex items-center gap-1.5 text-xs text-red-500 font-semibold pt-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Due next week</span>
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
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 " />
                  <input
                    type="text"
                    placeholder="Search person..."
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
                  const createdDateStr = new Date(
                    record.createdDate,
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });
                  const dueDateStr = new Date(
                    record.dueDate,
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });

                  return (
                    <div
                      key={record._id}
                      className="bg-white p-5 rounded-2xl border border-base-100 shadow-sm space-y-4"
                    >
                      {/* Top Person Info */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                              record.status === "OVERDUE"
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
                              className={`font-bold text-sm ${record.status === "OVERDUE" ? "text-red-600" : ""}`}
                            >
                              {record.personName}
                            </h4>
                            <p className="text-xs  mt-0.5">
                              Purpose: {record.note} • {createdDateStr}
                            </p>
                          </div>
                        </div>

                        {/* Amount & Status Badge */}
                        <div className="text-right space-y-1">
                          <div
                            className={`text-base font-black ${record.status === "PAID" ? "" : record.status === "OVERDUE" ? "text-red-600" : "text-emerald-700"}`}
                          >
                            ৳{record.remainingBalance.toLocaleString()}
                          </div>
                          <span
                            className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                              record.status === "PENDING"
                                ? "bg-red-100 text-red-600"
                                : record.status === "PAID"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-600"
                            }`}
                          >
                            {record.status}
                          </span>
                        </div>
                      </div>

                      {/* Overdue Warning or Normal Due Date Footer */}
                      {record.status === "OVERDUE" ? (
                        <div className="pt-2 border-t border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-red-600">
                            <AlertTriangle className="w-4 h-4" />
                            <span>
                              Was due: {dueDateStr} ({record.lateDays} Days
                              Late)
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="px-4 py-2 border border-red-200 text-red-600 font-bold rounded-xl text-xs hover:bg-red-50 transition">
                              Send Reminder
                            </button>
                            <button className="px-4 py-2 bg-primary text-white font-bold rounded-xl text-xs hover:bg-[#00472B] transition">
                              Mark as Paid
                            </button>
                          </div>
                        </div>
                      ) : record.status === "PENDING" ? (
                        <div className="pt-2 border-t border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-red-500">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {dueDateStr}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              disabled
                              className="px-4 py-2 border border-gray-200 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-50 transition"
                            >
                              View Details
                            </button>
                            <button className="px-4 py-2 border border-gray-200 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-50 transition">
                              Edit
                            </button>
                            <button className="px-4 py-2 bg-primary text-white font-bold rounded-xl text-xs hover:bg-[#00472B] transition">
                              Mark as Paid
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-2 border-t border-gray-50 flex justify-end">
                          <button className="text-xs font-bold text-emerald-700 hover:underline">
                            View Receipt
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="bg-white p-8 rounded-2xl text-center  font-medium">
                  No records found for {activeTab.toLowerCase()}.
                </div>
              )}
            </div>

            {/* Bottom Floating Action Add Button */}
            <div>
              <button
                onClick={() =>
                  document.getElementById("my_modal_5").showModal()
                }
                className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-2xl font-bold text-xs hover:bg-[#00472B] transition shadow-md"
              >
                <Plus className="w-4 h-4" />
                Add Record
              </button>
              <dialog
                id="my_modal_5"
                className="modal modal-bottom sm:modal-middle"
              >
                <div className="">
                  <AddLentBorrowedRecord />
                </div>
              </dialog>
            </div>
          </motion.div>

          {/* Right Column: Chart & Reminders */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.30, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-6"
          >
            {/* Chart: Lent vs Borrowed Stacked Bar */}
            <div className="bg-white p-5 rounded-2xl border border-base-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold  text-sm">Lent vs Borrowed</h3>
                <button className=" hover:text-gray-600">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div className="h-48 w-full">
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
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="text-gray-600">Lent</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B91C1C]" />
                  <span className="text-gray-600">Borrowed</span>
                </div>
              </div>
            </div>

            {/* Upcoming Reminders Card */}
            <div className="bg-white p-5 rounded-2xl border border-base-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold  text-sm">Upcoming Reminders</h3>
                <button className="text-xs font-bold text-emerald-700 hover:underline">
                  See All
                </button>
              </div>

              <div className="space-y-3">
                {/* Reminder 1 */}
                <div className="p-3 bg-gray-50 rounded-xl border-l-4 border-red-500 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs ">Rahim Ahmed</h5>
                    <p className="text-[10px] font-semibold text-red-500 mt-0.5">
                      Due in 3 days
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-xs ">৳5,000</div>
                    <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[9px] font-bold rounded">
                      URGENT
                    </span>
                  </div>
                </div>

                {/* Reminder 2 */}
                <div className="p-3 bg-gray-50 rounded-xl border-l-4 border-emerald-600 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs ">Personal Loan #24</h5>
                    <p className="text-[10px] font-semibold text-gray-500 mt-0.5">
                      Due in 12 days
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-xs ">৳1,200</div>
                    <span className="px-1.5 py-0.5 bg-gray-200 text-gray-600 text-[9px] font-bold rounded">
                      BORROWED
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Promotional Banner */}
            {/* <div className="bg-primary p-5 rounded-2xl text-white space-y-4 relative overflow-hidden">
              <div className="space-y-1 z-10 relative">
                <h4 className="font-bold text-sm">Improve Recovery?</h4>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  Send automatic SMS reminders to your borrowers directly from the app.
                </p>
              </div>
              <button className="w-full py-2.5 bg-white text-primary font-bold rounded-xl text-xs hover:bg-emerald-50 transition z-10 relative">
                Enable Notifications
              </button>
            </div> */}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
