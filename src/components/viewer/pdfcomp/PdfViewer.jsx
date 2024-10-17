import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineSearch } from 'react-icons/ai';
import { BsZoomIn, BsZoomOut } from 'react-icons/bs';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewer = ({ file }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false);
  }

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  const handleSearch = () => {
    // Implement PDF search functionality
    console.log('Searching for:', searchText);
  }

  return (
    <div className="pdf-viewer bg-gray-100 p-4">
      <div className="pdf-controls flex justify-between items-center mb-4 bg-white p-2 rounded shadow">
        <button onClick={previousPage} disabled={pageNumber <= 1} className="btn">
          <AiOutlineArrowLeft />
        </button>
        <p className="text-sm">
          Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
        </p>
        <button onClick={nextPage} disabled={pageNumber >= numPages} className="btn">
          <AiOutlineArrowRight />
        </button>
        <button onClick={() => setScale(scale => scale + 0.1)} className="btn">
          <BsZoomIn />
        </button>
        <button onClick={() => setScale(scale => Math.max(0.1, scale - 0.1))} className="btn">
          <BsZoomOut />
        </button>
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <button onClick={handleSearch} className="btn">
          <AiOutlineSearch />
        </button>
      </div>
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div>Loading PDF...</div>}
      >
        <Page pageNumber={pageNumber} scale={scale} />
      </Document>
    </div>
  );
};

export default PdfViewer;