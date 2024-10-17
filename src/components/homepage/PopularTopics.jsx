import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import Thumbnail from '../viewer/Thumbnail';
import { Link } from 'react-router-dom';

const PopularTopics = () => {
  const [popularFiles, setPopularFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularFiles = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/documents/public`);
        const sortedFiles = response.data.sort((a, b) => b.downloadCount - a.downloadCount);
        setPopularFiles(sortedFiles.slice(0, 2));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching popular files:', err);
        setError('Failed to load popular downloads');
        setLoading(false);
      }
    };

    fetchPopularFiles();
  }, []);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white shadow-md rounded-lg overflow-hidden p-3"
      >
        <div className="flex items-center justify-center h-20">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white shadow-md rounded-lg overflow-hidden p-3"
      >
        <div className="flex items-center justify-center h-20 text-red-500 text-sm">
          <AlertCircle className="mr-2" size={16} />
          <span>{error}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white shadow-md rounded-lg overflow-hidden"
    >
      <div className="bg-gray-100 py-2 px-3">
        <h2 className="text-sm font-semibold text-gray-800">Popular Downloads</h2>
      </div>
      <div className="p-3 space-y-4">
        {popularFiles.map((file) => (
          <div key={file._id} className="w-full">
            <Thumbnail
              file={`${process.env.REACT_APP_BACKEND_URL}/documents/public/${file.filename}`}
              fileType={getFileType(file.filename)}
              title={file.title || file.filename}
              channelName={file.author || "Unknown"}
              viewCount={file.downloadCount || 0}
              uploadDate={new Date(file.createdAt).toLocaleDateString()}
              duration={file.duration || 0}
            />
            <Link
              to={`/open?search=${encodeURIComponent(file.filename)}`}
              className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const getFileType = (filename) => {
  const extension = filename.split(".").pop().toLowerCase();
  if (["pdf"].includes(extension)) return "pdf";
  if (["jpg", "jpeg", "png", "gif"].includes(extension)) return "image";
  if (["mp4", "webm", "ogg"].includes(extension)) return "video";
  if (["docx"].includes(extension)) return "docx";
  return "unknown";
};

export default PopularTopics;