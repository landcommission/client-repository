import React, { useState, useEffect, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users as UsersIcon,
  FileQuestion,
  Megaphone,
  FileText,
  Menu,
  X,
  Home,
  Map,
  Book,
  Settings,
  Bell,
  Search,
  ChevronDown,
  Calendar,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

// Import your page components here
import Users from "./pages/Users";
import AuditLog from "./pages/AuditLog";

// Import the document management components
import DocumentStats from "./DocumentStats";
import SearchAndFilters from "./SearchAndFilters";
import DocumentList from "./DocumentList";
import CreateDocumentForm from "./CreateDocumentForm";
import EditDocumentModal from "./EditDocumentModal";
import { AuthContext } from "../context/AuthContext";

import Requests from "./Requests";
import News from "./News";
import WelcomeScreen from "./WelcomeScreen";
import UpcomingEvents from "./UpcomingEvents";

const Dashboard = () => {
  const [activeView, setActiveView] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { authState } = useContext(AuthContext);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Document management state
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalSize: 0,
    categoryCounts: [],
    familyCounts: [],
    visibilityCounts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [editingDocument, setEditingDocument] = useState(null);
  const [availableFamilies, setAvailableFamilies] = useState([]);
  const [familiesLoading, setFamiliesLoading] = useState(false);
  const [familiesError, setFamiliesError] = useState(null);
  const [availableCategories] = useState([
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
  ]);

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth > 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/documents/allfiles-dashboard`,
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
          params: {
            search: searchTerm,
            visibility: visibilityFilter,
            sortBy,
            sortOrder,
            page: currentPage,
            limit: 8,
          },
        }
      );

      let filteredDocuments = [];

      if (Array.isArray(response.data)) {
        filteredDocuments = response.data;
      } else if (
        response.data.documents &&
        Array.isArray(response.data.documents)
      ) {
        filteredDocuments = response.data.documents;
      } else {
        console.error("Unexpected response format:", response.data);
        setError("Unexpected data format received from server");
        return;
      }

      // Apply category filter on client side
      if (categoryFilter) {
        filteredDocuments = filteredDocuments.filter((doc) => {
          if (doc.categories && doc.categories.length > 0) {
            try {
              const docCategories = JSON.parse(doc.categories[0]);
              return (
                Array.isArray(docCategories) &&
                docCategories.includes(categoryFilter)
              );
            } catch (e) {
              console.error("Error parsing categories:", e);
              return false;
            }
          }
          return false;
        });
      }

      setDocuments(filteredDocuments);
      setTotalPages(Math.ceil(response.data.totalDocuments / 8));

    } catch (error) {
      console.error("Error fetching documents:", error);
      setError("Failed to fetch documents. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [
    searchTerm,
    visibilityFilter,
    sortBy,
    sortOrder,
    currentPage,
    categoryFilter,
  ]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/documents/stats`,
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  const fetchFamilies = useCallback(async () => {
    setFamiliesLoading(true);
    setFamiliesError(null);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/documents/families`,
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      setAvailableFamilies(response.data);
    } catch (error) {
      console.error("Error fetching families:", error);
      setFamiliesError("Failed to fetch families. Please try again.");
    } finally {
      setFamiliesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeView === "documents") {
      fetchDocuments();
      fetchStats();
      fetchFamilies();
    }
  }, [activeView, fetchDocuments, fetchStats, fetchFamilies]);

  const handleCreateDocument = async (e, newDocument, setUploadProgress) => {
    e.preventDefault();
    let toastId;
  
    try {
      const formData = new FormData();
      Object.keys(newDocument).forEach((key) => {
        if (key === "categories") {
          formData.append(key, JSON.stringify(newDocument[key]));
        } else if (key === "file") {
          formData.append("file", newDocument.file);
        } else {
          formData.append(key, newDocument[key]);
        }
      });
  
      toastId = toast.loading('Preparing to upload...', {
        position: 'top-center',
      });
  
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/documents/upload-single`,
        formData,
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
            toast.loading(`Uploading: ${percentCompleted}%`, { id: toastId });
          },
        }
      );
  
      toast.success('Document created successfully!', {
        id: toastId,
        duration: 3000,
      });
  
      fetchDocuments();
      fetchStats();
      
      // Reset upload progress
      setUploadProgress(0);
  
      return response.data; // You might want to return the created document data
    } catch (error) {
      console.error("Error creating document:", error);
      
      let errorMessage = 'Failed to create document. Please try again.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
  
      toast.error(errorMessage, {
        id: toastId,
        duration: 4000,
      });
  
      // Reset upload progress
      setUploadProgress(0);
  
      throw error; // Re-throw the error so it can be caught by the component if needed
    }
  };

  const handleEditDocument = (document) => {
    setEditingDocument(document);
  };

  const handleUpdateDocument = async (updatedDocument) => {
    try {
      console.log("Updating document:", updatedDocument);
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/documents/files/${updatedDocument._id}`,
        updatedDocument,
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      console.log("Update response:", response.data);

      // Display success toast
      toast.success("Document updated successfully!", {
        duration: 3000,
        position: "top-center",
      });

      setEditingDocument(null);
      fetchDocuments();
      fetchStats();
    } catch (error) {
      console.error("Error updating document:", error);

      // Display error toast
      let errorMessage = "Failed to update document. Please try again.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-right",
      });

      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      throw error; // Re-throw the error so it can be caught in the modal
    }
  };

  const handleDeleteDocument = async (id) => {
    const confirmDelete = () => new Promise((resolve) => {
      toast((t) => (
        <div>
          <p>Are you sure you want to delete this document?</p>
          <div className="mt-2 flex justify-end space-x-2">
            <button
              className="px-2 py-1 bg-red-500 text-white rounded"
              onClick={() => {
                resolve(true);
                toast.dismiss(t.id);
              }}
            >
              Delete
            </button>
            <button
              className="px-2 py-1 bg-gray-300 rounded"
              onClick={() => {
                resolve(false);
                toast.dismiss(t.id);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ), { duration: Infinity });
    });
  
    const shouldDelete = await confirmDelete();
  
    if (shouldDelete) {
      try {
        await toast.promise(
          axios.delete(
            `${process.env.REACT_APP_BACKEND_URL}/documents/files/${id}`,
            {
              headers: { "x-auth-token": localStorage.getItem("token") },
            }
          ),
          {
            loading: 'Deleting document...',
            success: 'Document deleted successfully!',
            error: 'Failed to delete document',
          },
          {
            duration: 3000,
            position: 'top-center',
          }
        );
  
        fetchDocuments();
        fetchStats();
      } catch (error) {
        console.error("Error deleting document:", error);
        let errorMessage = 'Failed to delete document. Please try again.';
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        toast.error(errorMessage, {
          duration: 4000,
          position: 'top-right',
        });
      }
    }
  };

  const sidebarItems = [
    { id: "home", icon: Home, label: "Dashboard" },
    { id: "documents", icon: FileText, label: "Documents" },
    { id: "requests", icon: FileQuestion, label: "Document Requests" },
    { id: "users", icon: UsersIcon, label: "Users" },
    { id: "announcements", icon: Megaphone, label: "Announcements" },
    { id: "upcoming-events", icon: Calendar, label: "Upcoming Events" },
    { id: "maps", icon: Map, label: "Maps" },
    { id: "audit", icon: Book, label: "Audit Log" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  const renderView = () => {
    switch (activeView) {
      case "home":
        return <WelcomeScreen userName={authState.user.firstname} />;
      case "documents":
        return (
          <div className="space-y-6">
            <DocumentStats stats={stats} />
            <SearchAndFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              visibilityFilter={visibilityFilter}
              setVisibilityFilter={setVisibilityFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              availableCategories={availableCategories}
            />
            <DocumentList
              documents={documents}
              loading={loading}
              error={error}
              handleEditDocument={handleEditDocument}
              handleDeleteDocument={handleDeleteDocument}
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Create New Document
            </button>
            <CreateDocumentForm
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              handleCreateDocument={handleCreateDocument}
            />
            {editingDocument && (
              <EditDocumentModal
                editingDocument={editingDocument}
                setEditingDocument={setEditingDocument}
                handleUpdateDocument={handleUpdateDocument}
                availableCategories={availableCategories}
                availableFamilies={availableFamilies}
                familiesLoading={familiesLoading}
                familiesError={familiesError}
              />
            )}
          </div>
        );
      case "users":
        return <Users />;
      case "requests":
        return <Requests />;
      case "announcements":
        return <News />;
        case "upcoming-events":
          return <UpcomingEvents />;
      case "audit":
        return <AuditLog />;
      case "maps":
        return (
          <div className="text-xl font-semibold text-gray-800">
            Maps Component (Under Development)
          </div>
        );
      case "settings":
        return (
          <div className="text-xl font-semibold text-gray-800">
            Settings Component (Under Development)
          </div>
        );
      default:
        return (
          <div className="text-xl font-semibold text-gray-800">
            Select a view from the sidebar
          </div>
        );
    }
  };

  return (
    <div className="flex mt-16 flex-col h-screen bg-gray-100">
      {/* Top bar */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden mr-4"
          >
            <Menu size={24} className="text-gray-600" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            Repository Manager
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
          <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200">
            <Bell size={18} className="text-gray-600" />
          </button>
          <div className="flex items-center space-x-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {authState.user.firstname[0].toUpperCase()}
            </div>
            <div className="hidden md:block">
              <span className="text-sm font-medium text-gray-700">{`${authState.user.firstname} ${authState.user.lastname}`}</span>
              <p className="text-xs text-gray-500">{authState.user.role}</p>
            </div>
            <ChevronDown
              size={16}
              className="text-gray-500 group-hover:text-gray-700 hidden md:block"
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-lg w-64 flex-shrink-0 overflow-y-auto fixed inset-y-0 left-0 z-20 lg:relative lg:translate-x-0"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-2">
                  <img
                    src="/logo.png"
                    alt="NLC Logo"
                    className="h-8 w-auto object-contain"
                  />
                  <span className="text-lg font-semibold text-gray-800 hidden md:inline">
                    Admin Portal
                  </span>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>
              <nav className="mt-6">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id);
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={`flex items-center w-full p-3 transition-colors duration-200 
                      ${
                        activeView === item.id
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <item.icon size={20} className="mr-3" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                ))}
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <motion.div
            key={activeView}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto"
          >
            {renderView()}
          </motion.div>
        </main>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;
