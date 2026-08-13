import { motion } from "framer-motion";
import { Link, NavLink } from "react-router";
import Logo from "../../Logo/Logo";
import Container from "../Container/Container";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Sticky Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 70) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = (
    <>
      <NavLink
        to="/"
        className="mr-3 hover:text-primary transition-all duration-300 ease-in-out font-medium text-lg"
      >
        Home
      </NavLink>
      <NavLink
        to="/features"
        className="mr-3 hover:text-primary transition-all duration-300 ease-in-out font-medium text-lg"
      >
        Features
      </NavLink>
      <NavLink
        to="/about"
        className="hover:text-primary transition-all duration-300 ease-in-out font-medium text-lg"
      >
        About
      </NavLink>
    </>
  );

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="sticky top-0 z-50"
    >
      <motion.div
        animate={{
          paddingTop: isScrolled ? "8px" : "16px",
          paddingBottom: isScrolled ? "8px" : "16px",
          backgroundColor: isScrolled
            ? "rgba(255, 255, 255, 0.85)"
            : "rgba(255, 255, 255, 1)",
          boxShadow: isScrolled
            ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          backdropFilter: isScrolled ? "blur(12px)" : "blur(0px)",
        }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
      >
        <Container>
          <div className="navbar min-h-0 p-0">
            <div className="navbar-start">
              <div className="dropdown">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost lg:hidden"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h8m-8 6h16"
                    />
                  </svg>
                </div>
                {/* Mobile links */}
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                >
                  {navLinks}
                </ul>
              </div>

              {/* Logo */}
              <Logo />
            </div>

            <div className="navbar-center hidden lg:flex">{navLinks}</div>

            <div className="navbar-end gap-3">
              <Link
                to="/sign-in"
                className="px-4 py-2 font-medium rounded-md hover:bg-primary hover:text-white transition-all duration-300 ease-in-out cursor-pointer"
              >
                Login
              </Link>
              <Link
                to="/sign-up"
                className="bg-primary px-4 py-2 font-medium text-white rounded-md hover:bg-primary/80 transition-all duration-300 ease-in-out cursor-pointer"
              >
                Get Started
              </Link>
            </div>
          </div>
        </Container>
      </motion.div>
    </motion.header>
  );
};

export default Navbar;