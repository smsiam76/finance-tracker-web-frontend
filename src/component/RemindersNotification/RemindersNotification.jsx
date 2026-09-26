import { useState, useMemo, useRef, useEffect } from "react";
import { Bell, BellRing, X, Calendar, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useReminders from "../../hooks/useReminders";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router";

const RemindersNotification = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Helper function to format ISO date strings into readable dates
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const {
    reminders = [],
    // isLoading: isRemindersLoading,
  } = useReminders(user?.email);

  // Filter reminders that are active and due within the next 3 days (including overdue items)
  const upcomingReminders = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return reminders.filter((item) => {
      // Ignore non-active items
      if (item.status !== "active") return false;

      const dueDate = new Date(item.nextDueDate);
      dueDate.setHours(0, 0, 0, 0);

      // Calculate difference in days
      const diffTime = dueDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Include items due within 3 days or already past due
      return diffDays <= 3;
    });
  }, [reminders]);

  // Handle outside click to automatically dismiss the notification popover
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const badgeCount = upcomingReminders.length;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2.5 rounded-xl hover:bg-white text-gray-700 transition flex items-center justify-center focus:outline-none cursor-pointer"
        title="View Notifications"
      >
        <Bell className="w-5 h-5 text-gray-700" />

        {/* Counter Badge */}
        {badgeCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse shadow-sm">
            {badgeCount > 9 ? "9+" : badgeCount}
          </span>
        )}
      </button>

      {/* Notification Popover Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            {/* Popover Header */}
            <div className="p-4 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <BellRing className="w-4 h-4 text-amber-600 animate-bounce" />
                <span>Upcoming Due Reminders ({badgeCount})</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notification List Container */}
            <div className="max-h-80 overflow-y-auto p-3 space-y-2.5">
              {upcomingReminders.length === 0 ? (
                <div className="py-8 text-center text-gray-400 space-y-2">
                  <Bell className="w-8 h-8 mx-auto text-gray-300 stroke-1" />
                  <p className="text-xs">
                    No upcoming due reminders for the next 3 days!
                  </p>
                </div>
              ) : (
                upcomingReminders.map((rem) => {
                  const isIncome = ["INCOME", "CASH_IN", "cash-in"].includes(
                    rem.type
                  );
                  return (
                    <div
                      key={rem._id}
                      className="bg-white p-3 rounded-xl border border-gray-100 hover:border-amber-200 transition flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs text-gray-800 leading-snug">
                          {rem.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-gray-500">
                          <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-semibold text-gray-700">
                            {rem.bookName}
                          </span>
                          <span className="flex items-center gap-1 font-medium text-amber-700">
                            <Calendar className="w-3 h-3 text-amber-500" />
                            {formatDate
                              ? formatDate(rem.nextDueDate)
                              : rem.nextDueDate}
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p
                          className={`text-xs font-black ${
                            isIncome ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          ৳ {rem.amount?.toLocaleString()}
                        </p>
                        <span className="text-[9px] font-semibold text-gray-400 capitalize">
                          {rem.frequency}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Popover Footer */}
            {upcomingReminders.length > 0 && (
              <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                <p className="text-[11px] text-gray-500 font-medium flex items-center justify-center gap-1">
                  Pay or clear from <Link to="/dashboard/reminders">Reminders</Link>
                  <ArrowRight className="w-3 h-3" />
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RemindersNotification;