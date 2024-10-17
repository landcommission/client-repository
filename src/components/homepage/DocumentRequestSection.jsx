import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Send, AlertCircle, Search, HelpCircle, X, Mail } from 'lucide-react';
import axios from 'axios';

const { REACT_APP_BACKEND_URL } = process.env;

const DocumentRequestSection = () => {
  const [documentName, setDocumentName] = useState('');
  const [reason, setReason] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async () => {
    if (!documentName.trim() || !reason.trim() || !email.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all fields before submitting.' });
      return;
    }
    setIsSubmitting(true);
    setMessage(null);

    try {
      await axios.post(`${REACT_APP_BACKEND_URL}/documents/document-request`, {
        documentName,
        reason,
        email
      });
      setMessage({ type: 'success', text: 'Document request submitted successfully!' });
      setDocumentName('');
      setReason('');
      setEmail('');
    } catch (error) {
      console.error('Error submitting document request:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-lg rounded-xl p-6 max-w-md mx-auto relative overflow-hidden"
    >
      <motion.div
        className="absolute top-0 right-0 w-40 h-40 bg-green-100 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.5 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ transform: 'translate(30%, -30%)' }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-40 h-40 bg-blue-100 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.5 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{ transform: 'translate(-30%, 30%)' }}
      />

      <motion.h2
        className="text-2xl font-bold mb-4 text-green-800 flex items-center relative z-10"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <FileText className="w-6 h-6 mr-2 text-green-600" />
        Request a Document
      </motion.h2>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`mb-4 p-3 rounded-lg flex items-center ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            } relative z-10`}
          >
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="text-sm font-medium">{message.text}</span>
            <X
              className="w-5 h-5 ml-auto cursor-pointer"
              onClick={() => setMessage(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="space-y-4 relative z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div>
          <label className="block text-sm font-semibold text-green-700 mb-1">Document Name</label>
          <div className="relative">
            <input
              type="text"
              className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="Enter document name or type"
              required
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-green-700 mb-1">Email</label>
          <div className="relative">
            <input
              type="email"
              className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
            <Mail className="absolute right-3 top-2.5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-green-700 mb-1">Reason for Request</label>
          <textarea
            className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            rows="3"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Briefly explain why you need this document..."
            required
          ></textarea>
        </div>

        <motion.button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !documentName.trim() || !reason.trim() || !email.trim()}
          className={`w-full flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200
            ${documentName.trim() && reason.trim() && email.trim()
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSubmitting ? (
            <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Send className="w-5 h-5 mr-2" />
          )}
          Submit Request
        </motion.button>
      </motion.div>

      <motion.div
        className="mt-4 text-xs text-gray-500 flex items-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <HelpCircle className="w-4 h-4 mr-1 text-green-500" />
        Enter the specific name or type of document you need, your email, and provide a brief explanation for your request
      </motion.div>
    </motion.div>
  );
};

export default DocumentRequestSection;