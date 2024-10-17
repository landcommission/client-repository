import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Users, FolderOpen, TrendingUp, Calendar, Info } from "lucide-react";

const RepositoryStats = ({ documents }) => {
  const [hoveredStat, setHoveredStat] = useState(null);


  const parseCategories = (categoriesString) => {
    try {
      const parsed = JSON.parse(categoriesString);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      console.error("Error parsing categories:", e);
      return [];
    }
  };

  const stats = [
    {
      icon: FileText,
      value: documents.length,
      label: "Docs",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Download,
      value: documents.reduce((sum, doc) => sum + (doc.downloadCount || 0), 0),
      label: "Downloads",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Users,
      value: new Set(documents.map((doc) => doc.author)).size,
      label: "Contributors",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      icon: FolderOpen,
      value: new Set(documents.flatMap((doc) => parseCategories(doc.categories[0]))).size,
      label: "Categories",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const getAdditionalInfo = (label) => {
    switch (label) {
      case "Docs":
        const latestDoc = documents.reduce((latest, doc) =>
          new Date(doc.createdAt) > new Date(latest.createdAt) ? doc : latest
        );
        return `Latest: ${new Date(latestDoc.createdAt).toLocaleDateString()}`;
      case "Downloads":
        const avgDownloads = stats[1].value / documents.length;
        return `Avg: ${avgDownloads.toFixed(2)} per document`;
      case "Contributors":
        const topContributor = Object.entries(
          documents.reduce((acc, doc) => {
            acc[doc.author] = (acc[doc.author] || 0) + 1;
            return acc;
          }, {})
        ).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
        return `Top: ${topContributor}`;
      case "Categories":
        const categoryCount = documents.flatMap(doc => parseCategories(doc.categories[0]))
          .reduce((acc, cat) => {
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
          }, {});
        const topCategory = Object.entries(categoryCount)
          .reduce((a, b) => (a[1] > b[1] ? a : b))[0];
        return `Top: ${topCategory}`;
      default:
        return "";
    }
  };

  return (
    <motion.section
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <TrendingUp className="mr-2 text-red-500" size={20} /> Repository Stats
        </h2>
        <motion.div
          className="text-xs text-gray-500 flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Calendar className="mr-1" size={12} />
          Updated: {new Date().toLocaleDateString()}
        </motion.div>
      </div>
      <div className="flex justify-between p-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="relative flex flex-col items-center"
            onHoverStart={() => setHoveredStat(stat.label)}
            onHoverEnd={() => setHoveredStat(null)}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center mb-2`}
              whileHover={{ y: -5 }}
            >
              <stat.icon size={20} className={stat.color} />
            </motion.div>
            <motion.p
              className={`text-lg font-bold ${stat.color}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {stat.value.toLocaleString()}
            </motion.p>
            <p className="text-xs text-gray-500">{stat.label}</p>
            <AnimatePresence>
              {hoveredStat === stat.label && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute -bottom-10 bg-black text-white p-2 rounded text-xxs whitespace-nowrap z-10"
                >
                  {getAdditionalInfo(stat.label)}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 flex items-center">
        <Info size={12} className="mr-1" />
        Hover over stats for more details
      </div>
    </motion.section>
  );
};

export default RepositoryStats;