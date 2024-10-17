import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import FileCard from "./FileCard";

const RecentFiles = ({ recentFiles, showMore, setShowMore }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-4 text-green-800">
      Recently Added Documents
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {recentFiles.slice(0, showMore ? recentFiles.length : 3).map((file) => (
        <FileCard key={file._id} file={file} />
      ))}
    </div>
    {recentFiles.length > 3 && (
      <motion.button
        className="mt-4 flex items-center text-amber-600 hover:text-green-700 transition-colors duration-300 text-sm"
        onClick={() => setShowMore(!showMore)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {showMore ? "Show Less" : "Show More"}
        <ChevronDown
          className={`ml-1 w-4 h-4 transform transition-transform duration-300 ${
            showMore ? "rotate-180" : ""
          }`}
        />
      </motion.button>
    )}
  </div>
);

export default RecentFiles;