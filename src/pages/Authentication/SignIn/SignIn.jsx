import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import Logo from "../../../component/Logo/Logo";
import { motion } from "framer-motion";

import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import DemoLogin from "../../../component/Shared/DemoLogin/DemoLogin";
import SocialLogin from "../../../component/Shared/SocialLogin/SocialLogin";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";

const SignIn = () => {
  
  const [showPassword, setShowPassword] = useState(false);

  const { signUser, loading, setLoading } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // Get destination path or fallback to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);

    const { email, password } = data;

    try {
      await signUser(email, password);
      toast.success("Successfully logged in!");
      navigate(from, { replace: true });
    } catch (error) {
      setLoading(false);
      console.log(error.message);
      toast.error(error.message || "Invalid email or password!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* dynamic page title */}
      <Helmet>
        <title>Sign In | FinanceTracker</title>
      </Helmet>
      
      {/* Brand Header */}
      <motion.div
        initial={{ y: -100, opacity: 0.1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="text-center mb-6"
      >
        <Logo />
        <p className="text-sm font-medium mt-0.5">Manage Your Money</p>
      </motion.div>

      {/* Main Form Card */}
      <motion.div
        initial={{ y: 100, opacity: 0.1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="bg-white w-full max-w-md rounded-3xl p-8 shadow-xl border border-primary/10"
      >
        {/* ==================== LOGIN FORM ==================== */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
              <input
                type="email"
                placeholder="name@company.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full pl-10 pr-4 py-2.5 bg-[#f4f9f6] rounded-xl border text-sm outline-none transition ${
                  errors.email
                    ? "border-red-400 focus:ring-1 focus:ring-red-400"
                    : "border-gray-200 focus:border-[#10b981]"
                }`}
              />
            </div>
            {errors.email && (
              <span className="text-xs text-red-500 mt-1 block">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-600">
                Password
              </label>
              <a
                href="#forgot"
                className="text-xs font-semibold text-[#10b981] hover:underline"
              >
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters required",
                  },
                })}
                className={`w-full pl-10 pr-10 py-2.5 bg-[#f4f9f6] rounded-xl border text-sm outline-none transition ${
                  errors.password
                    ? "border-red-400 focus:ring-1 focus:ring-red-400"
                    : "border-gray-200 focus:border-[#10b981]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-red-500 mt-1 block">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="remember"
              {...register("remember")}
              className="w-4 h-4 rounded border-gray-300 text-[#10b981] focus:ring-[#10b981]"
            />
            <label
              htmlFor="remember"
              className="text-xs font-medium text-gray-600 cursor-pointer"
            >
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary cursor-pointer border text-white py-3 rounded-xl font-semibold text-sm hover:bg-white hover:border-primary hover:text-primary transition shadow-md shadow-emerald-100 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="animate-pulse">Logging in...</span>
            ) : (
              "Login"
            )}
          </button>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <span className="relative bg-white px-3 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
              OR
            </span>
          </div>

          {/* Google Sign In */}
          <SocialLogin />
          <DemoLogin />
        </form>

        {/* Toggle Switch */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            Don't have an account?{" "}
            <Link
              to="/sign-up"
              className="text-[#10b981] font-semibold hover:underline bg-transparent border-0 cursor-pointer"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
