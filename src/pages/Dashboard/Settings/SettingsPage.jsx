import { useState } from "react";
import {
  User,
  Key,
  ChevronRight,
  Sun,
  Moon,
  Bell,
  Shield,
  FileText,
  FileSpreadsheet,
  ExternalLink,
  Mail,
  Database,
  Cloud,
  HardDrive,
  RotateCcw,
} from "lucide-react";
import { motion } from "framer-motion";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../component/Shared/Loader/Loader";
import useSingleUser from "../../../hooks/useSingleUser";
import {
  handleLocalStorageBackup,
  handleGoogleDriveBackup,
  handleRestoreData,
  handleExportData,
  handleDeleteAllData,
} from "../../../utility/settingsUtils";
import { Helmet } from "react-helmet-async";

export const SettingsPage = () => {
  const { user } = useAuth();
  const { user: singleUser, isLoading } = useSingleUser(user?.email);

  // Read last recorded backup timestamp from localStorage
  const [lastBackup, setLastBackup] = useState(
    localStorage.getItem("lastBackupTime") || "No backup taken yet",
  );

  // User preference state settings
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    paymentReminders: true,
    weeklySummary: true,
  });

  const handleToggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="pt-6 pb-12">
      <Helmet>
        <title>Settings | Dashboard | Finance Tracker</title>
      </Helmet>
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= LEFT COLUMN ================= */}
        <div className="lg:col-span-2 space-y-10">
          {/* Account Settings Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-6 rounded-2xl border border-base-100 shadow-lg space-y-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-base">Account Settings</h3>
              </div>
              <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Full Name
                </span>
                <p className="font-bold text-sm">{singleUser?.name || "N/A"}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Email Address
                </span>
                <p className="font-semibold text-sm">
                  {singleUser?.email || "N/A"}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Phone Number
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Location
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-50">
              <button className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition text-left">
                <div className="flex items-center gap-3">
                  <Key className="w-4 h-4" />
                  <span className="text-xs font-bold">Change Password</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Preferences Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-6 rounded-2xl border border-base-100 shadow-lg space-y-4"
          >
            <h3 className="font-bold text-base">Preferences</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Currency
                </label>
                <div className="w-full px-3 py-2 bg-gray-100/80 border border-gray-200 rounded-xl text-xs font-bold text-gray-700">
                  ৳ BDT (Bangladeshi Taka)
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Theme Mode
                </label>
                <div className="bg-base-100 p-1.5 border border-primary/10 rounded-xl flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-500" /> Light
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={theme === "dark"}
                      onChange={(e) => {
                        const newTheme = e.target.checked ? "dark" : "light";
                        setTheme(newTheme);
                        localStorage.setItem("theme", newTheme);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-primary/10 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                  <span className="flex items-center gap-1">
                    <Moon className="w-3.5 h-3.5 text-slate-500" /> Dark
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
          {/* DATA BACKUP CARD */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-6 rounded-2xl border border-base-100 shadow-lg space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-800" />
                <h3 className="font-bold text-base">Data Backup</h3>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Last Backup: {lastBackup}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <button
                onClick={handleGoogleDriveBackup}
                className="flex flex-col items-center justify-center p-4 border border-emerald-200 rounded-2xl hover:bg-emerald-50/50 transition group"
              >
                <Cloud className="w-5 h-5 text-emerald-800 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-gray-800">
                  Google Drive
                </span>
              </button>

              <button
                onClick={() => handleLocalStorageBackup(user, setLastBackup)}
                className="flex flex-col items-center justify-center p-4 border border-emerald-200 rounded-2xl hover:bg-emerald-50/50 transition group"
              >
                <HardDrive className="w-5 h-5 text-emerald-800 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-gray-800">
                  Local Storage
                </span>
              </button>

              <button
                onClick={() => handleRestoreData(user)}
                className="flex flex-col items-center justify-center p-4 bg-emerald-800 text-white rounded-2xl hover:bg-emerald-900 transition group"
              >
                <RotateCcw className="w-5 h-5 mb-1 group-hover:-rotate-45 transition-transform" />
                <span className="text-xs font-bold">Restore Data</span>
              </button>
            </div>
          </motion.div>

          {/* Notifications & Reminders Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-6 rounded-2xl border border-base-100 shadow-lg space-y-4"
          >
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-base">Notifications & Reminders</h3>
            </div>

            <div className="space-y-4 pt-1">
              {[
                {
                  key: "budgetAlerts",
                  title: "Budget Alerts",
                  desc: "Notify when ৳ (BDT) spending exceeds set limits.",
                },
                {
                  key: "paymentReminders",
                  title: "Payment Reminders",
                  desc: "Get reminded of upcoming payments and dues.",
                },
                {
                  key: "weeklySummary",
                  title: "Weekly Financial Summary",
                  desc: "Every Monday morning overview of your ৳ (BDT) flow.",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between py-1"
                >
                  <div>
                    <h5 className="font-bold text-xs">{item.title}</h5>
                    <p className="text-[11px] font-medium text-gray-500 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[item.key]}
                      onChange={() => handleToggleNotification(item.key)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-primary/10 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="space-y-10">
          {/* Security Card */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-5 rounded-2xl border border-base-100 shadow-sm space-y-4"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-base">Security</h3>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Auto Logout Timer</span>
                <span className="font-semibold cursor-pointer flex items-center gap-1">
                  15 Minutes <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </motion.div>

          {/* Data Management Card */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-5 rounded-2xl border border-base-100 shadow-lg space-y-4"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Data Management
            </span>

            <div className="grid grid-cols-2 gap-3">
              <button
                disabled={true}
                onClick={() => handleExportData(user, "pdf")}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-emerald-50/60 hover:bg-emerald-100/60 border border-emerald-100 text-emerald-800 font-bold rounded-xl text-xs transition"
              >
                <FileText className="w-3.5 h-3.5" /> PDF
              </button>
              <button
                onClick={() => handleExportData(user, "excel")}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-emerald-50/60 hover:bg-emerald-100/60 border border-emerald-100 text-emerald-800 font-bold rounded-xl text-xs transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
              </button>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-[10px] font-semibold text-rose-500 italic leading-tight">
                Warning: This action cannot be undone and will erase all your
                financial records permanently.
              </p>
              <button
                onClick={() => handleDeleteAllData(user)}
                className="w-full py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-600 font-bold rounded-xl text-xs transition"
              >
                Delete All Data
              </button>
            </div>
          </motion.div>

          {/* About Card */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-5 rounded-2xl border border-base-100 shadow-lg space-y-3"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              About
            </span>

            <div className="space-y-3 pt-1 text-xs font-bold">
              <div className="flex items-center justify-between">
                <span>Web Version</span>
                <span>1.0.0 (Stable)</span>
              </div>
              <div className="flex items-center justify-between cursor-pointer hover:text-primary">
                <span>Privacy Policy</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center justify-between cursor-pointer hover:text-primary">
                <span>Contact Support</span>
                <Mail className="w-3.5 h-3.5" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
