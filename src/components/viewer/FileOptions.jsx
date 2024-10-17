import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaLongArrowAltLeft,
  FaLongArrowAltRight,
  FaUser
} from "react-icons/fa";
import FileIcon from "./FileIcon";
import TruncatedDescription from "./TruncatedDescription";

const { REACT_APP_BACKEND_URL } = process.env;


const FileOptions = ({ currentUser }) => {
  const [files, setFiles] = useState([]);
  const [topDownloads, setTopDownloads] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRecentMore, setShowRecentMore] = useState(false);
  const [showDownloadMore, setShowDownloadMore] = useState(false);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_BACKEND_URL}/documents/recentfiles`,
        {
          headers: {
            _id: currentUser._id,
            email: currentUser.email
          }
        }
      );
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  //  Format Download Count
  function formatDownloadCount(count) {
    if (count < 1000) {
      return count.toString();
    } else if (count < 1000000) {
      return (count / 1000).toFixed(1) + 'K';
    } else {
      return (count / 1000000).toFixed(1) + 'M';
    }
  }

  const fetchTopDownloads = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_BACKEND_URL}/documents/topdownloads`,
        {
          headers: {
            _id: currentUser._id,
            email: currentUser.email
          }
        },
        { withCredentials: true }
      );
      console.log("Top downloads fetched successfully:", response.data);
      setTopDownloads(response.data);
    } catch (error) {
      console.error("Error fetching top downloads:", error);
    }
  };

  const fetchProfileData = async () => {
    try {
      const { lastname, email } = currentUser;
      setLoading(true);
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/auth/profile`, {
        params: { lastname, email },
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
  };

  useEffect(() => {
    fetchFiles();
    fetchTopDownloads();
    fetchProfileData();
  }, [currentUser]);

  const toggleShowRecentMore = () => {
    setShowRecentMore(!showRecentMore);
  };

  const toggleShowDownloadMore = () => {
    setShowDownloadMore(!showDownloadMore);
  };

  const renderRecentlyAddedFiles = () => {
    const sortedFiles = [...files]
      .filter(file => currentUser.role !== "public" || file.visibility !== "private" && file.visibility !== "restricted")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const recentDisplayCount = showRecentMore ? sortedFiles.length : 3;

    //  Format Download Count
    function formatDownloadCount(count) {
      if (count < 1000) {
        return count.toString();
      } else if (count < 1000000) {
        return (count / 1000).toFixed(1) + 'K';
      } else {
        return (count / 1000000).toFixed(1) + 'M';
      }
    }
    
  
    return (
      <div>
        {sortedFiles.slice(0, recentDisplayCount).map((file, index) => (
          <div key={index} className="mb-6 rounded-lg bg-white shadow-md p-6">
            <div className="flex items-center">
              <a
                href={`${REACT_APP_BACKEND_URL}/documents/${file.filename}`}
                className="text-indigo-700 hover:text-indigo-600 transition duration-300 text-lg font-semibold capitalize underline truncate"
                target="_blank"
              >
                <FileIcon filename={file.filename} />
                <span className="truncate overflow-hidden text-md">
                {file.filename}
                </span>
              </a>
            </div>
            <p className="text-sm leading-tight pt-2 text-gray-600">
              <span className="font-semibold">Description:</span>{" "}
              <TruncatedDescription description={file.description} />
            </p>
            <p className="text-xs italic pt-1 leading-3 text-gray-400">
              Uploaded at: {new Date(file.createdAt).toLocaleString()}
            </p>
            <div className="flex items-center justify-start mt-2">
              <div
                className={`text-${file.visibility === "public" ? "green" : "red"
                  }-500 bg-${file.visibility === "public" ? "green" : "red"
                  }-200 py-1 px-2 rounded text-xs leading-3`}
              >
                <span style={{ fontWeight: "bold", color: "#4B5563" }}>
                  Accessibility:
                </span>{" "}
                {file.visibility}
              </div>
            </div>
          </div>
        ))}
        {sortedFiles.length > 3 && (
          <div className="text-center">
            <button
              className="text-indigo-600 font-semibold text-sm hover:underline focus:outline-none mt-4 flex items-center"
              onClick={toggleShowRecentMore}
            >
              {showRecentMore ? (
                <>
                  <span className="mr-1">
                    <FaLongArrowAltLeft className="text-gray-950" />{" "}
                    {/* Left arrow icon */}
                  </span>
                  Show less
                </>
              ) : (
                <>
                  Show more
                  <span className="ml-1">
                    <FaLongArrowAltRight className="text-gray-950" />{" "}
                    {/* Right arrow icon */}
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  };
  
  const renderTopDownloads = () => {
    const downloadDisplayCount = showDownloadMore ? topDownloads.length : 3;

    return (
      <div className="mb-6">
        <h3 className="font-semibold text-3xl  sm:text-xl md:text-3xl text-gray-800 mb-4">
          Most Popular
        </h3>
        <div className="grid grid-cols-1 gap-6">
          {topDownloads
            .slice(0, downloadDisplayCount)
            .map((download, index) => (
              <div
                key={index}
                className="max-w-sm rounded overflow-hidden shadow-lg bg-white"
              >
                <div className="px-6 py-4">
                  <FileIcon filename={download._id} />
                  <div className="font-bold text-lg mb-2 truncate">
                    {download._id}
                  </div>
                  <p className="text-green-700 text-sm">
                    Downloads: <span className="bg-red-600 text-white rounded-full text-xs p-0.5 px-1">{formatDownloadCount(download.count)}</span>
                  </p>
                </div>
                <div className="px-4 py-1">
                  <a
                    href={`${REACT_APP_BACKEND_URL}/documents/${download._id}`}
                    className="bg-indigo-700 hover:bg-indigo-600 text-white font-semibold py-1 text-xs px-2 rounded focus:outline-none inline-block mt-2 sm:mt-0  truncate"
                    download
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
        </div>
        {topDownloads.length > 3 && (
          <div className="text-center">
            <button
              className="text-indigo-600 font-semibold text-sm hover:underline focus:outline-none mt-4 flex items-center"
              onClick={toggleShowDownloadMore}
            >
              {showDownloadMore ? (
                <>
                  <span className="mr-1">
                    <FaLongArrowAltLeft className="text-gray-950" />{" "}
                    {/* Left arrow icon */}
                  </span>
                  Show less
                </>
              ) : (
                <>
                  Show more
                  <span className="ml-1">
                    <FaLongArrowAltRight className="text-gray-950" />{" "}
                    {/* Right arrow icon */}
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-100 rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-3xl text-gray-950 mb-4">
          Recently Added
        </h3>
        {renderRecentlyAddedFiles()}
      </div>
      <div className="mb-6">{renderTopDownloads()}</div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
        <div className="mx-auto mb-4" style={{ width: "100px" }}>
          <div className="bg-gray-300 w-24 h-24 flex items-center justify-center rounded-full overflow-hidden mx-auto">
          <img src='/images/nerd.png' alt="Book Reader" className="cursor-pointer w-20 h-20" />
          </div>
        </div>
        {profileData ? (
          <div>
            <h3 className="text-lg font-semibold tracking-tighter text-gray-900">
              {profileData.firstname} {profileData.lastname}
            </h3>
            <div className="flex items-center justify-center text-gray-500 text-sm mb-2">
              <FaEnvelope className="mr-2 h-4 w-4 text-red-500" />
              <p className="text-green-700">{profileData.email}</p>
            </div>
            <div className="flex items-center justify-center text-gray-500 text-sm">
              <FaUser className="mr-1  h-4 w-4" />
              <p>{profileData.role}</p>
            </div>
          </div>
        ) : loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
          <p className="text-sm text-red-600">Failed to load user data</p>
        )}
        <div className="mt-4">
          <a
            href="#"
            className="text-xs text-indigo-500 italic hover:underline hover:text-indigo-600 font-medium"
          >
            View Profile
          </a>
        </div>
      </div>
    </div>
  );
};

export default FileOptions;
