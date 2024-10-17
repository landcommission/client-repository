import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IoMdClose, IoMdDownload } from 'react-icons/io';
import { FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { RiFullscreenLine, RiFullscreenExitLine } from 'react-icons/ri';
import FileViewer from '../FileViewer';

const PdfModal = ({ isModalOpen, closeModal, modalPdfUrl }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const contentRef = useRef(null);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }, []);

  const handleZoom = useCallback((direction) => {
    setZoom(prevZoom => Math.max(50, Math.min(200, prevZoom + direction * 25)));
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4 sm:p-6 md:p-8"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden max-w-6xl w-full h-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center bg-gradient-to-r from-amber-100 to-amber-200 dark:from-gray-700 dark:to-gray-600 p-3 sm:p-4">
              <h2 className="text-lg sm:text-xl font-bold text-amber-800 dark:text-amber-200">Document Viewer</h2>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={() => handleZoom(-1)}
                  className="text-amber-600 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-full p-1"
                  aria-label="Zoom out"
                >
                  <FiZoomOut size={20} />
                </button>
                <span className="text-amber-800 dark:text-amber-200 text-sm">{zoom}%</span>
                <button
                  onClick={() => handleZoom(1)}
                  className="text-amber-600 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-full p-1"
                  aria-label="Zoom in"
                >
                  <FiZoomIn size={20} />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="text-amber-600 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-full p-1"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? <RiFullscreenExitLine size={20} /> : <RiFullscreenLine size={20} />}
                </button>
                {modalPdfUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(modalPdfUrl, '_blank');
                    }}
                    className="text-amber-600 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-full p-1"
                    aria-label="Download document"
                  >
                    <IoMdDownload size={20} />
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className="text-amber-600 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-full p-1"
                  aria-label="Close modal"
                >
                  <IoMdClose size={24} />
                </button>
              </div>
            </div>
            <div ref={contentRef} className="flex-grow overflow-hidden">
              {modalPdfUrl ? (
                <div className="w-full h-full" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}>
                  <FileViewer file={modalPdfUrl} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl font-semibold animate-pulse">No file to display</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(PdfModal);