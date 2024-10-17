import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast, Toaster } from "react-hot-toast";
import { Plus, Calendar, Clock, MapPin, User, Edit, Trash2, X, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Search, SortAsc } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EventForm from "./EventForm";
import DOMPurify from "dompurify";

const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const UpcomingEvents = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [expandedEvents, setExpandedEvents] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const { authState } = useContext(AuthContext);

  const itemsPerPage = 10;

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/documents/fetch-events`,
        {
          headers: { "x-auth-token": authState.token },
        }
      );
      setAllEvents(response.data.events);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events");
    }
  }, [authState.token]);

  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchEvents();
    }
  }, [fetchEvents, authState.isAuthenticated]);

  const sortedAndFilteredEvents = useMemo(() => {
    let result = [...allEvents];
    
    // Apply search filter
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(event => 
        event.title.toLowerCase().includes(lowercasedSearch) ||
        event.description.toLowerCase().includes(lowercasedSearch) ||
        event.location.toLowerCase().includes(lowercasedSearch) ||
        event.organizer.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    // Apply sort
    result.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    
    return result;
  }, [allEvents, searchTerm, sortOrder]);

  useEffect(() => {
    setFilteredEvents(sortedAndFilteredEvents.slice(0, itemsPerPage));
    setTotalPages(Math.ceil(sortedAndFilteredEvents.length / itemsPerPage));
    setCurrentPage(1);
  }, [sortedAndFilteredEvents]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setFilteredEvents(sortedAndFilteredEvents.slice(startIndex, endIndex));
  }, [currentPage, sortedAndFilteredEvents]);

  const handleCreateSubmit = async (formData) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/documents/create-event`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-auth-token": authState.token,
          },
        }
      );
      setAllEvents(prevEvents => [...prevEvents, response.data.event]);
      toast.success("Event created successfully");
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    }
  };

  const handleUpdateSubmit = async (formData) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/documents/update/${currentEvent._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-auth-token": authState.token,
          },
        }
      );
      setAllEvents(prevEvents => 
        prevEvents.map(event => 
          event._id === response.data._id ? response.data : event
        )
      );
      toast.success("Event updated successfully");
      setIsEditModalOpen(false);
      setCurrentEvent(null);
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    }
  };

  const handleEdit = (event) => {
    setCurrentEvent(event);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/documents/delete/${id}`,
          {
            headers: { "x-auth-token": authState.token },
          }
        );
        setAllEvents(prevEvents => prevEvents.filter(event => event._id !== id));
        toast.success("Event deleted successfully");
      } catch (error) {
        console.error("Error deleting event:", error);
        toast.error("Failed to delete event");
      }
    }
  };

  const toggleEventExpansion = (id) => {
    setExpandedEvents(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    setCurrentPage(1);
  };

  if (!authState.isAuthenticated) {
    return <div>Please log in to view and manage events.</div>;
  }

  return (
    <div className="space-y-6 p-4 bg-gray-50 rounded-lg">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-800">Upcoming Events</h2>
        <div className="flex flex-wrap items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-8 pr-2 py-1 border rounded-md"
            />
            <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={handleSort}
            className="p-1 bg-gray-200 rounded-md hover:bg-gray-300"
            title={`Sort by date ${sortOrder === "asc" ? "ascending" : "descending"}`}
          >
            <SortAsc size={20} className={sortOrder === "desc" ? "transform rotate-180" : ""} />
          </button>
          {authState.user && authState.user.role === "admin" && (
            <motion.button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={20} className="mr-2" /> Create Event
            </motion.button>
          )}
        </div>
      </div>

      {/* Event List */}
      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <motion.div
            key={event._id}
            className="bg-white p-4 rounded-lg shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL}${event.imagePath}`}
                  alt={event.title}
                  className="w-16 h-16 object-cover rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-500 mt-1">
                    <span className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {event.time}
                    </span>
                    <span className="flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {event.location}
                    </span>
                    <span className="flex items-center">
                      <User size={14} className="mr-1" />
                      {event.organizer}
                    </span>
                  </div>
                </div>
              </div>
              {authState.user && authState.user.role === "admin" && (
                <div className="flex space-x-2">
                  <motion.button
                    onClick={() => handleEdit(event)}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit size={20} />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(event._id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={20} />
                  </motion.button>
                </div>
              )}
            </div>
            <AnimatePresence>
              {expandedEvents[event._id] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 overflow-hidden"
                >
                  <div 
                    className="text-sm text-gray-600 prose prose-sm max-w-none [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800 [&_ol]:pl-5 [&_ol]:list-decimal [&_ol>li]:pl-1 [&_ol>li]:mb-1 [&_ul]:pl-5 [&_ul]:list-disc [&_ul>li]:pl-1 [&_ul>li]:mb-1"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(event.description) }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => toggleEventExpansion(event._id)}
              className="mt-2 text-sm text-blue-500 hover:text-blue-700 flex items-center"
            >
              {expandedEvents[event._id] ? (
                <>
                  See less
                  <ChevronUp size={16} className="ml-1" />
                </>
              ) : (
                <>
                  See more
                  <ChevronDown size={16} className="ml-1" />
                </>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 bg-gray-200 rounded-full disabled:opacity-50"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 bg-gray-200 rounded-full disabled:opacity-50"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Create Event Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Event"
      >
        <EventForm
          isEdit={false}
          onSubmit={handleCreateSubmit}
          onClose={() => setIsCreateModalOpen(false)}
          initialData={null}
        />
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Event"
      >
        <EventForm
          isEdit={true}
          initialData={currentEvent}
          onSubmit={handleUpdateSubmit}
          onClose={() => setIsEditModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default UpcomingEvents;