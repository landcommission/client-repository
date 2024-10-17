import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Eye, Download } from "lucide-react";
import Thumbnail from "../viewer/Thumbnail";

const FeaturedContent = ({ documents }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const getFileType = (filename) => {
    const extension = filename.split(".").pop().toLowerCase();
    if (["pdf"].includes(extension)) return "pdf";
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) return "image";
    if (["mp4", "webm", "ogg"].includes(extension)) return "video";
    if (["docx"].includes(extension)) return "docx";
    return "unknown";
  };

  return (
    <motion.section
      className="mb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-2xl font-bold mb-4 text-green-800">
        Featured Content
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {documents.map((doc) => {
          const fileType = getFileType(doc.filename);
          const fileUrl = `${process.env.REACT_APP_BACKEND_URL}/documents/public/${doc.filename}`;

          return (
            <motion.div
              key={doc._id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <div className="relative aspect-w-16 aspect-h-9 p-2">
                <Thumbnail
                  file={fileUrl}
                  fileType={fileType}
                  title={doc.title || doc.filename}
                  channelName={doc.author || "Unknown Author"}
                  viewCount={doc.downloadCount || 0}
                  uploadDate={new Date(doc.createdAt).toLocaleDateString()}
                  duration={0} // You might need to add a duration field to your document schema
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-3">
                <h3 className="text-base font-semibold truncate text-green-800 mb-2">
                  {doc.title || doc.filename}
                </h3>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {doc.description || "No description available"}
                </p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600 flex items-center">
                    <Download className="w-4 h-4 mr-1" />
                    {doc.downloadCount || 0}
                  </span>
                  <Link
                    to={`/open?search=${encodeURIComponent(doc.filename)}`}
                    className="text-amber-600 hover:text-green-700 transition-colors duration-300 flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default FeaturedContent;
