import { BiTrendingUp } from "react-icons/bi";
import { Link } from "react-router";

const LogoDashboard = () => {
  return (
    <Link to="/dashboard" className="flex items-center gap-2.5">
      <div className="w-10 h-10 bg-primary text-white flex items-center justify-center rounded-md shadow-md">
        <BiTrendingUp className="text-2xl font-bold" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-primary">FinanceTracker</h2>
        <p className="uppercase text-sm">Money Management</p>
      </div>
    </Link>
  );
};

export default LogoDashboard;
