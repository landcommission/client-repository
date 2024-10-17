import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Scale,
  Archive,
  AlertCircle,
  Book,
  CheckSquare,
  Map,
  Building,
  Scroll,
  Leaf,
  MessageCircle,
  Package,
  Folder,
  Video,
} from "lucide-react";

const getCategoryIcon = (category) => {
  switch (category.toLowerCase()) {
    case "publications":
    case "journals and papers":
    case "annual reports":
      return <Book size={20} />;
    case "litigations":
    case "dispute resolution cases":
      return <Scale size={20} />;
    case "historical land injustices":
    case "land tenure documents":
      return <Archive size={20} />;
    case "review of grants":
      return <CheckSquare size={20} />;
    case "nlc advisories":
      return <AlertCircle size={20} />;
    case "policies and laws":
    case "strategic plans":
      return <Scroll size={20} />;
    case "land compensation reports":
    case "valuation reports":
      return <Map size={20} />;
    case "environmental impact assessments (eias)":
      return <Leaf size={20} />;
    case "land adjudication records":
      return <Building size={20} />;
    case "community land agreements":
    case "conservation and natural resource management":
      return <Package size={20} />;
    case "public notices and statements":
      return <MessageCircle size={20} />;
    case "videos":
      return <Video size={20} />;
    default:
      return <FileText size={20} />;
  }
};

const Sidebar = ({ categories, selectedCategory, onCategorySelect }) => {
  const parseCategory = (category) => {
    if (!category || category === "null" || category === "undefined")
      return "Uncategorized";
    try {
      const parsed = JSON.parse(category);
      return parsed.length > 0 ? parsed[0] : "Uncategorized";
    } catch {
      return category === "[]" ? "Uncategorized" : category;
    }
  };

  return (
    <motion.aside
      initial={{ opacity: 0, width: 0 }}
      animate={{ opacity: 1, width: 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white h-full overflow-y-auto flex-shrink-0 border-r border-gray-200 shadow-lg"
    >
      <div className="px-6 py-4 flex items-center border-b border-gray-200">
        <Folder className="text-amber-600 mr-4" size={24} />
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
      </div>
      <nav className="py-4">
        {categories.map((category, index) => {
          const parsedCategory = parseCategory(category);
          const isSelected = selectedCategory === category;
          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index, duration: 0.2 }}
              onClick={() => onCategorySelect(category)}
              className={`flex items-center w-full px-6 py-3 text-sm transition-all duration-200 ${
                isSelected
                  ? "bg-amber-100 text-amber-800 font-medium"
                  : "text-gray-700 hover:bg-amber-50"
              }`}
              whileHover={{
                backgroundColor: isSelected
                  ? "rgba(251, 191, 36, 0.2)"
                  : "rgba(251, 191, 36, 0.1)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span
                className={`mr-4 ${
                  isSelected ? "text-amber-600" : "text-gray-500"
                }`}
              >
                {getCategoryIcon(parsedCategory)}
              </span>
              <span className="capitalize truncate">{parsedCategory}</span>
              {isSelected && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto w-2 h-2 rounded-full bg-amber-500"
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </motion.aside>
  );
};

export default React.memo(Sidebar);
