import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Search, FileText, Download, Tag, Calendar, User, Building, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";
import Thumbnail from "../viewer/Thumbnail";

const SearchComponent = ({ searchRef }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const searchFiles = useCallback(async (term) => {
    if (term) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/documents/search?query=${encodeURIComponent(term)}`
        );
        setFilteredFiles(response.data);
        setIsSearching(true);
      } catch (error) {
        console.error("Error searching files:", error);
        setFilteredFiles([]);
      }
    } else {
      setFilteredFiles([]);
      setIsSearching(false);
    }
  }, []);

  const debouncedSearch = useMemo(
    () => debounce(searchFiles, 300),
    [searchFiles]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/open?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsSearching(true);
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto relative px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      ref={searchRef}
    >
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="Search for resources..."
          className="w-full py-3 sm:py-4 px-4 sm:px-6 pl-10 sm:pl-12 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-lg text-sm sm:text-lg"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsSearching(true)}
        />
        <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-amber-600 text-white py-1.5 sm:py-2 px-4 sm:px-6 rounded-full transition duration-300 hover:bg-green-700 text-sm sm:text-base"
        >
          Search
        </button>
      </form>
      <AnimatePresence>
        {isSearching && searchTerm && (
          <DynamicSearchResults
            filteredFiles={filteredFiles}
            setSearchTerm={setSearchTerm}
            setIsSearching={setIsSearching}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const DynamicSearchResults = ({
  filteredFiles,
  setSearchTerm,
  setIsSearching,
}) => {
  const getFileType = (filename) => {
    const extension = filename.split(".").pop().toLowerCase();
    if (["pdf"].includes(extension)) return "pdf";
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) return "image";
    if (["mp4", "webm", "ogg"].includes(extension)) return "video";
    if (["docx"].includes(extension)) return "docx";
    return "unknown";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-xl overflow-hidden"
    >
      {filteredFiles.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {filteredFiles.slice(0, 5).map((file) => (
            <li
              key={file._id}
              className="p-3 sm:p-4 hover:bg-gray-50 cursor-pointer transition duration-300"
              onClick={() => {
                setSearchTerm(file.filename);
                setIsSearching(false);
              }}
            >
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="flex-shrink-0 w-12 h-16 sm:w-16 sm:h-20 bg-gray-100 rounded-md overflow-hidden">
                  <Thumbnail
                    file={`${process.env.REACT_APP_BACKEND_URL}/documents/public/${file.filename}`}
                    fileType={getFileType(file.filename)}
                    title={file.title || file.filename}
                    channelName={file.author || "Unknown Author"}
                    viewCount={file.downloadCount || 0}
                    uploadDate={new Date(file.createdAt).toLocaleDateString()}
                    duration={0}
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                    {file.title || file.filename}
                  </h4>
                  <p className="text-xxs sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                    <Calendar className="inline mr-1 w-3 h-3" />
                    Added on: {new Date(file.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xxs sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                    <User className="inline mr-1 w-3 h-3" />
                    {file.author || "Unknown Author"}
                  </p>
                  <p className="text-xxs sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                    <Building className="inline mr-1 w-3 h-3" />
                    {file.publisher || "Unknown Publisher"}
                  </p>
                  <p className="text-xxs sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                    <BookOpen className="inline mr-1 w-3 h-3" />
                    {file.family || "Uncategorized"}
                  </p>
                  <div className="flex flex-wrap mt-1">
                    {file.tags && file.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xxs sm:text-xs font-medium bg-green-100 text-green-800 mr-1 mb-1">
                        <Tag className="mr-1 w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center space-x-1 sm:space-x-2">
                  <span className="text-xxs sm:text-xs text-amber-600 font-medium">
                    <Download className="inline mr-0.5 sm:mr-1 w-3 h-3 sm:w-4 sm:h-4" />
                    {file.downloadCount || 0}
                  </span>
                  <FileText className="text-green-600 w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="p-3 sm:p-4 text-xs sm:text-sm text-gray-500">No results found</p>
      )}
    </motion.div>
  );
};

export default SearchComponent;