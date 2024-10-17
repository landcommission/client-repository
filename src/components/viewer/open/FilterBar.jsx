import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, X } from 'lucide-react';

const FilterBar = ({ filters, setFilters, files }) => {
  const [activeFilter, setActiveFilter] = useState(null);
  
  const authors = Array.from(new Set(files.map((file) => file.author))).filter(Boolean);
  const families = Array.from(new Set(files.map((file) => file.family))).filter(Boolean);
  const publishers = Array.from(new Set(files.map((file) => file.publisher))).filter(Boolean);

  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
    setActiveFilter(null);
  };

  const filterOptions = [
    { name: 'author', label: 'Author', options: authors },
    { name: 'family', label: 'Family', options: families },
    { name: 'publisher', label: 'Publisher', options: publishers },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-green-100 p-4 rounded-lg shadow-md"
    >
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center text-green-800">
          <Filter size={20} className="mr-2" />
          <span className="font-medium">Filters:</span>
        </div>
        {filterOptions.map((filter) => (
          <div key={filter.name} className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${
                filters[filter.name] 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-green-800 border border-green-300'
              }`}
              onClick={() => setActiveFilter(activeFilter === filter.name ? null : filter.name)}
            >
              {filter.label}
              <ChevronDown size={16} className="ml-2 inline" />
            </motion.button>
            <AnimatePresence>
              {activeFilter === filter.name && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                >
                  <div className="py-1">
                    {filter.options.map((option, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ backgroundColor: '#f3f4f6' }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700"
                        onClick={() => handleFilterChange(filter.name, option)}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {Object.values(filters).some(Boolean) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 flex flex-wrap gap-2"
          >
            {Object.entries(filters).map(([key, value]) => 
              value && (
                <motion.span
                  key={key}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-200 text-green-800"
                >
                  {value}
                  <button
                    onClick={() => handleFilterChange(key, '')}
                    className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-400 text-white"
                  >
                    <X size={12} />
                  </button>
                </motion.span>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default React.memo(FilterBar);