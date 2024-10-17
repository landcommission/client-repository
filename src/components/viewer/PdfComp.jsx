import React, { useState, useEffect, useRef, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { BsZoomIn, BsZoomOut } from "react-icons/bs";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// A4 aspect ratio is 1:√2 (width:height)
const A4_ASPECT_RATIO = 1 / Math.sqrt(2);
const INITIAL_ZOOM = 2.2;

function PdfComp({ file }) {
  const [numPages, setNumPages] = useState(null);
  const [pageWidth, setPageWidth] = useState(0);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef(null);
  const pageRefs = useRef([]);

  useEffect(() => {
    const calculatePageWidth = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.offsetHeight - 40;
        const containerWidth = containerRef.current.offsetWidth - 40;
        
        let newPageWidth = containerWidth / INITIAL_ZOOM;
        
        const pageHeight = newPageWidth / A4_ASPECT_RATIO;
        if (pageHeight > containerHeight) {
          newPageWidth = containerHeight * A4_ASPECT_RATIO;
        }
        
        setPageWidth(newPageWidth);
      }
    };

    calculatePageWidth();
    window.addEventListener("resize", calculatePageWidth);
    return () => {
      window.removeEventListener("resize", calculatePageWidth);
    };
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    pageRefs.current = Array(numPages).fill().map(() => React.createRef());
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageNumber = parseInt(entry.target.getAttribute('data-page-number'));
            setCurrentPage(pageNumber);
          }
        });
      },
      { threshold: 0.5 }
    );

    pageRefs.current.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      pageRefs.current.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [numPages]);

  const zoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.1, 3));
  };

  const zoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.5));
  };

  return (
    <div className="pdf-viewer bg-gray-100 flex flex-col h-full">
      <div className="flex items-center justify-between bg-white shadow-md p-2 mb-2">
        <span className="text-sm font-medium">
          Page {currentPage} of {numPages}
        </span>
        <div className="flex items-center">
          <button onClick={zoomOut} className="btn-icon mx-1">
            <BsZoomOut className="text-gray-700 hover:text-amber-600" />
          </button>
          <span className="text-sm font-medium mx-1">
            {Math.round(zoom * 100)}%
          </span>
          <button onClick={zoomIn} className="btn-icon mx-1">
            <BsZoomIn className="text-gray-700 hover:text-amber-600" />
          </button>
        </div>
      </div>
      <div 
        ref={containerRef} 
        className="pdf-container flex-grow overflow-auto p-5"
      >
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          }
        >
          {Array.from(new Array(numPages), (el, index) => (
            <div 
              key={`page_${index + 1}`} 
              className="flex justify-center mb-4"
              ref={pageRefs.current[index]}
              data-page-number={index + 1}
            >
              <Page
                pageNumber={index + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                width={pageWidth * zoom}
                className="shadow-md"
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
}

export default PdfComp;