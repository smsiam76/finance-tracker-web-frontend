import { Outlet } from "react-router";
import Navbar from "../component/Shared/Navbar/Navbar";
import Footer from "../component/Shared/Footer/Footer";

const MainLayout = () => {
    return (
        <>
        <Navbar />
            <Outlet />
        <Footer />
        </>
    );
};

export default MainLayout;