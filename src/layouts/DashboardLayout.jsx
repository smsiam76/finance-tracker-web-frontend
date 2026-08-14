import { Link, NavLink, Outlet, useLocation } from "react-router";
import LogoDashboard from "../component/Shared/LogoDashboard/LogoDashboard";
import { MdOutlineDashboard } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import { HiBookOpen } from "react-icons/hi";
import { FaArrowLeft } from "react-icons/fa6";

const DashboardLayout = () => {
  const location = useLocation();

  const user = {
    _id: "user1",
    name: "Tanvir Ahmed",
    email: "tanvir@gmail.com",
    photoURL:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200", // Sample avatar
    role: "Member", // Or status/authProvider from schema
  };

  // Determine header title based on current URL path
  const getHeaderTitle = () => {
    switch (location.pathname) {
      case "/dashboard/my-books":
        return "My Books";
      case "/settings":
        return "Settings";
      // case "/dashboard/my-books/ ":
      //   return "My-books";
      case "/dashboard":
      default:
        return `Welcome Back, ${user?.name}`;
    }
  };

  const links = (
    <>
      <NavLink
        to="/dashboard"
        end
        className="flex gap-2.5 items-center py-3 px-4 rounded-md font-medium hover:bg-primary hover:text-base-100 transition-all duration-300 ease-linear "
      >
        <MdOutlineDashboard className="font-medium text-xl" />
        <span>Dashboard</span>
      </NavLink>
      <NavLink
        to="/dashboard/my-books"
        className="flex gap-2.5 items-center py-3 px-4 rounded-md font-medium hover:bg-primary hover:text-base-100 transition-all duration-300 ease-linear "
      >
        <HiBookOpen className="font-medium text-xl" />
        <span>Books</span>
      </NavLink>
      <NavLink
        to="/settings"
        className="flex gap-2.5 items-center py-3 px-4 rounded-md font-medium hover:bg-primary hover:text-base-100 transition-all duration-300 ease-linear "
      >
        <CiSettings className="font-medium text-xl" /> <span>Settings</span>
      </NavLink>
    </>
  );

  return (
    <div className="flex flex-col md:flex-row bg-base-100 md:min-h-screen">
      {/* left asidebar */}
      <motion.aside
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeInOut" }}
        className="md:w-1/4 py-6 md:py-10 px-4 md:px-8 shadow-xl lg:h-screen lg:sticky top-0 overflow-y-auto"
      >
        <LogoDashboard />
        <span className="divider"></span>

        {/* links */}
        <ul className="flex flex-col gap-4 dash-nav">{links}</ul>
        <span className="divider"></span>
        <div>
          <Link
            to="/"
            className="flex gap-2.5 items-center py-3 px-4 rounded-md font-medium hover:bg-primary hover:text-base-100 transition-all duration-300 ease-linear "
          >
            <FaArrowLeft className="font-medium" /> <span>Go Home</span>
          </Link>
        </div>
      </motion.aside>

      {/* right content */}
      <div className="md:w-3/4 px-4 md:px-8 py-6 md:py-10">
        <motion.header
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeInOut" }}
          className="flex flex-wrap gap-4 md:gap-0 justify-between"
        >
          {/* Dynamic Header Title */}
          <div>
            <h3 className="font-bold text-xl">{getHeaderTitle()}</h3>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            {/* 1. Search Bar Input */}
            <div className="relative flex-1 md:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ">
                <FiSearch className="md:w-5 h-5 stroke-[2.2]" />
              </div>
              <input
                type="text"
                placeholder="Search transactions..."
                // onChange={(e) => onSearch && onSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-[#e8f0eb] border border-[#cbdad0] rounded-full text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all"
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
