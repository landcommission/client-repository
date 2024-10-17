// SearchBar.js
import React from 'react';
import { RiSearchLine } from 'react-icons/ri';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative mb-2">
      <input
        type="text"
        placeholder="Search files..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 pl-12 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
      />
      <RiSearchLine className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-400 text-xl" />
    </div>
  );
};

export default React.memo(SearchBar);