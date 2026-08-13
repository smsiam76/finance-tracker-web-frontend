import Container from "../../../component/Shared/Container/Container";
import { motion } from "framer-motion";

const FAQPage = () => {
  return (
    <div className="py-16">
      <Container>
        {/* section title and subtitle */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
          viewport={{ once: true, amount: 0.1 }}
          className="text-center md:px-20 lg:px-40 mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="">Everything you need to know about getting started.</p>
        </motion.div>
        <div className="lg:max-w-1/2 mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="collapse collapse-arrow bg-base-100 border border-base-300"
          >
            <input type="radio" name="my-accordion-3" defaultChecked />
            <div className="collapse-title font-semibold">
              Is my bank data safe with Finance Tracker?
            </div>
            <div className="collapse-content text-sm">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Placeat,
              minima? Nisi autem sunt qui.
            </div>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.20, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="collapse collapse-arrow bg-base-100 border border-base-300"
          >
            <input type="radio" name="my-accordion-3" />
            <div className="collapse-title font-semibold">
              Can I track both income and expenses?
            </div>
            <div className="collapse-content text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam quas
              rem quasi.
            </div>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.1 }}
            className="collapse collapse-arrow bg-base-100 border border-base-300"
          >
            <input type="radio" name="my-accordion-3" />
            <div className="collapse-title font-semibold">
              Can I use Fiance Tracker for free?
            </div>
            <div className="collapse-content text-sm">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab dolor
              distinctio maiores ad. Omnis, commodi.
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
};

export default FAQPage;
