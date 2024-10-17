import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, X, ChevronLeft, ChevronRight, Filter, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import DOMPurify from 'dompurify';

const Modal = ({ children, isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const News = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'normal',
    category: 'general',
    startDate: '',
    endDate: '',
    targetAudience: ['all'],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAnnouncements, setTotalAnnouncements] = useState(0);
  const [filters, setFilters] = useState({
    category: '',
    priority: '',
    startDate: '',
    endDate: '',
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const itemsPerPage = 5;

  const fetchAnnouncements = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        ...filters
      });
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/documents/announcements?${params}`, {
        headers: { "x-auth-token": localStorage.getItem("token") }
      });
      setAnnouncements(response.data.announcements);
      setTotalPages(response.data.totalPages);
      setTotalAnnouncements(response.data.totalAnnouncements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to fetch announcements');
    }
  }, [currentPage, filters, itemsPerPage]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setFormData(prev => ({ ...prev, content: data }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sanitizedContent = DOMPurify.sanitize(formData.content);
      const dataToSubmit = { ...formData, content: sanitizedContent };

      if (isEditing) {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/documents/announcements/${editId}`, dataToSubmit, {
          headers: { "x-auth-token": localStorage.getItem("token") }
        });
        toast.success('Announcement updated successfully');
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/documents/announcements`, dataToSubmit, {
          headers: { "x-auth-token": localStorage.getItem("token") }
        });
        toast.success('Announcement created successfully');
      }
      resetForm();
      fetchAnnouncements();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error submitting announcement:', error);
      toast.error('Failed to submit announcement');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      priority: 'normal',
      category: 'general',
      startDate: '',
      endDate: '',
      targetAudience: ['all'],
    });
    setIsEditing(false);
    setEditId(null);
  };

  const handleEdit = (announcement) => {
    setFormData({
      ...announcement,
      startDate: announcement.startDate.split('T')[0],
      endDate: announcement.endDate ? announcement.endDate.split('T')[0] : '',
    });
    setIsEditing(true);
    setEditId(announcement._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/documents/announcements/${id}`, {
          headers: { "x-auth-token": localStorage.getItem("token") }
        });
        toast.success('Announcement deleted successfully');
        fetchAnnouncements();
      } catch (error) {
        console.error('Error deleting announcement:', error);
        toast.error('Failed to delete announcement');
      }
    }
  };

  const openModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800',
      normal: 'bg-green-100 text-green-800',
      high: 'bg-yellow-100 text-yellow-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6 text-green-800">Manage Announcements</h1>
      
      <div className="mb-6 flex flex-wrap justify-between items-center gap-2">
        <motion.button
          onClick={openModal}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="mr-2" size={16} /> Add Announcement
        </motion.button>
        
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="bg-white hover:bg-gray-100 text-green-600 font-semibold py-2 px-4 border border-green-600 rounded flex items-center"
          >
            <Filter className="mr-2" size={16} /> Filters
          </button>
          <button
            onClick={() => { setFilters({}); setCurrentPage(1); }}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded flex items-center"
          >
            <RefreshCw className="mr-2" size={16} /> Reset
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-green-800">
            {isEditing ? 'Edit Announcement' : 'Create Announcement'}
          </h2>
          <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
            <CKEditor
              editor={ClassicEditor}
              data={formData.content}
              onChange={handleEditorChange}
              config={{
                toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'insertTable', 'mediaEmbed', '|', 'undo', 'redo'],
                heading: {
                  options: [
                    { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                    { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                    { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                    { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
                  ]
                },
                image: {
                  toolbar: ['imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight'],
                  styles: ['full', 'alignLeft', 'alignRight']
                },
                table: {
                  contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
                },
                mediaEmbed: {
                  previewsInData: true
                },
                placeholder: "Enter the announcement content here..."
              }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
              >
                <option value="general">General</option>
                <option value="maintenance">Maintenance</option>
                <option value="event">Event</option>
                <option value="policy">Policy</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                id="startDate"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                id="endDate"
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <motion.button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isEditing ? 'Update Announcement' : 'Create Announcement'}
          </motion.button>
        </form>
      </Modal>

      <Modal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Filter Announcements</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="filterCategory" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="filterCategory"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
            >
              <option value="">All Categories</option>
              <option value="general">General</option>
              <option value="maintenance">Maintenance</option>
              <option value="event">Event</option>
              <option value="policy">Policy</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="filterPriority" className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              id="filterPriority"
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label htmlFor="filterStartDate" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              id="filterStartDate"
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="filterEndDate" className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              id="filterEndDate"
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <motion.button
            onClick={() => setIsFilterModalOpen(false)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Apply Filters
          </motion.button>
        </div>
      </Modal>

      <div className="space-y-4">
        {announcements.map(announcement => (
          <motion.div
            key={announcement._id}
            className="bg-white shadow-md rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-green-800">{announcement.title}</h2>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(announcement.priority)}`}>
                {announcement.priority}
              </span>
            </div>
            <div 
              className="prose prose-sm max-w-none mb-4 [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800 [&_ol]:pl-5 [&_ol]:list-decimal [&_ol>li]:pl-1 [&_ol>li]:mb-1 [&_ul]:pl-5 [&_ul]:list-disc [&_ul>li]:pl-1 [&_ul>li]:mb-1"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(announcement.content) }}
            />
            <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-4">
              <span className="bg-gray-100 px-2 py-1 rounded">Category: {announcement.category}</span>
              <span className="bg-gray-100 px-2 py-1 rounded">Start: {new Date(announcement.startDate).toLocaleDateString()}</span>
              {announcement.endDate && (
                <span className="bg-gray-100 px-2 py-1 rounded">End: {new Date(announcement.endDate).toLocaleDateString()}</span>
              )}
            </div>
            <div className="flex space-x-2">
              <motion.button
                onClick={() => handleEdit(announcement)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Edit className="mr-1" size={14} /> Edit
              </motion.button>
              <motion.button
                onClick={() => handleDelete(announcement._id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 className="mr-1" size={14} /> Delete
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {announcements.length === 0 && (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-500">No announcements found.</p>
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
        <span className="text-sm text-gray-600 mb-2 sm:mb-0">
          Showing {announcements.length} of {totalAnnouncements} announcements
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-green-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-green-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default News;