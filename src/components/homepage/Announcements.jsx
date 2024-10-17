import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { AlertTriangle, Bell, ChevronRight, Calendar, Loader, User, ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Custom plugin to handle advanced styling
const AdvancedStyling = {
  init(editor) {
    editor.conversion.for('downcast').add(dispatcher => {
      dispatcher.on('attribute:style', (evt, data, conversionApi) => {
        const viewWriter = conversionApi.writer;
        const element = conversionApi.mapper.toViewElement(data.item);
        
        if (element) {
          viewWriter.setStyle(data.attributeNewValue, element);
        }
      });
    });
  }
};

const Announcements = () => {
  const [announcementsData, setAnnouncementsData] = useState({
    announcements: [],
    currentPage: 1,
    totalAnnouncements: 0,
    totalPages: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedAnnouncements, setExpandedAnnouncements] = useState({});

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/documents/announcements`, {
        params: { category: 'general', isActive: true, limit: 3, page: currentPage }
      });
      setAnnouncementsData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setError('Failed to load announcements. Please try again later.');
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'urgent': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < announcementsData.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const sanitizeHTML = (html) => {
    return {
      __html: DOMPurify.sanitize(html, {
        ADD_TAGS: ['iframe'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
      })
    };
  };

  const toggleAnnouncementExpansion = (id) => {
    setExpandedAnnouncements(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderAnnouncementContent = (announcement) => {
    const isExpanded = expandedAnnouncements[announcement._id];
    const contentElement = document.createElement('div');
    contentElement.innerHTML = announcement.content;
    const contentText = contentElement.textContent || contentElement.innerText;
    const isTooLong = contentText.length > 200;

    return (
      <>
        <div
          className={`text-xs text-gray-600 mb-2 prose prose-sm max-w-none overflow-hidden ${isExpanded ? '' : 'max-h-24'}
            [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800
            [&_ol]:pl-5 [&_ol]:list-decimal [&_ol>li]:pl-1 [&_ol>li]:mb-1
            [&_ul]:pl-5 [&_ul]:list-disc [&_ul>li]:pl-1 [&_ul>li]:mb-1`}
          dangerouslySetInnerHTML={sanitizeHTML(announcement.content)}
        />
        {isTooLong && (
          <button
            onClick={() => toggleAnnouncementExpansion(announcement._id)}
            className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center"
          >
            {isExpanded ? (
              <>
                See less
                <ChevronUp size={14} className="ml-1" />
              </>
            ) : (
              <>
                See more
                <ChevronDown size={14} className="ml-1" />
              </>
            )}
          </button>
        )}
      </>
    );
  };

  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center justify-center">
        <Loader size={24} className="animate-spin text-gray-600 mb-2" />
        <span className="text-xs font-medium text-gray-600">Loading announcements...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center justify-center">
        <AlertTriangle size={24} className="text-red-500 mb-2" />
        <span className="text-xs font-medium text-gray-600">{error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gray-100 p-4 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">NLC Announcements</h2>
        <Bell size={18} className="text-gray-600" />
      </div>
      <div className="p-4">
        {announcementsData.announcements.length > 0 && (
          <div className="mb-6 border-b pb-4 ">
            <div className="flex items-center mb-2">
              <div className="w-12 h-12 rounded-full bg-none flex items-center justify-center mr-3 flex-shrink-0 overflow-hidden">
                <img src="logo.png" alt="NLC Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-800">{announcementsData.announcements[0].title}</h3>
                <p className="text-xs text-gray-600">
                  By {announcementsData.announcements[0].createdBy.firstname} {announcementsData.announcements[0].createdBy.lastname}
                </p>
              </div>
            </div>
            {renderAnnouncementContent(announcementsData.announcements[0])}
            <div className="flex items-center text-xs text-gray-500 space-x-2">
              <span className="flex items-center">
                <Calendar size={12} className="mr-1" />
                {new Date(announcementsData.announcements[0].startDate).toLocaleDateString()}
              </span>
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getPriorityStyle(announcementsData.announcements[0].priority)}`}>
                {announcementsData.announcements[0].priority}
              </span>
              {announcementsData.announcements[0].isCurrent && (
                <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
                  Current
                </span>
              )}
            </div>
          </div>
        )}
        <div className="space-y-3">
          {announcementsData.announcements.slice(1).map((announcement) => (
            <div key={announcement._id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 mt-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getPriorityStyle(announcement.priority)} overflow-hidden`}>
                  <img src="logo.png" alt="NLC Logo" className="w-full h-full bg-none object-cover" />
                </div>
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="font-semibold text-xs text-gray-800 truncate">{announcement.title}</h4>
                {renderAnnouncementContent(announcement)}
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <User size={10} className="mr-1" />
                  <span className="truncate">{announcement.createdBy.firstname} {announcement.createdBy.lastname}</span>
                  {announcement.isCurrent && (
                    <span className="ml-1 bg-green-100 text-green-800 px-1 py-0.5 rounded text-xs">
                      Current
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight size={14} className="text-gray-400 flex-shrink-0 mt-1" />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Page {announcementsData.currentPage} of {announcementsData.totalPages} • {announcementsData.totalAnnouncements} announcements
        </span>
        <div className="flex space-x-2">
          <button 
            onClick={handlePrevPage} 
            disabled={currentPage === 1}
            className={`p-1 rounded ${currentPage === 1 ? 'text-gray-400' : 'text-gray-600 hover:bg-gray-200'}`}
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={handleNextPage} 
            disabled={currentPage === announcementsData.totalPages}
            className={`p-1 rounded ${currentPage === announcementsData.totalPages ? 'text-gray-400' : 'text-gray-600 hover:bg-gray-200'}`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Announcements;