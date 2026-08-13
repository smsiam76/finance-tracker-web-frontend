import { Link } from "react-router";
import Logo from "../../Logo/Logo";
import { TiWorld } from "react-icons/ti";
import { MdMessage } from "react-icons/md";
import { CgMail } from "react-icons/cg";
import Container from "../Container/Container";
import { motion } from "framer-motion";
const Footer = () => {
  return (
    <motion.footer
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.15, ease: "easeInOut" }}
      viewport={{ once: true, amount: 0.1 }}
      className="bg-base-200 text-base-content p-10"
    >
      <Container>
        <div className="footer sm:footer-horizontal  ">
          <aside>
            <Logo />
            <p>
              Finance Tracker management for the modern era. Secure, localized,
              and intelligent.
            </p>
          </aside>
          <nav>
            <h6 className="footer-title">Quick Links</h6>
            <a className="link link-hover">Home</a>
            <a className="link link-hover">Feature</a>
            <a className="link link-hover">FAQ</a>
            <a className="link link-hover">Contact</a>
          </nav>
          <nav>
            <h6 className="footer-title">Support</h6>
            <a className="link link-hover">Help Center</a>
            <a className="link link-hover">Privary Policy</a>
            <a className="link link-hover">Terms & Conditions</a>
          </nav>
          <nav>
            <h6 className="footer-title">Contact</h6>
            <a className="link link-hover">support@financetracker.com</a>
            <a className="link link-hover">+880 1234-567890</a>
            <a className="link link-hover">Dhaka Bangladesh</a>
          </nav>
        </div>
        <span className="divider"></span>
        <div className="flex justify-between">
          <div>
            <p>
              &copy; 2026{" "}
              <Link
                className="hover:text-primary transition-all duration-300 ease-in-out"
                to="/"
              >
                FinanceTracker
              </Link>
              . All rights reserved.
            </p>
          </div>
          <div className="text-2xl flex gap-2">
            <button>
              <TiWorld />
            </button>
            <button>
              <MdMessage />
            </button>
            <button>
              <CgMail />
            </button>
          </div>
        </div>
      </Container>
    </motion.footer>
  );
};

export default Footer;
