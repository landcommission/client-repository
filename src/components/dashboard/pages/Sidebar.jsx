import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaUser, FaHome, FaFileAlt, FaPlus, FaSearch } from 'react-icons/fa'; // Importing necessary icons

const Sidebar = ({ currentUser, toggleAuditLogModal }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { lastname, email } = currentUser;
        const response = await axios.get('http://localhost:5000/auth/profile', {
          params: { lastname, email },
          // Include currentUser information in the request headers
    headers: {
      _id: currentUser._id,
      email: currentUser.email
    }
        });
        setProfileData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }      

    fetchProfileData();
  }, [currentUser]);

  return (
    <div className="hidden lg:flex">
      <div className="flex flex-col h-screen p-3 bg-gray-800 shadow w-60">
        <div className="space-y-8 flex flex-col">
          {/* Search Field */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch className="w-6 h-6 text-gray-400" />
            </span>
            <input
              type="search"
              name="Search"
              placeholder="Search..."
              className="w-full py-2 pl-10 pr-3 text-sm rounded-full bg-gray-700 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          {/* User Profile Section */}
          <div>
            {profileData && (
              <div className="flex items-center">
                <div className="bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center text-gray-800">
                  <FaUser className="w-6 h-6" /> {/* Using FaUser component for the user icon */}
                </div>
                <div className="ml-3">
                  <p className="text-sm text-white font-semibold tracking-tight">{profileData.firstname} {profileData.lastname}</p>
                  <p className="text-xs text-gray-300">{profileData.email}</p>
                  <p className="text-xs text-red-600">{profileData.role}</p>
                </div>
              </div>
            )}
          </div>

          {/* Links Section */}
          <div>
            <ul className="pt-2 space-y-1 text-sm">
              <li className="rounded-sm">
                <Link
                  to="#"
                  className="flex items-center p-2 space-x-3 rounded-md"
                >
                  <FaHome className="w-6 h-6 text-gray-100" />
                  <span className="text-gray-100 font-semibold hover:underline hover:text-blue-600">Home</span>
                </Link>
              </li>
              {/* Add Link for All Files */}
              <li className="rounded-sm">
                <Link
                  to="/allfiles"
                  className="flex items-center p-2 space-x-3 rounded-md"
                >
                  <FaFileAlt className="w-6 h-6 text-gray-100" />
                  <span className="text-gray-100 font-semibold hover:underline hover:text-blue-600">
                    All Files
                  </span>
                </Link>
              </li>
              {/* Add Link for Add Document */}
              <li className="rounded-sm">
                <Link
                  to="/adddocumentform"
                  className="flex items-center p-2 space-x-3 rounded-md"
                >
                  <FaPlus className="w-6 h-6 text-gray-100" />
                  <span className="text-gray-100 font-semibold hover:underline hover:text-blue-600">
                    Add Document
                  </span>
                </Link>
              </li>
              {/* Add Link for Audit Log */}
              <li className="rounded-sm">
                <button
                  onClick={toggleAuditLogModal}
                  className="flex items-center p-2 space-x-3 rounded-md cursor-pointer"
                >
                  <FaSearch className="w-6 h-6 text-gray-100" />
                  <span className="text-gray-100 font-semibold hover:underline hover:text-blue-600">
                    View Audit Log
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
