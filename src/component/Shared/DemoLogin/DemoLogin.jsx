import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router";

const DemoLogin = () => {
  return (
    <Link
      to="/dashboard"
      type="button"
      className="w-full border border-gray-200 rounded-xl py-2.5 flex items-center justify-center gap-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
    >
      <FaArrowRight className="text-primary" />
      Skip to Demo Dashboard
    </Link>
  );
};

export default DemoLogin;
