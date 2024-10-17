import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  Clock, 
  User, 
  Activity, 
  Info, 
  Monitor
} from 'lucide-react';

const AuditLog = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAuditLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/logs`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
        params: { page: currentPage, limit: 10 }
      });
      setAuditLogs(response.data.auditLogs);
      setTotalPages(response.data.totalPages);
      setTotalLogs(response.data.totalLogs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      setError('Failed to fetch audit logs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div 
          className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-4 text-red-500 flex items-center justify-center"
      >
        <AlertCircle className="mr-2" />
        {error}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 flex items-center">
        <Activity className="mr-2" />
        Audit Log
      </h2>
      <p className="text-sm text-gray-600">
        Showing {auditLogs.length} of {totalLogs} total logs
      </p>
      <AnimatePresence>
        <motion.div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {auditLogs.map((log) => (
              <motion.li 
                key={log._id}
                variants={itemVariants}
                className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate flex items-center">
                      <Info className="mr-2" />
                      {log.action}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        <Clock className="mr-1 h-4 w-4" />
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <User className="mr-1 h-4 w-4" />
                        {log.user.firstname} {log.user.lastname}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Monitor className="mr-1 h-4 w-4" />
                      {log.ipAddress}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{log.details}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
      <motion.div 
        className="flex justify-between items-center"
        variants={itemVariants}
      >
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors duration-150 ease-in-out"
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors duration-150 ease-in-out"
        >
          Next
          <ChevronRight className="ml-2 h-5 w-5" />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default AuditLog;