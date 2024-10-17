import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { Menu, X, Filter, Search } from "lucide-react";
import { fetchFiles, handleDownload } from "./open/FileService";
import {
  shareOnWhatsApp,
  shareOnLinkedIn,
  shareOnFacebook,
  shareOnTwitter,
} from "./open/SocialShare";
import Sidebar from "./open/Sidebar";
import SearchBar from "./open/SearchBar";
import FilterBar from "./open/FilterBar";
import FileList from "./open/FileList";
import Pagination from "./open/Pagination";
import PdfModal from "./open/PdfModal";

const Open = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filesPerPage] = useState(12);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [filters, setFilters] = useState({
    author: "",
    family: "",
    publisher: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPdfUrl, setModalPdfUrl] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const { fetchedFiles, uniqueCategories } = await fetchFiles();
        setFiles(fetchedFiles);
        setCategories(uniqueCategories);
        setLoading(false);

        const searchParams = new URLSearchParams(location.search);
        const searchQuery = searchParams.get("search");
        if (searchQuery) {
          setSearchQuery(searchQuery);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
        setLoading(false);
        toast.error(`Failed to fetch files: ${error.message}`);
      }
    };

    loadFiles();
  }, [location.search]);

  const handlePdfView = (pdfUrl) => {
    setModalPdfUrl(pdfUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalPdfUrl(null);
  };

  const filteredFiles = files.filter((file) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const { author, family, publisher } = filters;

    const matchesSearchQuery =
      !searchQuery ||
      Object.entries(file).some(([key, value]) => {
        if (Array.isArray(value)) {
          return value.some(item => 
            item.toString().toLowerCase().includes(lowerCaseQuery)
          );
        } else if (value instanceof Date) {
          return value.toLocaleString("en-US", { month: "short", year: "numeric" })
            .toLowerCase().includes(lowerCaseQuery);
        } else if (typeof value === 'string' || typeof value === 'number') {
          return value.toString().toLowerCase().includes(lowerCaseQuery);
        }
        return false;
      });

    const matchesFilters =
      (!author || file.author.toLowerCase() === author.toLowerCase()) &&
      (!family || file.family.toLowerCase() === family.toLowerCase()) &&
      (!publisher || file.publisher.toLowerCase() === publisher.toLowerCase());

    return matchesSearchQuery && matchesFilters;
  });

  const filteredFilesByCategory = selectedCategory
    ? filteredFiles.filter((file) => file.categories.includes(selectedCategory))
    : filteredFiles;

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = filteredFilesByCategory.slice(
    indexOfFirstFile,
    indexOfLastFile
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-sm z-20 fixed top-0 left-0 right-0 h-16 mt-16">
        <div className="max-w-full mx-auto h-full px-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mr-4 text-gray-700 lg:hidden"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="hidden sm:block">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="sm:hidden ml-2 text-gray-700"
            >
              <Search size={24} />
            </button>
          </div>
          <motion.button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="ml-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors duration-200 flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter size={18} className="mr-2" />
            <span className="hidden sm:inline">
              {isFiltersOpen ? "Hide Filters" : "Filters"}
            </span>
          </motion.button>
        </div>
      </header>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-32 left-0 right-0 bg-white z-10 p-4 sm:hidden"
          >
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1 mt-14 pt-16 overflow-hidden">
        {/* Sidebar for large screens */}
        <div className="hidden lg:block w-64 flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
          <Sidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>

        {/* Sidebar for small screens */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              className="fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg overflow-y-auto mt-32 lg:hidden"
            >
              <Sidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={(category) => {
                  setSelectedCategory(category);
                  setIsSidebarOpen(false);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <AnimatePresence>
            {isFiltersOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-100 p-4 rounded-lg shadow-md mb-4"
              >
                <FilterBar
                  filters={filters}
                  setFilters={setFilters}
                  files={files}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 border-4 border-gray-400 border-t-gray-700 rounded-full"
              />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <FileList
                currentFiles={currentFiles}
                handleDownload={handleDownload}
                handlePdfView={handlePdfView}
                shareOnWhatsApp={shareOnWhatsApp}
                shareOnLinkedIn={shareOnLinkedIn}
                shareOnFacebook={shareOnFacebook}
                shareOnTwitter={shareOnTwitter}
              />
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalFiles={filteredFilesByCategory.length}
                  filesPerPage={filesPerPage}
                />
              </div>
            </motion.div>
          )}
        </main>
      </div>

      <PdfModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        modalPdfUrl={modalPdfUrl}
      />
    </div>
  );
};

export default Open;