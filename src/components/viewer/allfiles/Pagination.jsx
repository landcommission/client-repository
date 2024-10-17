// Pagination.js
import React from 'react';

const Pagination = ({ currentPage, setCurrentPage, totalFiles, filesPerPage }) => {
  const totalPages = Math.ceil(totalFiles / filesPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="flex justify-center items-center mt-8 space-x-2">
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-md ${
          currentPage === 1
            ? 'bg-amber-300 text-amber-600 cursor-not-allowed'
            : 'bg-amber-500 text-white hover:bg-amber-600'
        }`}
      >
        Previous
      </button>
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => paginate(index + 1)}
          className={`px-4 py-2 rounded-md ${
            currentPage === index + 1
              ? 'bg-amber-600 text-white'
              : 'bg-amber-200 text-amber-700 hover:bg-amber-300'
          }`}
        >
          {index + 1}
        </button>
      ))}
      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-md ${
          currentPage === totalPages
            ? 'bg-amber-300 text-amber-600 cursor-not-allowed'
            : 'bg-amber-500 text-white hover:bg-amber-600'
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default React.memo(Pagination);