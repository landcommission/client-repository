import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoLaw } from "react-icons/go";
import { GiIsland } from "react-icons/gi";
import { SiCodereview } from "react-icons/si";
import { GiPublicSpeaker } from "react-icons/gi";
import { FaFile } from "react-icons/fa";
import { MdPublic } from "react-icons/md";
import { MdPrivateConnectivity } from "react-icons/md";

const { REACT_APP_BACKEND_URL } = process.env;

const FileCountByCategory = ({ currentUser}) => {
  const [fileCountByCategory, setFileCountByCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFileCountByCategory = async () => {
      try {
  const response = await axios.get(
    `${REACT_APP_BACKEND_URL}/documents/allfiles`,
    {
      // Include currentUser information in the request headers
    headers: {
      _id: currentUser._id,
      email: currentUser.email
    }
    }
  );

  // Initialize an object to store counts by category and visibility
  const categoryCounts = {};

  response.data.forEach((file) => {
    file.categories.forEach((category) => {
      const categoryName = JSON.parse(category)[0]; // Remove square brackets and quotes

      // Initialize category count if not exists
      categoryCounts[categoryName] = categoryCounts[categoryName] || {};

      // Increment count for file visibility within the category
      categoryCounts[categoryName][file.visibility] =
        (categoryCounts[categoryName][file.visibility] || 0) + 1;
    });
  });

  // Convert categoryCounts object into an array of objects with name and counts
  const categoriesArray = Object.entries(categoryCounts).map(
    ([name, counts]) => ({
      name,
      counts,
    })
  );

  setFileCountByCategory(categoriesArray);
  setLoading(false);
} catch (error) {
  console.error("Error fetching file count by category:", error);
  setLoading(false);
}
    }

    fetchFileCountByCategory();
  }, []);

  const getCategoryIcon = (categoryName) => {
    switch (categoryName) {
      case "Litigations":
        return <GoLaw className="text-white" />;
      case "Historical Land Injustices":
        return <GiIsland className="text-green-600" />;
      case "Review of Grants":
        return <SiCodereview className="text-white" />;
      case "Publications":
        return <GiPublicSpeaker className="text-white" />;
      default:
        return <FaFile className="text-white" />;
    }
  };

  //  Format total  count for each category
  function formatTotalCount(count) {
    if (count < 1000) {
      return count.toString();
    } else if (count < 1000000) {
      return (count / 1000).toFixed(1) + "K";
    } else {
      return (count / 1000000).toFixed(1) + "M";
    }
  }

  function formatCount(count) {
    if (count < 1000) {
      return count.toString();
    } else if (count < 1000000) {
      return (count / 1000).toFixed(1) + "K";
    } else {
      return (count / 1000000).toFixed(1) + "M";
    }
  }

  return (
    <div className="bg-gray-900 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-0">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl mb-4">
          File Count by Category
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <p className="text-white text-center">Loading...</p>
          ) : (
            fileCountByCategory.map((category, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-lg overflow-hidden"
              >
                <div className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    {getCategoryIcon(category.name)}
                    <span className="ml-2 text-sm font-semibold leading-5 text-gray-300">
                      {category.name}
                    </span>
                  </div>
                  <div className="text-white">
                    <span className="text-gray-300 text-xs font-semibold">
                      Total:{" "}
                      {formatTotalCount(
                        Object.values(category.counts).reduce(
                          (acc, curr) => acc + curr,
                          0
                        )
                      )}
                    </span>
                  </div>
                  {/* Visibility Counts */}
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    {Object.entries(category.counts).map(
                      ([visibility, count], idx) => (
                        <div
                          key={idx}
                          className="flex items-center bg-gray-800 rounded p-1"
                        >
                          {visibility === "public" && (
                            <MdPublic className="text-green-500 mr-1" />
                          )}
                          {visibility === "private" && (
                            <MdPrivateConnectivity className="text-red-500 mr-1" />
                          )}
                          {visibility === "internal" && (
                            <GiIsland className="text-blue-500 mr-1" />
                          )}
                          <div className="flex flex-col">
                            <span className="text-gray-300 text-xs font-semibold">
                              {visibility}
                            </span>
                            <span className="text-gray-300 text-xs font-semibold">
                              {formatCount(count)}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FileCountByCategory;
