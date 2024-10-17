import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BsSearch, BsX } from "react-icons/bs";
import io from "socket.io-client"; // Import Socket.IO client

const { REACT_APP_BACKEND_URL } = process.env;

const FileSharing = ({ filename, onClose, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [fileShared, setFileShared] = useState(false);
  const [multipleRecipients, setMultipleRecipients] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [notifications, setNotifications] = useState([]); // State for real-time notifications
  const [socket, setSocket] = useState(null); // State for WebSocket connection

  useEffect(() => {
    // Establish WebSocket connection when the component mounts
    const newSocket = io(`${REACT_APP_BACKEND_URL}`); // Replace with your WebSocket server URL
    setSocket(newSocket);

    // Clean up WebSocket connection when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Listen for file shared event from the server
    if (socket) {
      socket.on("fileShared", (data) => {
        // Update UI when a file is shared
        toast.success(`File shared successfully with ${data.recipients.join(", ")}`);
        setFileShared(true);
        // Add notification to state
        setNotifications(prevNotifications => [...prevNotifications, {
          message: `File shared with ${data.recipients.join(", ")}`,
          timestamp: new Date().toISOString()
        }]);
      });
    }
  }, [socket]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/auth/users`,
        {
          headers: {
            _id: currentUser._id,
            email: currentUser.email
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectUser = (user) => {
    if (!multipleRecipients) {
      setSelectedUser(user);
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchTerm("");
  };

  const handleClearUser = () => {
    setSelectedUser(null);
    setSelectedUsers([]);
  };

  const handleShare = async () => {
    let recipients = [];
    if (!multipleRecipients && selectedUser) {
      recipients = [selectedUser.email];
    } else if (selectedUsers.length > 0) {
      recipients = selectedUsers.map((user) => user.email);
    } else {
      toast.error("Please select at least one user");
      return;
    }

    setLoading(true);
    try {
      const { email, lastname } = currentUser;
      await axios.post(`${REACT_APP_BACKEND_URL}/documents/${filename}/share`, {
        emails: recipients,
        senderName: `${lastname}`,
        message: customMessage
      },
      {
        headers: {
          _id: currentUser._id,
          email: currentUser.email
        }
      }
    );
      toast.success(`File shared successfully with ${recipients.join(", ")}`);
      setSelectedUser(null);
      setSelectedUsers([]);
      setFileShared(true);
    } catch (error) {
      console.error("Error sharing file:", error);
      toast.error(`Failed to share file: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (fileShared) {
    return null;
  }

  return (
    <div className="border shadow-xl mr-4 border-gray-300 p-4 rounded-lg mb-4 relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Share File</h3>
        <BsX className="text-gray-400 cursor-pointer" onClick={onClose} />
      </div>
      <div className="flex items-center mb-4">
        <label className="mr-4 text-sm font-semibold">
          <input
            type="radio"
            checked={!multipleRecipients}
            onChange={() => setMultipleRecipients(false)}
            className="mr-1"
          />
          Single Recipient
        </label>
        <label className=" text-sm font-semibold ml-2">
          <input
            type="radio"
            checked={multipleRecipients}
            onChange={() => setMultipleRecipients(true)}
            className="mr-1"
          />
          Multiple Recipients
        </label>
      </div>
      <div className="relative flex items-center">
        <BsSearch className="absolute top-3 left-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search by email or select a user"
          value={searchTerm}
          onChange={handleSearch}
          className="border border-gray-300 rounded-full text-sm p-2 mb-2 w-full pl-10 pr-8 focus:outline-none focus:border-blue-500"
        />
      </div>
      <ul
        className="bg-white border text-sm border-gray-300 w-full mt-1 rounded-b max-h-48 overflow-y-auto shadow-md"
        style={{ display: searchTerm && users.length ? "block" : "none" }}
      >
        {users
          .filter((user) =>
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((user) => (
            <li
              key={user._id}
              onClick={() => handleSelectUser(user)}
              className={`cursor-pointer p-2 hover:bg-gray-100 ${
                selectedUser && selectedUser._id === user._id
                  ? "bg-blue-100"
                  : ""
              }`}
            >
              {user.email}
            </li>
          ))}
        {users.length > 0 &&
          users.filter((user) => user.email === searchTerm).length === 0 && (
            <li className="p-2 text-gray-500">No matching user found</li>
          )}
      </ul>
      {multipleRecipients && (
        <div className="flex flex-wrap mt-2">
          {selectedUsers.map((user) => (
            <div
              key={user._id}
              className="bg-blue-100 text-blue-500 px-2 py-1 text-xs rounded-full mr-2 mb-2 flex items-center"
            >
              <span>{user.email}</span>
              <BsX
                className="ml-2 cursor-pointer"
                onClick={() =>
                  setSelectedUsers(
                    selectedUsers.filter((u) => u._id !== user._id)
                  )
                }
              />
            </div>
          ))}
        </div>
      )}
      {selectedUser && !multipleRecipients && (
        <div className="mt-2">
          <div className="bg-blue-100 text-blue-500 px-2 py-1 rounded-full mr-2 mb-2 flex items-center">
            <span>{selectedUser.email}</span>
            <BsX
              className="ml-2 cursor-pointer"
              onClick={() => setSelectedUser(null)}
            />
          </div>
        </div>
      )}
      {/* Custom message input field */}
      <div className="mt-4">
        <textarea
          placeholder="Type your custom message here..."
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full text-sm resize-none focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mt-2">
        <button
          onClick={handleShare}
          disabled={
            (multipleRecipients && selectedUsers.length === 0) ||
            (!multipleRecipients && !selectedUser) ||
            loading
          }
          className="bg-blue-500 text-white px-4 py-1 rounded-full"
        >
          {loading ? "Sharing..." : "Share"}
        </button>
      </div>
      {/* Real-time notifications */}
      <div className="mt-4">
        <h4 className="text-lg font-semibold mb-2">Real-time Notifications</h4>
        {notifications.map((notification, index) => (
          <div key={index} className="mb-2">
            <p className="text-sm">{notification.message}</p>
            <p className="text-xs text-gray-500">{notification.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
    
  );
};

export default FileSharing;
