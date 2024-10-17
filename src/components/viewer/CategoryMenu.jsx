import React from "react";

const CategoryMenu = ({
  categories,
  selectedCategory,
  handleCategorySelect,
  filteredFiles,
}) => {
  // Function to calculate the count for each category
  const getCategoryCount = (category) => {
    if (!filteredFiles) return 0;
    return filteredFiles.filter((file) => file.categories.includes(category)).length;
  };

  return (
    <div
      className="w-full sm:w-1/5 md:w-1/4 lg:w-1/5 xl:w-1/6 px-4 mb-8 rounded-lg shadow-md overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 text-white"
    >
      <div className="py-4 text-center">
        <h3 className="text-xl font-semibold uppercase tracking-tighter text-white underline">Categories</h3>
      </div>
      <ul className="space-y-4 px-4 pb-4">
        <li
          className={`cursor-pointer hover:bg-gray-700 transition duration-300 text-left pl-4 py-2 rounded-lg ${
            selectedCategory === "" ? "border-l-4 border-blue-500" : ""
          }`}
          onClick={() => handleCategorySelect("")}
        >
          <span className="inline-block font-semibold tracking-tight">All Categories  {' '}<span className="bg-white text-red-600 px-2 p-0.5 rounded-full font-bold text-sm justify-end">{filteredFiles ? filteredFiles.length : 0}</span></span>
        </li>
        {categories.map((category, index) => {
          // Clean up the category text
          const cleanedCategory = category.replace(/["\[\]]/g, "");
          return (
            <li
              key={index}
              className={`cursor-pointer hover:bg-gray-700 transition duration-300 text-left pl-4 py-2 rounded-lg ${
                selectedCategory === category ? "border-l-4 border-blue-500" : ""
              }`}
              onClick={() => handleCategorySelect(category)}
            >
              <span className="inline-block font-semibold tracking-tight">{cleanedCategory}{' '}<span className="bg-white text-red-600 px-2 p-0.5 rounded-full font-bold text-sm justify-end">{getCategoryCount(category)}</span> </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CategoryMenu;
