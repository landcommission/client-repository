import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Plus, X, Loader } from "lucide-react";
import { toast } from "react-hot-toast";

const AVAILABLE_FAMILIES = [
  "Land Governance and Administration",
  "Natural Resources Management",
  "Land Planning",
  "Land Rights",
  "Land Laws and Policies",
  "Historical Land Injustices",
];

const AVAILABLE_CATEGORIES = [
  "Publications",
  "Litigations",
  "Historical Land Injustices",
  "Review of Grants",
  "Journals and Papers",
  "NLC Advisories",
  "Policies and Laws",
  "Land Compensation Reports",
  "Land Adjudication Records",
  "Environmental Impact Assessments (EIAs)",
  "Land Tenure Documents",
  "Strategic Plans",
  "Annual Reports",
  "Land Use Planning Documents",
  "Valuation Reports",
  "Community Land Agreements",
  "Dispute Resolution Cases",
  "Conservation and Natural Resource Management",
  "Public Notices and Statements",
  "Videos"
];

const CreateDocumentForm = ({ isOpen, onClose, handleCreateDocument }) => {
  const [newDocument, setNewDocument] = useState({
    title: "",
    description: "",
    tags: "",
    author: "",
    publicationDate: "",
    publisher: "",
    family: "",
    visibility: "public",
    categories: [],
    accessPermissions: "read",
    file: null,
  });

  const [selectedFileInfo, setSelectedFileInfo] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setNewDocument({
      title: "",
      description: "",
      tags: "",
      author: "",
      publicationDate: "",
      publisher: "",
      family: "",
      visibility: "public",
      categories: [],
      accessPermissions: "read",
      file: null,
    });
    setSelectedFileInfo("");
    setUploadProgress(0);
    setIsLoading(false);
  };

  const handleNewDocumentChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setNewDocument({ ...newDocument, file: files[0] });
      updateSelectedFileInfo(files[0]);
    } else if (name === "categories") {
      setNewDocument({ ...newDocument, categories: [value] });
    } else {
      setNewDocument({ ...newDocument, [name]: value });
    }
  };

  const updateSelectedFileInfo = (file) => {
    if (file) {
      setSelectedFileInfo(`${file.name} (${file.type}, ${file.size} bytes)`);
    } else {
      setSelectedFileInfo("");
    }
  };

  const handleDeleteFile = (e) => {
    e.preventDefault();
    setNewDocument({ ...newDocument, file: null });
    setSelectedFileInfo("");
    setUploadProgress(0);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    setNewDocument({ ...newDocument, file: droppedFile });
    updateSelectedFileInfo(droppedFile);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await handleCreateDocument(e, newDocument, setUploadProgress);
      toast.success("Document created successfully!");
      resetForm();
      onClose();
    } catch (error) {
      toast.error(
        error.message || "Failed to create document. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

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
          className="bg-white rounded-lg shadow-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Create New Document
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Fill in the details below to create a new document.
            </p>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newDocument.title}
                    onChange={handleNewDocumentChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="author"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Author
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={newDocument.author}
                    onChange={handleNewDocumentChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="publisher"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Publisher
                  </label>
                  <input
                    type="text"
                    id="publisher"
                    name="publisher"
                    value={newDocument.publisher}
                    onChange={handleNewDocumentChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="publicationDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Publication Date
                  </label>
                  <input
                    type="date"
                    id="publicationDate"
                    name="publicationDate"
                    value={newDocument.publicationDate}
                    onChange={handleNewDocumentChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="categories"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="categories"
                    name="categories"
                    value={newDocument.categories[0] || ""}
                    onChange={handleNewDocumentChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a category</option>
                    {AVAILABLE_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="family"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Family
                  </label>
                  <select
                    id="family"
                    name="family"
                    value={newDocument.family}
                    onChange={handleNewDocumentChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a family</option>
                    {AVAILABLE_FAMILIES.map((family) => (
                      <option key={family} value={family}>
                        {family}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={newDocument.tags}
                    onChange={handleNewDocumentChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="visibility"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Visibility
                  </label>
                  <select
                    id="visibility"
                    name="visibility"
                    value={newDocument.visibility}
                    onChange={handleNewDocumentChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="internal">Internal</option>
                    <option value="restricted">Restricted</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="accessPermissions"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Access Permissions
                  </label>
                  <select
                    id="accessPermissions"
                    name="accessPermissions"
                    value={newDocument.accessPermissions}
                    onChange={handleNewDocumentChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="read">Read</option>
                    <option value="write">Write</option>
                    <option value="readwrite">Read/Write</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newDocument.description}
                  onChange={handleNewDocumentChange}
                  rows="3"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>

              <div
                className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-4 transition-colors duration-300 ease-in-out hover:border-blue-500"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <label
                  htmlFor="fileInput"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload size={24} className="mb-2 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Click to upload or drag and drop
                  </span>
                  <input
                    id="fileInput"
                    type="file"
                    className="hidden"
                    onChange={handleNewDocumentChange}
                    name="file"
                  />
                </label>
              </div>
              {selectedFileInfo && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Selected File:
                  </p>
                  <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <span className="text-xs text-gray-600">
                      {selectedFileInfo}
                    </span>
                    <button
                      onClick={handleDeleteFile}
                      className="ml-2 text-gray-500 hover:text-red-500 focus:outline-none transition-colors duration-200"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  {uploadProgress > 0 && (
                    <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              )}

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  type="submit"
                  className={`w-full px-4 py-2 text-white font-medium rounded-md ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  } transition-colors duration-200 flex items-center justify-center`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={18} className="mr-2" />
                      Create Document
                    </>
                  )}
                </button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateDocumentForm;
