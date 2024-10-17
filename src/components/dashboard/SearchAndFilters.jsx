import React from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronUp, ChevronDown, Filter } from 'lucide-react';

const SearchAndFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  categoryFilter, 
  setCategoryFilter, 
  visibilityFilter, 
  setVisibilityFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  availableCategories
}) => {
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const handleVisibilityFilterChange = (e) => {
    setVisibilityFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-4 rounded-lg shadow-sm mb-6"
    >
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="relative w-full sm:w-auto sm:flex-grow">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter size={18} className="text-gray-500 flex-shrink-0" />
          <select
            value={categoryFilter}
            onChange={handleCategoryFilterChange}
            className="w-full sm:w-auto border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {availableCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <select
          value={visibilityFilter}
          onChange={handleVisibilityFilterChange}
          className="w-full sm:w-auto border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Visibilities</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="internal">Internal</option>
          <option value="restricted">Restricted</option>
        </select>
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="w-full sm:w-auto border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="createdAt">Created At</option>
          <option value="title">Title</option>
          <option value="fileSize">File Size</option>
          <option value="downloadCount">Download Count</option>
        </select>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSortOrder} 
          className="w-full sm:w-auto bg-blue-500 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-200 hover:bg-blue-600"
        >
          {sortOrder === 'asc' ? <ChevronUp className="mr-2" size={18} /> : <ChevronDown className="mr-2" size={18} />}
          <span className="text-sm">{sortOrder === 'asc' ? 'Asc.' : 'Desc.'}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SearchAndFilters;