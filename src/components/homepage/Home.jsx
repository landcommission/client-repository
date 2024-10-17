import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Compass, Info } from "lucide-react";
import React, { useEffect, useState } from "react";
import { pdfjs } from "react-pdf";
import Announcements from "./Announcements";
import ChatbotWidget from "./ChatbotWidget";
import DocumentRequestSection from "./DocumentRequestSection";
import FeaturedContent from "./FeaturedContent";
import FeedbackSection from "./FeedbackSection";
import Footer from "./Footer";
import Hero from "./Hero";
import LandManagementStats from "./LandManagementStats";
import PopularTopics from "./PopularTopics";
import QuickLinks from "./QuickLinks";
import RecentFiles from "./RecentFiles";
import RepositoryStats from "./RepositoryStats";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const Home = () => {
  const [documents, setDocuments] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showQuickLinks, setShowQuickLinks] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/documents/public`
      );
      const sortedDocuments = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setDocuments(sortedDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const toggleQuickLinks = () => setShowQuickLinks(!showQuickLinks);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Hero />
      <main className="relative z-5">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <motion.div
            className="my-8 p-6 bg-green-50 rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold text-green-800 flex items-center mb-4">
              <Info className="w-6 h-6 mr-2" />
              About NLC Repository
            </h2>
            <p className="text-green-700 text-sm mb-2">
              Welcome to the NLC Repository, your gateway to Kenya's land
              management information. This digital archive provides public
              access to a wide range of documents related to land policies,
              legal frameworks, and historical records.
            </p>
            <p className="text-green-700 text-sm">
              Explore our collection to stay informed about land management
              practices and developments in Kenya.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-8">
            <motion.div
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FeaturedContent documents={documents.slice(0, 3)} />
              <RecentFiles
                recentFiles={documents.slice(0, 6)}
                showMore={showMore}
                setShowMore={setShowMore}
              />
              <motion.div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-3 bg-green-50 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Compass className="w-4 h-4 text-green-600" />
                    <h3 className="text-base font-semibold text-green-800">
                      Quick Links
                    </h3>
                  </div>
                  <motion.button
                    onClick={toggleQuickLinks}
                    className="p-1 rounded-full bg-white shadow-sm hover:bg-green-100 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showQuickLinks ? (
                      <ChevronUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-green-600" />
                    )}
                  </motion.button>
                </div>
                <AnimatePresence>
                  {showQuickLinks && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <QuickLinks />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <LandManagementStats />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <FeedbackSection />
                  </motion.div>
                  <motion.div
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <DocumentRequestSection />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <RepositoryStats documents={documents} />
              <Announcements />
              <PopularTopics />
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
      <ChatbotWidget />
    </div>
  );
};

export default Home;