import { useState } from "react";
import { useForm } from "react-hook-form";
import SocialLogin from "../../../../component/Shared/SocialLogin/SocialLogin";
import { easeInOut, motion } from "framer-motion";

import {
  FiEye,
  FiEyeOff,
  FiArrowRight,
  //   FiLeaf
} from "react-icons/fi";
import { Link } from "react-router";
import Logo from "../../../../component/Logo/Logo";
import DemoLogin from "../../../../component/Shared/DemoLogin/DemoLogin";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => console.log(data);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Brand Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: .5, ease: easeInOut }}
        className="text-center mb-6"
      >
        <Logo />
        <p className="text-sm font-medium mt-0.5">Manage Your Money</p>
      </motion.div>

      {/* Main Form Card */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: .5, ease: easeInOut }}
        className="bg-white w-full max-w-md rounded-3xl p-8 shadow-xl border  border-primary/10"
      >
        {/* ==================== SIGN UP FORM ==================== */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800 text-center">
              Start your journey with FinanceTracker
            </h2>
          </div>
          <span className="divider"></span>
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Full Name"
              {...register("fullName", { required: "Full name is required" })}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                errors.fullName
                  ? "border-red-400 focus:ring-1 focus:ring-red-400"
                  : "border-gray-200 focus:border-[#10b981]"
              }`}
            />
            {errors.fullName && (
              <span className="text-xs text-red-500 mt-1 block">
                {errors.fullName.message}
              </span>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                errors.email
                  ? "border-red-400 focus:ring-1 focus:ring-red-400"
                  : "border-gray-200 focus:border-[#10b981]"
              }`}
            />
            {errors.email && (
              <span className="text-xs text-red-500 mt-1 block">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Mobile Number */}
          {/* <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Mobile Number
            </label>
            <div className="flex gap-2">
              <span className="px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 flex items-center">
                +880
              </span>
              <input
                type="tel"
                placeholder="17XX-XXXXXX"
                {...register("mobile", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit number",
                  },
                })}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                  errors.mobile
                    ? "border-red-400 focus:ring-1 focus:ring-red-400"
                    : "border-gray-200 focus:border-[#10b981]"
                }`}
              />
            </div>
            {errors.mobile && (
              <span className="text-xs text-red-500 mt-1 block">
                {errors.mobile.message}
              </span>
            )}
          </div> */}

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition pr-10 ${
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

          {/* Terms and Conditions */}
          <div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                {...register("terms", { required: "You must accept terms" })}
                className="w-4 h-4 rounded border-gray-300 text-[#10b981] focus:ring-[#10b981]"
              />
              <label
                htmlFor="terms"
                className="text-xs font-medium text-gray-600 cursor-pointer"
              >
                I agree to the{" "}
                <a
                  href="#terms"
                  className="text-[#10b981] hover:underline font-semibold"
                >
                  Terms & Conditions
                </a>
              </label>
            </div>
            {errors.terms && (
              <span className="text-xs text-red-500 mt-1 block">
                {errors.terms.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary cursor-pointer border text-white py-3 rounded-xl font-semibold text-sm hover:bg-white hover:border-primary hover:text-primary transition shadow-md shadow-emerald-100 flex items-center justify-center gap-2 mt-2"
          >
            Create Account <FiArrowRight />
          </button>

          {/* Divider */}
          <div className="relative my-5 text-center">
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
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="text-[#10b981] font-semibold hover:underline bg-transparent border-0 cursor-pointer"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
