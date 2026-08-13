import { Link } from "react-router";
import Button from "../Shared/Button/Button";
import Container from "../Shared/Container/Container";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="py-28">
      <Container>
        <div className="text-center">
          <div>
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeInOut" }}
              viewport={{ once: true, amount: 0.1 }}
              className="font-bold text-3xl md:text-4xl lg:text-5xl mb-8"
            >
              Manage Your Money, <br />
              <span className="text-primary">
                Achieve Your Financial Goals.
              </span>
            </motion.h2>
            <motion.p
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
              viewport={{ once: true, amount: 0.1 }}
              className=" mb-4 md:mb-6"
            >
              The ultimate financial management platform tailored for the modern
              professional.Synchronize your bKash, Nagad, and bank accounts in
              one secure place.
            </motion.p>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeInOut" }}
              viewport={{ once: true, amount: 0.1 }}
            >
              <Link to="/sign-up">
                <Button text={"Start Your Journey"}></Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Hero;
