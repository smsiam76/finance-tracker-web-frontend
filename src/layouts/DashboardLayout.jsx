import { NavLink, Outlet } from "react-router";
import LogoDashboard from "../component/Shared/LogoDashboard/LogoDashboard";
import { MdOutlineDashboard } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";

const DashboardLayout = () => {
  const user = {
    _id: "user1",
    name: "Tanvir Ahmed",
    email: "tanvir@gmail.com",
    photoURL:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200", // Sample avatar
    role: "Member", // Or status/authProvider from schema
  };

  const links = (
    <>
      <NavLink
        to="/dashboard"
        className="flex gap-2.5 items-center py-3 px-4 rounded-md font-medium"
      >
        <MdOutlineDashboard className="font-medium text-xl" />
        <span>Dashboard</span>
      </NavLink>
      <NavLink
        to="/settings"
        className="flex gap-2.5 items-center py-3 px-4 rounded-md font-medium"
      >
        <CiSettings className="font-medium text-xl" /> <span>Settings</span>
      </NavLink>
    </>
  );

  return (
    <div className="flex flex-col md:flex-row bg-base-100 min-h-screen">
      {/* left asidebar */}
      <motion.aside
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeInOut" }}
        className="md:w-1/4 py-10 px-8 shadow-xl h-screen sticky top-0 overflow-y-auto"
      >
        <LogoDashboard />
        <span className="divider"></span>

        {/* links */}
        <ul className="flex flex-col gap-4 dash-nav">{links}</ul>
      </motion.aside>

      {/* right content */}
      <div className="md:w-3/4 px-8 py-10">
        <motion.header
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeInOut" }}
          className="flex justify-between"
        >
          <div>
            <h3 className="font-bold text-xl">Welcome Back, {user?.name}</h3>
          </div>
          <div className="flex gap-6">
            {/* 1. Search Bar Input */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                <FiSearch className="w-5 h-5 stroke-[2.2]" />
              </div>
              <input
                type="text"
                placeholder="Search transactions..."
                // onChange={(e) => onSearch && onSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-[#e8f0eb] border border-[#cbdad0] rounded-full text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all"
              />
            </div>
            {/* 3. User Avatar and Info */}
            <div className="flex items-center gap-3 cursor-pointer select-none">
              {/* Avatar with Emerald Border */}
              <div className="relative p-.5 bg-emerald-500 rounded-full flex items-center justify-center">
                <img
                  src={user?.photoURL}
                  alt={user?.name || "User Avatar"}
                  className="w-10 h-10 rounded-full object-cover border border-white"
                />
              </div>

              {/* User Name & Role */}
              <div className="flex flex-col">
                <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                  {user?.name}
                </h4>
                <span className="text-xs text-gray-500 font-normal">
                  {user?.role || "Member"}
                </span>
              </div>
            </div>
          </div>
        </motion.header>
        <span className="divider"></span>
        {/* content will update here */}
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
