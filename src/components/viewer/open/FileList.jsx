import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Download,
  Eye,
  Facebook,
  FileText,
  Globe,
  Grid,
  Info,
  Linkedin,
  List,
  MessageCircle,
  Share2,
  Twitter,
  User,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Thumbnail from "../Thumbnail";

const { REACT_APP_BACKEND_URL } = process.env;

const getFileType = (filename) => {
  const extension = filename.split(".").pop().toLowerCase();
  if (["pdf"].includes(extension)) return "pdf";
  if (["jpg", "jpeg", "png", "gif"].includes(extension)) return "image";
  if (["mp4", "webm", "ogg"].includes(extension)) return "video";
  if (["docx"].includes(extension)) return "docx";
  return "unknown";
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatFileSize = (bytes) => {
  if (!bytes) return "N/A";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
};

const ShareModal = ({
  isOpen,
  onClose,
  file,
  shareOnWhatsApp,
  shareOnLinkedIn,
  shareOnFacebook,
  shareOnTwitter,
}) => {
  if (!isOpen) return null;

  const fileUrl = `${REACT_APP_BACKEND_URL}/documents/public/${file.filename}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg p-6 w-80"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Share</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <button
              onClick={() => shareOnWhatsApp(fileUrl)}
              className="flex flex-col items-center"
            >
              <MessageCircle size={32} className="text-green-500" />
              <span className="text-sm mt-1">WhatsApp</span>
            </button>
            <button
              onClick={() => shareOnLinkedIn(fileUrl)}
              className="flex flex-col items-center"
            >
              <Linkedin size={32} className="text-blue-600" />
              <span className="text-sm mt-1">LinkedIn</span>
            </button>
            <button
              onClick={() => shareOnFacebook(fileUrl)}
              className="flex flex-col items-center"
            >
              <Facebook size={32} className="text-blue-700" />
              <span className="text-sm mt-1">Facebook</span>
            </button>
            <button
              onClick={() => shareOnTwitter(fileUrl)}
              className="flex flex-col items-center"
            >
              <Twitter size={32} className="text-blue-400" />
              <span className="text-sm mt-1">Twitter</span>
            </button>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(fileUrl);
              onClose();
            }}
            className="mt-4 w-full bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Copy Link
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ExpandableDescription = ({ description, maxLength = 150 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!description) return null;

  const toggleExpansion = () => setIsExpanded(!isExpanded);

  return (
    <div className="mt-2">
      <p className="text-sm text-gray-700">
        {isExpanded ? description : `${description.slice(0, maxLength)}${description.length > maxLength ? '...' : ''}`}
      </p>
      {description.length > maxLength && (
        <button
          onClick={toggleExpansion}
          className="text-amber-600 text-sm font-medium mt-1 flex items-center"
        >
          {isExpanded ? (
            <>
              See Less <ChevronUp size={16} className="ml-1" />
            </>
          ) : (
            <>
              See More <ChevronDown size={16} className="ml-1" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center text-sm text-gray-600 mb-1 mr-4">
    <Icon size={14} className="mr-2 flex-shrink-0" />
    <span className="font-semibold mr-1">{label}:</span>
    <span className="truncate">{value || "N/A"}</span>
  </div>
);

const FileCard = ({
  file,
  handleDownload,
  handlePdfView,
  shareOnWhatsApp,
  shareOnLinkedIn,
  shareOnFacebook,
  shareOnTwitter,
  isListView,
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  const toggleMoreInfo = () => setShowMoreInfo(!showMoreInfo);

  return (
    <motion.div 
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 ${
        isListView ? "flex flex-col sm:flex-row" : "flex flex-col"
      }`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`${isListView ? "w-full sm:w-1/4" : "w-full"} p-2`}>
        <Thumbnail
          file={`${REACT_APP_BACKEND_URL}/documents/public/${file.filename}`}
          fileType={getFileType(file.filename)}
          title={file.title || file.filename}
          channelName={file.author || "Unknown Author"}
          viewCount={file.downloadCount || 0}
          uploadDate={formatDate(file.createdAt)}
          duration={0}
        />
      </div>
      <div className={`${isListView ? "w-full sm:w-3/4 flex flex-col justify-between" : "w-full"} p-4`}>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
            {file.title || file.filename}
          </h2>
          <div className={`${isListView ? "flex flex-wrap" : ""}`}>
            <DetailRow icon={User} label="Author" value={file.author} />
            <DetailRow icon={Calendar} label="Published" value={formatDate(file.publicationDate)} />
            {(showMoreInfo || isListView) && (
              <>
                <DetailRow icon={BookOpen} label="Publisher" value={file.publisher} />
                <DetailRow icon={Globe} label="Family" value={file.family} />
                <DetailRow icon={FileText} label="Size" value={formatFileSize(file.fileSize)} />
              </>
            )}
          </div>
          {!isListView && (
            <button
              onClick={toggleMoreInfo}
              className="text-amber-600 text-sm font-medium mt-2 flex items-center"
            >
              {showMoreInfo ? (
                <>Show Less <ChevronUp size={16} className="ml-1" /></>
              ) : (
                <>Show More <ChevronDown size={16} className="ml-1" /></>
              )}
            </button>
          )}
          <ExpandableDescription description={file.description} maxLength={isListView ? 100 : 50} />
        </div>
        <div className={`flex flex-wrap justify-between items-center ${isListView ? "mt-4" : "mt-2"}`}>
          <button
            onClick={() => handleDownload(`${REACT_APP_BACKEND_URL}/documents/public/${file.filename}`, file.filename)}
            className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm hover:bg-amber-700 transition-colors mb-2 sm:mb-0"
          >
            <Download className="inline-block w-4 h-4 mr-1" /> Download
          </button>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePdfView(`${REACT_APP_BACKEND_URL}/documents/public/${file.filename}`)}
              className="text-gray-600 hover:text-amber-600"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="text-gray-600 hover:text-amber-600"
            >
              <Share2 className="w-5 h-5" />
            </button>
            {!isListView && (
              <button
                onClick={() => setIsDetailsOpen(true)}
                className="text-gray-600 hover:text-amber-600"
              >
                <Info className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        file={file}
        shareOnWhatsApp={shareOnWhatsApp}
        shareOnLinkedIn={shareOnLinkedIn}
        shareOnFacebook={shareOnFacebook}
        shareOnTwitter={shareOnTwitter}
      />
      {isDetailsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">{file.title}</h2>
            <DetailRow icon={User} label="Author" value={file.author} />
            <DetailRow icon={BookOpen} label="Publisher" value={file.publisher} />
            <DetailRow icon={Calendar} label="Published" value={formatDate(file.publicationDate)} />
            <DetailRow icon={Globe} label="Family" value={file.family} />
            <DetailRow icon={Download} label="Downloads" value={file.downloadCount} />
            <DetailRow icon={FileText} label="Size" value={formatFileSize(file.fileSize)} />
            <ExpandableDescription description={file.description} />
            <button
              onClick={() => setIsDetailsOpen(false)}
              className="mt-4 bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const FileList = ({
  currentFiles,
  handleDownload,
  handlePdfView,
  shareOnWhatsApp,
  shareOnLinkedIn,
  shareOnFacebook,
  shareOnTwitter,
}) => {
  const [isListView, setIsListView] = useState(true);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsListView(!isListView)}
          className="flex items-center bg-amber-600 text-white px-3 py-2 rounded-md hover:bg-amber-700 transition-colors"
        >
          {isListView ? (
            <>
              <Grid size={18} className="mr-2" /> Grid View
            </>
          ) : (
            <>
              <List size={18} className="mr-2" /> List View
            </>
          )}
        </button>
      </div>
      <motion.div
        className={
          isListView
            ? "space-y-4"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        }
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {currentFiles.map((file, index) => (
          <FileCard
            key={index}
            file={file}
            handleDownload={handleDownload}
            handlePdfView={handlePdfView}
            shareOnWhatsApp={shareOnWhatsApp}
            shareOnLinkedIn={shareOnLinkedIn}
            shareOnFacebook={shareOnFacebook}
            shareOnTwitter={shareOnTwitter}
            isListView={isListView}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default React.memo(FileList);