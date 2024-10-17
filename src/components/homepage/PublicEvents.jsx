import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ChevronLeft,
  ChevronRight,
  X,
  PlayCircle,
  PauseCircle,
} from "lucide-react";
import axios from "axios";
import DOMPurify from "dompurify";

const Button = ({ children, onClick, className, ...props }) => (
  <button
    onClick={onClick}
    className={`px-2 py-1 rounded-md transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

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
          className="bg-white rounded-lg w-full max-w-[700px] h-[500px] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 sm:p-6 border-b">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="text-gray-600 text-justify prose max-w-none">
              {children}
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const formatTime = (timeString) => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

const PublicEvents = () => {
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/documents/public-events`
      );
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    let timer;
    if (isPlaying && events.length > 0) {
      timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, events]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + events.length) % events.length
    );
    setIsPlaying(false);
  }, [events.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    setIsPlaying(false);
  }, [events.length]);

  const handleDotClick = useCallback((index) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  }, []);

  const openModal = useCallback((event) => {
    setSelectedEvent(event);
    setIsPlaying(false);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedEvent(null);
    setIsPlaying(true);
  }, []);

  if (events.length === 0) {
    return null;
  }

  const currentEvent = events[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 text-center">Upcoming Events</h2>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden shadow-xl relative"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start p-3 sm:p-4">
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}${currentEvent.imagePath}`}
              alt={currentEvent.title}
              className="w-full sm:w-24 h-24 sm:h-24 object-cover rounded-lg mb-2 sm:mb-0 sm:mr-3"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder-image.jpg";
              }}
            />
            <div className="flex-1 min-w-0 w-full">
              <h3 className="text-sm sm:text-base font-semibold text-white mb-1 truncate">
                {currentEvent.title}
              </h3>
              <div 
                className="text-xs sm:text-sm text-gray-300 mb-2 line-clamp-2 sm:line-clamp-3 overflow-hidden"
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(currentEvent.description, { 
                    ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'em', 'strong', 'a'],
                    ALLOWED_ATTR: ['href', 'target', 'rel']
                  })
                }}
              />
              <div className="flex flex-wrap items-center gap-2 text-xxs sm:text-xs text-gray-400">
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(currentEvent.date).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTime(currentEvent.time)}
                </span>
                <span className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {currentEvent.location}
                </span>
                <span className="flex items-center">
                  <User className="w-3 h-3 mr-1" />
                  {currentEvent.organizer}
                </span>
              </div>
              <Button
                onClick={() => openModal(currentEvent)}
                className="text-xxs sm:text-xs text-blue-400 hover:text-blue-300 mt-2 p-0 bg-transparent"
              >
                See more
              </Button>
            </div>
          </div>
          <Button
            onClick={handlePrev}
            className="absolute top-1/2 left-1 sm:left-2 transform -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10 bg-transparent"
            aria-label="Previous event"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleNext}
            className="absolute top-1/2 right-1 sm:right-2 transform -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10 bg-transparent"
            aria-label="Next event"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </AnimatePresence>
      <div className="mt-2 flex justify-center items-center space-x-2">
        <Button
          onClick={() => setIsPlaying((prev) => !prev)}
          className="text-white/70 hover:text-white text-xxs sm:text-xs bg-transparent"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
        </Button>
        <div className="flex space-x-1">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to event ${index + 1}`}
            />
          ))}
        </div>
      </div>
      <Modal isOpen={!!selectedEvent} onClose={closeModal} title={selectedEvent?.title}>
        <div className="flex flex-col space-y-4">
          <img
            src={`${process.env.REACT_APP_BACKEND_URL}${selectedEvent?.imagePath}`}
            alt={selectedEvent?.title}
            className="w-full h-48 sm:h-64 object-cover rounded-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder-image.jpg";
            }}
          />
          <div 
            className="text-sm text-gray-600 prose prose-sm max-w-none [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800 [&_ol]:pl-5 [&_ol]:list-decimal [&_ol>li]:pl-1 [&_ol>li]:mb-1 [&_ul]:pl-5 [&_ul]:list-disc [&_ul>li]:pl-1 [&_ul>li]:mb-1"
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(selectedEvent?.description, { 
                ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li'],
                ALLOWED_ATTR: ['href', 'target', 'rel']
              })
            }}
          />
          <div className="text-sm text-gray-500 space-y-2">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-blue-600" />
              {new Date(selectedEvent?.date).toDateString()}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-green-600" />
              {formatTime(selectedEvent?.time)}
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-red-600" />
              {selectedEvent?.location}
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              {selectedEvent?.organizer}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PublicEvents;