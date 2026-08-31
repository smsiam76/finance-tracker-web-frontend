import { useState } from "react";
import {
  User,
  Key,
  ChevronRight,
  Sliders,
  Sun,
  Moon,
  Bell,
  Database,
  Cloud,
  HardDrive,
  RotateCcw,
  Shield,
  FileText,
  FileSpreadsheet,
  ExternalLink,
  Mail,
  Star,
} from "lucide-react";

import { motion } from "framer-motion";

// --- Default Settings Data Model ---
const initialSettingsData = {
  account: {
    fullName: "Tanvir Ahmed",
    email: "tanvir@example.com",
    phone: "+8801XXXXXXXXX",
    location: "Dhaka, Bangladesh",
  },
  preferences: {
    currency: "BDT",
    theme: "light",
  },
  notifications: {
    budgetAlerts: true,
    paymentReminders: true,
    billDueNotifications: false,
    weeklySummary: true,
    monthlyReport: true,
  },
  backup: {
    lastBackup: "31 July 2026 • 8:45 PM",
  },
  security: {
    autoLogoutTimer: "15 Minutes",
  },
  about: {
    version: "1.0.0 (Stable)",
  },
};

export const SettingsPage = () => {
  const [settings, setSettings] = useState(initialSettingsData);

  // Toggle notification handler
  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  // Theme switch handler
  const handleThemeChange = (isDark) => {
    setSettings((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme: isDark ? "dark" : "light",
      },
    }));
  };

  return (
    <div className="pt-6 pb-12">
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= LEFT COLUMN ================= */}
        <div className="lg:col-span-2 space-y-10">
          {/* 1. Account Settings Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white p-6 rounded-2xl border border-base-100 shadow-lg space-y-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 ">
                <User className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-base">Account Settings</h3>
              </div>
              <button className="text-xs font-bold text-primary hover:underline">
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold  uppercase tracking-wider">
                  Full Name
                </span>
                <p className="font-bold text-sm ">
                  {settings.account.fullName}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold  uppercase tracking-wider">
                  Email Address
                </span>
                <p className="font-semibold text-sm ">
                  {settings.account.email}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold  uppercase tracking-wider">
                  Phone Number
                </span>
                <p className="font-semibold text-sm ">
                  {settings.account.phone}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold  uppercase tracking-wider">
                  Location
                </span>
                <p className="font-semibold text-sm ">
                  {settings.account.location}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-50">
              <button className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition text-left">
                <div className="flex items-center gap-3">
                  <Key className="w-4 h-4 " />
                  <span className="text-xs font-bold ">Change Password</span>
                </div>
                <ChevronRight className="w-4 h-4 " />
              </button>
            </div>
          </motion.div>

          {/* 2. Preferences Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.18, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white p-6 rounded-2xl border border-base-100 shadow-lg space-y-4"
          >
            <div className="flex items-center gap-2 ">
              <Sliders className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-base">Preferences</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Currency Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold  uppercase tracking-wider">
                  Currency
                </label>
                <select
                  value={settings.preferences.currency}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      preferences: {
                        ...settings.preferences,
                        currency: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-base-100 border border-primary/10 rounded-xl text-xs font-bold  focus:outline-none focus:border-primary"
                >
                  <option value="BDT">৳ BDT (Bangladesh Taka)</option>
                  <option value="USD">$ USD (US Dollar)</option>
                  <option value="EUR">€ EUR (Euro)</option>
                </select>
              </div>

              {/* Theme Mode Switch */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold  uppercase tracking-wider">
                  Theme Mode
                </label>
                <div className="bg-base-100 p-1.5 border border-primary/10 rounded-xl flex items-center justify-between text-xs font-bold ">
                  <span className="flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-500" /> Light Mode
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.preferences.theme === "dark"}
                      onChange={(e) => handleThemeChange(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-primary/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                  <span className="flex items-center gap-1">
                    <Moon className="w-3.5 h-3.5 text-slate-500" /> Dark
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 3. Notifications & Reminders Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.21, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white p-6 rounded-2xl border border-base-100 shadow-lg space-y-4"
          >
            <div className="flex items-center gap-2 ">
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
                  key: "billDueNotifications",
                  title: "Bill Due Notifications",
                  desc: "Alerts for recurring utility and credit bills.",
                },
                {
                  key: "weeklySummary",
                  title: "Weekly Financial Summary",
                  desc: "Every Monday morning overview of your ৳ (BDT) flow.",
                },
                {
                  key: "monthlyReport",
                  title: "Monthly Report Notification",
                  desc: "Receive comprehensive monthly PDF report alerts.",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between py-1"
                >
                  <div>
                    <h5 className="font-bold text-xs ">{item.title}</h5>
                    <p className="text-[11px] font-medium  mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications[item.key]}
                      onChange={() => handleToggle(item.key)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-primary/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 4. Data Backup Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.24, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white p-6 rounded-2xl border border-base-100 shadow-lg space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 ">
                <Database className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-base">Data Backup</h3>
              </div>
              <span className="text-[10px] font-bold text-primary bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                Last Backup: {settings.backup.lastBackup}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button className="flex flex-col items-center justify-center p-4 primary/5 hover:bg-emerald-100/50 border border-emerald-100 rounded-2xl transition gap-2 text-emerald-800 font-bold text-xs">
                <Cloud className="w-5 h-5 text-primary" />
                Google Drive
              </button>
              <button className="flex flex-col items-center justify-center p-4 primary/5 hover:bg-emerald-100/50 border border-emerald-100 rounded-2xl transition gap-2 text-emerald-800 font-bold text-xs">
                <HardDrive className="w-5 h-5 text-primary" />
                Local Storage
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-primary hover:bg-[#00472B] text-white rounded-2xl transition gap-2 font-bold text-xs shadow-sm">
                <RotateCcw className="w-5 h-5" />
                Restore Data
              </button>
            </div>
          </motion.div>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="space-y-10">
          {/* 1. Security Card */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.21, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white p-5 rounded-2xl border border-base-100 shadow-sm space-y-4"
          >
            <div className="flex items-center gap-2 ">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-base">Security</h3>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs font-bold ">
                <span>Auto Logout Timer</span>
                <span className=" font-semibold cursor-pointer flex items-center gap-1">
                  {settings.security.autoLogoutTimer}{" "}
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold  pt-1">
                <span>Privacy Settings</span>
                <ChevronRight className="w-3.5 h-3.5  cursor-pointer" />
              </div>
            </div>
          </motion.div>

          {/* 2. Data Management Card */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.24, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white p-5 rounded-2xl border border-base-100 shadow-lg space-y-4"
          >
            <span className="text-[10px] font-bold  uppercase tracking-wider">
              Data Management
            </span>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-1.5 py-2.5 bg-emerald-50/60 hover:bg-emerald-100/60 border border-emerald-100 text-emerald-800 font-bold rounded-xl text-xs transition">
                <FileText className="w-3.5 h-3.5" /> PDF
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2.5 bg-emerald-50/60 hover:bg-emerald-100/60 border border-emerald-100 text-emerald-800 font-bold rounded-xl text-xs transition">
                <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
              </button>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-[10px] font-semibold text-rose-500 italic leading-tight">
                Warning: This action cannot be undone and will erase all your
                financial records permanently.
              </p>
              <button className="w-full py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-600 font-bold rounded-xl text-xs transition">
                Delete All Data
              </button>
            </div>
          </motion.div>

          {/* 3. About Card */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.18, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white p-5 rounded-2xl border border-base-100 shadow-lg space-y-3"
          >
            <span className="text-[10px] font-bold  uppercase tracking-wider">
              About
            </span>

            <div className="space-y-3 pt-1 text-xs font-bold ">
              <div className="flex items-center justify-between">
                <span>Web Version</span>
                <span className="">{settings.about.version}</span>
              </div>

              <div className="flex items-center justify-between cursor-pointer hover:text-primary">
                <span>Privacy Policy</span>
                <ExternalLink className="w-3.5 h-3.5 " />
              </div>

              <div className="flex items-center justify-between cursor-pointer hover:text-primary">
                <span>Terms & Conditions</span>
                <ExternalLink className="w-3.5 h-3.5 " />
              </div>

              <div className="flex items-center justify-between cursor-pointer hover:text-primary">
                <span>Contact Support</span>
                <Mail className="w-3.5 h-3.5 " />
              </div>

              <div className="flex items-center justify-between cursor-pointer hover:text-primary">
                <span>Rate this App</span>
                <Star className="w-3.5 h-3.5 " />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
