import { BiTrendingUp } from "react-icons/bi";

import { Link } from "react-router";


const Logo = () => {
    return (
        <Link to="/" className="flex items-center gap-4">
            {/* <SiWebmoney size={32}/> */}
            <BiTrendingUp  className="text-primary text-3xl"/>
            <h2 className="text-xl md:text-3xl font-bold text-primary -ms-4">FinanceTracker</h2>
        </Link>
    );
};

export default Logo;