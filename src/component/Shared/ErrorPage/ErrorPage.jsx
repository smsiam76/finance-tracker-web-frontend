import { useLocation, useNavigate, Link } from "react-router";
import { ArrowLeft, Home, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const ErrorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
      viewport={{ once: true, amount: 0.1 }}
      className="min-h-screen bg-[#f7fbf9] flex items-center justify-center p-4 font-sans text-gray-800"
    >
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center space-y-6 relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-rose-50 rounded-full blur-2xl pointer-events-none" />

        {/* 404 Badge & Icon */}
        <div className="relative inline-flex items-center justify-center">
          <span className="text-8xl font-black text-primary select-none">
            404
          </span>
          {/* <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-4 bg-emerald-50 text-[#006A4E] rounded-2xl shadow-sm border border-emerald-100/50">
              <AlertCircle size={40} />
            </div>
          </div> */}
        </div>

        {/* Header Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-gray-500">
            Oops! The page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Current Location / URL Box */}
        <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-3.5 flex items-center justify-center gap-2 text-xs font-mono text-gray-600">
          <MapPin size={16} className="text-[#006A4E] shrink-0" />
          <span className="text-gray-400">Path:</span>
          <span className="font-semibold text-gray-800 truncate max-w-[220px]">
            {location.pathname}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>

          <Link
            to="/"
            className="w-full py-2.5 px-4 bg-[#006A4E] hover:bg-[#00523d] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-100 transition-colors"
          >
            <Home size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ErrorPage;
