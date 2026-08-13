import { FaArrowsRotate, FaRegBell } from "react-icons/fa6";
import Container from "../../../component/Shared/Container/Container";
// import picture1 from "../../../assets/images/picture-1.png"
// import picture2 from "../../../assets/images/picture-2.png"
import { LuWallet } from "react-icons/lu";
import { GoGraph } from "react-icons/go";
import { motion } from "framer-motion";

const ManageFinance = () => {
  return (
    <div className="bg-white py-16">
      <Container>
        <div>
          {/* section title and subtitle */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="text-center md:px-28 lg:px-40 mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              Everything You Need to Manage Your Finances
            </h2>
            <p className="">
              Everything you need to manage, track, and grow your assets within
              the localized landscape of Bangladesh.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10  md:px-10 lg:px-16">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
              viewport={{ once: true, amount: 0.1 }}
              className="space-y-3 rounded-md border border-primary/10 shadow-2xl p-5 md:p-8 lg:p-10 "
            >
              <div className="p-4 bg-primary/20 w-fit rounded-md">
                <FaArrowsRotate className="text-primary" size={24} />
              </div>
              <h3 className="text-2xl font-bold">Real-time MFS Integration</h3>
              <p>
                Sync your bKash and Nagad accounts automatically.Track every
                transaction with precision and categorization, eliminating
                manual entry errors.
              </p>
            </motion.div>
            {/* <div className="hidden md:block">
                            <img src={picture1} alt="" />
                        </div> */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.18, ease: "easeInOut" }}
              viewport={{ once: true, amount: 0.1 }}
              className="space-y-3 bg-primary text-white hidden md:block rounded-md border border-primary/10 shadow-2xl p-5 md:p-8 lg:p-10 "
            >
              <div className="p-4 bg-white w-fit rounded-md">
                <LuWallet className="text-primary" size={24} />
              </div>
              <h3 className="text-2xl font-bold">Smart Budgeting</h3>
              <p>
                Set intelligent limits and receive proactive alerts. Our
                predicts your monthly spend based on historical data.
              </p>
              <span className="divider"></span>
              <p>88% Accuracy</p>
            </motion.div>
            {/* row 2 */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeInOut" }}
              viewport={{ once: true, amount: 0.1 }}
              className="space-y-3 rounded-md border border-primary/10 shadow-2xl p-5 md:p-8 lg:p-10 "
            >
              <div className="p-4 bg-primary/20 w-fit rounded-md">
                <FaRegBell className="text-primary" size={24} />
              </div>
              <h3 className="text-2xl font-bold">Intelligent Reminders</h3>
              <p>
                Never miss a DPS installment or credit card bill again.
                FinanceTracker sends contextual reminders via SMS and Push.
              </p>
            </motion.div>
            {/* <div className="hidden md:block">
                            <img src={picture2} alt="" />
                        </div> */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.23, ease: "easeInOut" }}
              viewport={{ once: true, amount: 0.1 }}
              className="space-y-3 rounded-md border border-primary/10 shadow-2xl p-5 md:p-8 lg:p-10 "
            >
              <div className="p-4 bg-primary/20 w-fit rounded-md">
                <GoGraph className="text-red-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold">Insightful Reports</h3>
              <p>
                Monthly wealth health scores and deep-dive alytics. See where
                your money goes with beautiful, easy-to-read visualizations.
              </p>
            </motion.div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ManageFinance;
