import React from "react";
import { motion } from "framer-motion";

const MissionStatement = () => {
  return (
    <section className="py-16 bg-transparent">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl font-bold text-center mb-8 text-green-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Our Mission
        </motion.h2>
        <motion.p 
          className="text-xl text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          To manage public land on behalf of the national and county governments, 
          initiate investigations into present or historical land injustices, and 
          recommend appropriate redress, and monitor land use planning throughout the country.
        </motion.p>
      </div>
    </section>
  );
};

export default MissionStatement;