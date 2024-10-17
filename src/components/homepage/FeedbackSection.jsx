import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  Star,
  User
} from "lucide-react";
import React, { useEffect, useState } from "react";

const FeedbackSection = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0);

  useEffect(() => {
    fetchFeedbackStats();
  }, []);

  const fetchFeedbackStats = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/documents/feedback-stats`
      );
      setAverageRating(response.data.averageRating);
      setRecentFeedbacks(response.data.recentFeedbacks);
    } catch (error) {
      console.error("Error fetching feedback stats:", error);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setMessage({
        type: "error",
        text: "Please select a rating before submitting.",
      });
      return;
    }
    if (!feedback.trim()) {
      setMessage({
        type: "error",
        text: "Please enter your feedback before submitting.",
      });
      return;
    }
    setIsSubmitting(true);
    setMessage(null);

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/documents/feedback`, {
        rating,
        feedback,
      });
      setMessage({ type: "success", text: "Feedback submitted successfully!" });
      setRating(0);
      setFeedback("");
      fetchFeedbackStats();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextFeedback = () => {
    setCurrentFeedbackIndex((prevIndex) =>
      prevIndex === recentFeedbacks.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevFeedback = () => {
    setCurrentFeedbackIndex((prevIndex) =>
      prevIndex === 0 ? recentFeedbacks.length - 1 : prevIndex - 1
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-green-50 to-amber-50 rounded-lg p-4 text-sm"
    >
      <h2 className="text-xl font-bold mb-3 text-green-800">
        Community Feedback
      </h2>

      <div className="flex items-center justify-between mb-4">
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-2xl font-bold text-amber-500">
            {averageRating.toFixed(1)}
          </div>
          <div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(averageRating)
                      ? "text-amber-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-green-700 font-medium text-xs">Overall Rating</p>
          </div>
        </motion.div>
        <motion.div 
          className="text-center"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-2xl font-bold text-green-600">
            {recentFeedbacks.length}
          </p>
          <p className="text-green-700 font-medium text-xs">Total Reviews</p>
        </motion.div>
      </div>

      {recentFeedbacks.length > 0 && (
        <motion.div 
          className="mb-4 bg-white p-3 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-semibold text-green-800 mb-2 text-base">Recent Feedback</h3>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFeedbackIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-2">
                <User className="w-6 h-6 text-green-600 bg-green-100 rounded-full p-1 mr-2" />
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= recentFeedbacks[currentFeedbackIndex].rating
                          ? "text-amber-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 italic text-sm">
                "{recentFeedbacks[currentFeedbackIndex].feedback}"
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-between items-center mt-2">
            <button
              onClick={prevFeedback}
              className="bg-green-100 rounded-full p-1 hover:bg-green-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              <ChevronLeft className="w-4 h-4 text-green-600" />
            </button>
            <span className="text-green-600 font-medium text-xs">
              {currentFeedbackIndex + 1} of {recentFeedbacks.length}
            </span>
            <button
              onClick={nextFeedback}
              className="bg-green-100 rounded-full p-1 hover:bg-green-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              <ChevronRight className="w-4 h-4 text-green-600" />
            </button>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`mb-3 p-2 rounded-lg text-xs font-medium ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            } flex items-center`}
          >
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="space-y-3 bg-white p-3 rounded-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div>
          <label className="block text-green-700 font-semibold mb-1 text-sm">
            Your Rating
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${
                  star <= rating
                    ? "bg-amber-400 text-white"
                    : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                }`}
              >
                <Star className="w-4 h-4 mx-auto" />
              </motion.button>
            ))}
          </div>
        </div>
        <div className="relative">
          <label className="block text-green-700 font-semibold mb-1 text-sm">
            Your Feedback
          </label>
          <textarea
            className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow pr-10 text-sm"
            rows="2"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your thoughts..."
          ></textarea>
          <motion.button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`absolute right-2 bottom-2 p-2 rounded-full ${
              feedback.trim()
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-300 cursor-not-allowed"
            } transition-colors`}
          >
            <Send
              className={`w-4 h-4 ${
                feedback.trim() ? "text-white" : "text-gray-500"
              } ${isSubmitting ? "animate-spin" : ""}`}
            />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FeedbackSection;