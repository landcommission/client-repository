import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { RingLoader } from "react-spinners";
import { IoCloudUploadSharp } from "react-icons/io5";
import { MdOutlineDelete } from "react-icons/md";

const { REACT_APP_BACKEND_URL } = process.env;

const SingleFileUpload = ({ currentUser }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [publisher, setPublisher] = useState("");
  const [family, setFamily] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFileInfo, setSelectedFileInfo] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tags, setTags] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [categories, setCategories] = useState([]);
  const [accessPermissions, setAccessPermissions] = useState("read");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    updateSelectedFileInfo(selectedFile);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const droppedFile = event.dataTransfer.files[0];
    setFile(droppedFile);
    updateSelectedFileInfo(droppedFile);
  };

  const updateSelectedFileInfo = (file) => {
    if (file) {
      setSelectedFileInfo(`${file.name} (${file.type}, ${file.size} bytes)`);
    } else {
      setSelectedFileInfo("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      if (!title || !description || !file || !author || !publicationDate || !publisher || !family) {
        throw new Error("Please fill in all required fields and select a file.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("tags", tags);
      formData.append("visibility", visibility);
      formData.append("categories", JSON.stringify(categories));
      formData.append("accessPermissions", accessPermissions);
      formData.append("author", author);
      formData.append("publicationDate", publicationDate);
      formData.append("publisher", publisher);
      formData.append("family", family);

      const config = {
        headers: {
          _id: currentUser._id,
          email: currentUser.email,
          role: currentUser.role,
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percent = Math.floor((loaded * 100) / total);
          setUploadProgress(percent);
        },
      };

      const response = await axios.post(
        `${REACT_APP_BACKEND_URL}/documents/upload-single`,
        formData,
        config
      );

      resetForm();
      setLoading(false);
      toast.success(response.data.message);
    } catch (error) {
      handleError(error);
    }
  };

  const resetForm = () => {
    setFile(null);
    setTitle("");
    setDescription("");
    setTags("");
    setVisibility("public");
    setCategories([]);
    setAccessPermissions("read");
    setSelectedFileInfo("");
    setAuthor("");
    setPublicationDate("");
    setPublisher("");
    setFamily("");
    setUploadProgress(0);
  };

  const handleError = (error) => {
    if (error.response) {
      toast.error(error.response.data.message);
    } else {
      setErrorMessage("Failed to upload document");
    }
    console.error("Error uploading document:", error);
    setLoading(false);
  };

  const handleDeleteFile = (event) => {
    event.preventDefault();
    setFile(null);
    setSelectedFileInfo("");
    setUploadProgress(0);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      <div className="md:col-span-2">
        <label className="block text-sm font-semibold mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-solid border-gray-700 placeholder-gray-600 text-sm focus:outline-none focus:border-gray-500 focus:bg-white mt-2"
          placeholder="File title here..."
          required
        />
      </div>
      <div className="md:col-span-2">
        <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-gray-400">Description</label>
        <textarea
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-solid border-gray-700 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Write file description here..."
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Tags</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-700 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-2"
          placeholder="Enter tags separated by commas..."
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Category</label>
        <select
          value={categories.length > 0 ? categories[0] : ""}
          onChange={(e) => setCategories([e.target.value])}
          className="bg-gray-300 text-gray-700 font-semibold mt-2 py-4 px-4 rounded inline-flex items-center w-full"
        >
          <option value="">Select a category</option>
          <option value="Publications">Publications</option>
          <option value="Litigations">Litigations</option>
          <option value="Historical Land Injustices">Historical Land Injustices</option>
          <option value="Review of Grants">Review of Grants</option>
          <option value="Journals and Papers">Journals and Papers</option>
          <option value="NLC Advisories">NLC Advisories</option>
          <option value="Poicies and Laws">Policies and Laws</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Visibility:</label>
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="bg-gray-300 text-gray-700 font-semibold py-4 px-4 rounded inline-flex items-center w-full"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="internal">Internal</option>
          <option value="restricted">Restricted</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Access Permissions</label>
        <select
          value={accessPermissions}
          onChange={(e) => setAccessPermissions(e.target.value)}
          className="bg-gray-300 text-gray-700 font-semibold py-4 px-4 rounded inline-flex items-center w-full"
        >
          <option value="read">Read</option>
          <option value="write">Write</option>
          <option value="readwrite">Read/Write</option>
          <option value="none">None</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Author</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-700 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-2"
          placeholder="Author's name..."
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Publication Date</label>
        <input
          type="date"
          value={publicationDate}
          onChange={(e) => setPublicationDate(e.target.value)}
          className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-700 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Publisher</label>
        <input
          type="text"
          value={publisher}
          onChange={(e) => setPublisher(e.target.value)}
          className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-700 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-2"
          placeholder="Publisher's name..."
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Family</label>
        <select
          value={family}
          onChange={(e) => setFamily(e.target.value)}
          className="bg-gray-300 text-gray-700 font-semibold mt-2 py-4 px-4 rounded inline-flex items-center w-full"
          required
        >
          <option value="">Select family...</option>
          <option value="Land Governance and Administration">Land Governance and Administration</option>
          <option value="Natural Resources Management">Natural Resources Management</option>
          <option value="Land Planning">Land Planning</option>
          <option value="Land Rights">Land Rights</option>
          <option value="Land Laws and Policies">Land Laws and Policies</option>
          <option value="Historical Land Injustices">Historical Land Injustices</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <div
          className="mb-4"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{ cursor: "pointer" }}
        >
          <div className="mx-auto max-w-xs">
            <label
              htmlFor="fileInput"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              <div className="items-center text-center">
                <p className="text-sm text-gray-500 font-semibold">
                  Click to upload or drag and drop
                </p>
              </div>
            </label>
            <label
              className="flex w-full cursor-pointer appearance-none items-center justify-center rounded-md border-2 border-dashed border-gray-600 p-6 transition-all hover:border-primary-300"
              htmlFor="fileInput"
            >
              <div className="space-y-1 text-center">
                <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <IoCloudUploadSharp size={24} />
                </div>
                <p className="text-xs text-gray-500">Select a file</p>
              </div>
            </label>
            <input
              id="fileInput"
              type="file"
              className="sr-only"
              onChange={handleFileChange}
            />
          </div>
          {selectedFileInfo && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Selected File:
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-700">{selectedFileInfo}</span>
                <button
                  onClick={handleDeleteFile}
                  className="ml-2 text-gray-500 hover:text-red-500 focus:outline-none"
                >
                  <MdOutlineDelete className="text-gray-950 hover:text-red-600" />
                </button>
              </div>
              {uploadProgress > 0 && (
                <progress
                  value={uploadProgress}
                  max="100"
                  className="mt-2 h-2 w-full bg-green-300 rounded-md"
                />
              )}
            </div>
          )}
        </div>
        {errorMessage && (
          <div className="text-red-500 mb-4">{errorMessage}</div>
        )}
      </div>
      <div className="md:col-span-2">
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-300 ease-in-out hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? (
            <RingLoader color={"#fff"} loading={loading} size={24} />
          ) : (
            "Upload"
          )}
        </button>
      </div>
    </form>
  );
};

export default SingleFileUpload;