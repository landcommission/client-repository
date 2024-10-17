import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, XCircle, AlertCircle } from 'lucide-react';

const EditDocumentModal = ({ 
  editingDocument, 
  setEditingDocument, 
  handleUpdateDocument, 
  availableCategories, 
  availableFamilies 
}) => {
  const [localDocument, setLocalDocument] = useState(editingDocument);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLocalDocument(editingDocument);
  }, [editingDocument]);

  if (!editingDocument) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalDocument(prev => ({
      ...prev,
      [name]: name === 'categories' ? [value] : value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await handleUpdateDocument(localDocument);
      setEditingDocument(null);
    } catch (error) {
      console.error("Failed to update document:", error);
      setError("Failed to update document. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4 z-50"
        onClick={() => setEditingDocument(null)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-xl font-semibold text-gray-900">Edit Document</h3>
            <button
              onClick={() => setEditingDocument(null)}
              className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>
          <form onSubmit={onSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={localDocument.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="categories" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  id="categories"
                  name="categories"
                  value={localDocument.categories ? (Array.isArray(localDocument.categories) ? localDocument.categories[0] : localDocument.categories) : ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Category</option>
                  {availableCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="family" className="block text-sm font-medium text-gray-700 mb-1">Family</label>
                <select
                  id="family"
                  name="family"
                  value={localDocument.family}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Family</option>
                  {availableFamilies.map(family => (
                    <option key={family} value={family}>{family}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                <select
                  id="visibility"
                  name="visibility"
                  value={localDocument.visibility}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="internal">Internal</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                value={localDocument.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              />
            </div>
            {error && (
              <div className="text-red-500 flex items-center">
                <AlertCircle size={18} className="mr-2" />
                {error}
              </div>
            )}
            <div className="flex justify-end space-x-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setEditingDocument(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center"
              >
                <XCircle size={18} className="mr-2" />
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center"
              >
                <Save size={18} className="mr-2" />
                Update
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditDocumentModal;