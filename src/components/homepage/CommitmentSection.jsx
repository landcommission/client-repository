// CommitmentSection.js
import React from "react";
import { Link } from "react-router-dom";

const CommitmentSection = () => (
  <div className="bg-green-700 text-white p-12 rounded-xl shadow-inner">
    <h2 className="text-3xl font-bold mb-6">Our Commitment</h2>
    <p className="text-xl mb-8 max-w-3xl">
      We are dedicated to ensuring equitable access to land, promoting
      sustainable land use, and protecting the rights of all Kenyans in matters
      of land ownership and management.
    </p>
    <Link
      to="/about"
      className="inline-block bg-white text-green-700 py-3 px-8 rounded-lg transition duration-300 hover:bg-green-100 font-semibold"
    >
      Learn More About NLC
    </Link>
  </div>
);

export default CommitmentSection;