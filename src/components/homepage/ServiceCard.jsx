import React from "react";
import { motion } from "framer-motion";

const ServiceCard = ({ icon, title, description }) => (
  <motion.div
    className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300 flex flex-col items-center text-center border border-green-200"
    whileHover={{ y: -5, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="text-4xl mb-4 text-green-600">{icon}</div>
    <h3 className="text-xl font-semibold mb-3 text-green-800">{title}</h3>
    <p className="text-green-700">{description}</p>
  </motion.div>
);

export default ServiceCard;