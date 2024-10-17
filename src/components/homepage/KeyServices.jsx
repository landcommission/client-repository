// KeyServices.js
import React from "react";
import { FaFileAlt, FaMapMarkedAlt, FaBalanceScale } from "react-icons/fa";
import ServiceCard from "./ServiceCard";

const KeyServices = () => (
  <div className="mb-16">
    <h2 className="text-3xl font-bold mb-8 text-green-800">Our Key Services</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ServiceCard
        icon={<FaFileAlt className="text-amber-600" />}
        title="Land Policies"
        description="Access and understand national land policies and regulations."
      />
      <ServiceCard
        icon={<FaMapMarkedAlt className="text-amber-600" />}
        title="Land Use Planning"
        description="Explore resources on sustainable land use and development planning."
      />
      <ServiceCard
        icon={<FaBalanceScale className="text-amber-600" />}
        title="Dispute Resolution"
        description="Find information on land dispute resolution processes and guidelines."
      />
    </div>
  </div>
);

export default KeyServices;