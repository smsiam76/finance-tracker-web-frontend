import { Link, NavLink, Outlet, useLocation } from "react-router";
import LogoDashboard from "../component/Shared/LogoDashboard/LogoDashboard";
import { MdOutlineDashboard } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import { HiBookOpen } from "react-icons/hi";
import { FaArrowLeft } from "react-icons/fa6";
import {
  ArrowLeftRight,
  BanknoteArrowDown,
  BanknoteArrowUp,
  ChartNoAxesCombined,
  RotateCcwClock,
  Settings,
  Tags,
  Vault,
  Wallet,
} from "lucide-react";

const DashboardLayout = () => {
  const location = useLocation();

  const user = {
    _id: "user1",
    name: "Tanvir Ahmed",
    email: "tanvir@gmail.com",
    photoURL:
      "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D", // Sample avatar
    role: "Member", // Or status/authProvider from schema
  };

  // Determine header title based on current URL path
  const getHeaderTitle = () => {
    const { pathname } = location;

    if (pathname.startsWith("/dashboard/my-books/book-details/")) {
    return location.state?.bookTitle 
      ? `Book Details: ${location.state.bookTitle}` 
      : "Book Details";
  }
    switch (location.pathname) {
      case "/dashboard/my-books":
        return "My Books";
      case "/settings":
        return "Settings";
      case "/dashboard/cash-in":
        return "Cash In";
      case "/dashboard/cash-out":
        return "Cash Out";
      case "/dashboard/transfer-money":
        return "Transfer Money";
      case "/dashboard/reports":
        return "Reports and Analytics";
      case "/dashboard/categories":
        return "Categories";
      case "/dashboard/transaction-history":
        return "Transaction History";
      case "/dashboard/lent-and-borrowed":
        return "Lent And Borrowed";
      case "/dashboard/budget-management":
        return "Budget";
      case "/dashboard/settings":
        return "Settings";
      // case `/dashboard/my-books/book-details/`:
      //   return "Books Details";
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
        to="/dashboard/cash-in"
        className="flex gap-2.5 items-center py-3 px-4 rounded-md font-medium hover:bg-primary hover:text-base-100 transition-all duration-300 ease-linear "
      >
        <BanknoteArrowDown className="font-medium text-xl" />
        <span>Cash In</span>
      </NavLink>
      <NavLink
        to="/dashboard/cash-out"
        className="flex gap-2.5 items-center py-3 px-4 rounded-md font-medium hover:bg-primary hover:text-base-100 transition-all duration-300 ease-linear "
      >
        <BanknoteArrowUp className="font-medium text-xl" />
        <span>Cash Out</span>
      </NavLink>
      <NavLink
        to="/dashboard/transfer-money"
        className="flex gap-2.5 items-center py-3 px-4 rounded-md font-medium hover:bg-primary hover:text-base-100 transition-all duration-300 ease-linear "
      >
        <ArrowLeftRight className="font-medium text-xl" />
        <span>Transfer Money</span>
      </NavLink>
      <NavLink
        to="/dashboard/budget-management"
        className="flex gap-2.5 items-center py-3 px-4 rounded-md font-medium hover:bg-primary hover:text-base-100 transition-all duration-300 ease-linear "
      >
        <Wallet className="font-medium text-xl" />
        <span>Budget Management</span>
      </NavLink>
      <NavLink
        to="/dashboard/reports"
        className="flex gap-2.5 items-center py-3 px-4 rounded-md font-medium hover:bg-primary hover:text-base-100 transition-all duration-300 ease-linear "
      >
        <ChartNoAxesCombined className="font-medium text-xl" />
        <span>Reports</span>
      </NavLink>
      <NavLink
        to="/dashboard/categories"
        className="flex gap-2.5 items-center py-3 px-4 rounded-md font-medium hover:bg-primary hover:text-base-100 transition-all duration-300 ease-linear "
      >
        <Tags className="font-medium text-xl" />
        <span>Categories</span>
      </NavLink>
      <NavLink
        to="/dashboard/transaction-history"
        className="flex gap-2.5 items-center py-3 px-4 rounded-md font-medium hover:bg-primary hover:text-base-100 transition-all duration-300 ease-linear "
      >
        <RotateCcwClock className="font-medium text-xl" />

        <span>Transaction History</span>
      </NavLink>
      <NavLink
        to="/dashboard/lent-and-borrowed"
        className="flex gap-2.5 items-center py-3 px-4 rounded-md font-medium hover:bg-primary hover:text-base-100 transition-all duration-300 ease-linear "
      >
        <Vault className="font-medium text-xl" />
        <span>Lent & Borrowed</span>
      </NavLink>
      <NavLink
        to="/dashboard/settings"
        className="flex gap-2.5 items-center py-3 px-4 rounded-md font-medium hover:bg-primary hover:text-base-100 transition-all duration-300 ease-linear "
      >
        <Settings className="font-medium text-xl" />
        <span>Settings</span>
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
