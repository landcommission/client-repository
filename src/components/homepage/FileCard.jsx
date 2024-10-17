import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileIcon, Calendar, Eye, Download, Image, Video } from "lucide-react";
import Thumbnail from "../viewer/Thumbnail";

const FileCard = ({ file }) => {
  const [thumbnailError, setThumbnailError] = useState(false);

  const fileUrl = `${process.env.REACT_APP_BACKEND_URL}/documents/public/${file.filename}`;

  const getFileType = (filename) => {
    const extension = filename.split(".").pop().toLowerCase();
    if (["pdf"].includes(extension)) return "pdf";
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) return "image";
    if (["mp4", "webm", "ogg"].includes(extension)) return "video";
    if (["docx"].includes(extension)) return "docx";
    return "unknown";
  };

  const fileType = getFileType(file.filename);

  const handleThumbnailError = () => {
    setThumbnailError(true);
  };

  const getFileIcon = () => {
    switch (fileType) {
      case "pdf":
        return <FileIcon className="text-gray-400 w-12 h-12" />;
      case "image":
        return <Image className="text-gray-400 w-12 h-12" />;
      case "video":
        return <Video className="text-gray-400 w-12 h-12" />;
      default:
        return <FileIcon className="text-gray-400 w-12 h-12" />;
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 border border-green-100 overflow-hidden flex flex-col h-96 w-full sm:w-64"
      whileHover={{ y: -5 }}
    >
      <div className="p-4 flex-shrink-0">
        <div className="flex items-center mb-2">
          <FileIcon className="text-amber-600 w-5 h-5 mr-2 flex-shrink-0" />
          <h3 className="text-lg font-semibold truncate text-green-800">
            {file.title || file.filename}
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-2 flex items-center">
          <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
          {new Date(file.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex-grow p-1 bg-gray-100 flex items-center justify-center overflow-hidden">
        {!thumbnailError ? (
          <div className="w-full h-full">
            <Thumbnail
              file={fileUrl}
              fileType={fileType}
              title={file.title || file.filename}
              channelName={file.author || "Unknown Author"}
              viewCount={file.downloadCount || 0}
              uploadDate={new Date(file.createdAt).toLocaleDateString()}
              duration={file.duration || 0}
              onError={handleThumbnailError}
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {getFileIcon()}
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50 flex justify-between items-center flex-shrink-0">
        <Link
          to={`/open?search=${encodeURIComponent(file.filename)}`}
          className="inline-flex items-center text-amber-600 hover:text-green-700 transition duration-300 text-sm font-semibold"
        >
          <Eye className="w-4 h-4 mr-1" /> View
        </Link>
        <span className="text-sm text-gray-500">
          <Download className="w-4 h-4 inline mr-1" />
          {file.downloadCount || 0}
        </span>
      </div>
    </motion.div>
  );
};

export default FileCard;