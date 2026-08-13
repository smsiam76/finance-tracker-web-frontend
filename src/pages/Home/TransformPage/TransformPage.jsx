import { Link } from "react-router";
import Container from "../../../component/Shared/Container/Container";
import { motion } from "framer-motion";

const TransformPage = () => {
  return (
    <div className="py-16 md:py-20 lg:py-24">
      <Container>
        <div className="text-center space-y-6 bg-primary text-white rounded-xl py-12 shadow-xl">
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="text-2xl md:text-4xl lg:text-5xl font-bold"
          >
            Ready to transform your <br />
            financial future?
          </motion.h2>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="px-5 md:px-0"
          >
            Join thousands of high-net-worth individuals in Bangladesh who trust
            Finance Tracker.
          </motion.p>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
          >
            <Link
              to={"/sign-up"}
              className="bg-white/70 text-primary border-2 border-primary px-4 py-2 font-semibold rounded-md hover:border-white hover:bg-primary hover:text-white transition-all duration-300 ease-in-out cursor-pointer"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </Container>
    </div>
  );
};

export default TransformPage;
