import React from "react";
import { BsGridFill } from "react-icons/bs";

const CategoryMenuInternal = ({
  categories,
  selectedCategory,
  handleCategorySelect,
  filteredFiles,
}) => {
  // Function to calculate the count for each category
  const getCategoryCounter = (category) => {
    if (!filteredFiles) return 0;

    // If no category is selected, return the count of all files
    if (category === "") return filteredFiles.length;

    // Otherwise, filter files based on the selected category
    const count = filteredFiles.filter((file) =>
      file.categories.includes(`["${category}"]`)
    ).length;

    return count;
  };

  return (
    <div className="flex flex-col w-full sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 mb-8">
      <div className="bg-gray-100 rounded-lg shadow-md">
        <div className="p-4 text-center border-b border-gray-300">
          <h3 className="text-xl font-semibold text-amber-800 tracking-tighter underline uppercase">Categories</h3>
        </div>
        <ul className="divide-y divide-gray-300">
          <li
            className={`p-4 cursor-pointer hover:bg-gray-200 ${
              selectedCategory === "" ? "border-l-4 border-blue-500" : ""
            }`}
            onClick={() => handleCategorySelect("")}
          >
            <span className="flex justify-between items-center">
              <span className="font-semibold tracking-tight">All Categories</span>
              <span className="bg-red-600 text-white px-2 p-0.5 text-sm tracking-tighter rounded-full justify-end">{filteredFiles ? filteredFiles.length : 0}</span>
            </span>
          </li>
          {categories.map((category, index) => {
            // Clean up the category text
            const cleanedCategory = category.replace(/["\[\]]/g, "");
            return (
              <li
                key={index}
                className={`p-4 cursor-pointer hover:bg-gray-200 ${
                  selectedCategory === category ? "border-l-4 border-blue-500" : ""
                }`}
                onClick={() => handleCategorySelect(category)}
              >
                <span className="flex justify-between items-center">
                  <span className="font-semibold tracking-tight">{cleanedCategory}</span>
                  <span className="bg-red-600 text-white px-2 p-0.5 text-sm tracking-tight font-bold rounded-full justify-end">{getCategoryCounter(category)}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default CategoryMenuInternal;
