import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { RingLoader } from "react-spinners";
import { IoCloudUploadSharp } from "react-icons/io5";
import { MdOutlineDelete } from "react-icons/md";

const { REACT_APP_BACKEND_URL } = process.env;

const BulkFileUpload = ({ currentUser }) => {
  const [files, setFiles] = useState([]);
  const [author, setAuthor] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [publisher, setPublisher] = useState("");
  const [family, setFamily] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFilesInfo, setSelectedFilesInfo] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [tags, setTags] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [categories, setCategories] = useState([]);
  const [accessPermissions, setAccessPermissions] = useState("read");

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);

    if (selectedFiles.length > 10) {
      toast.error(
        "Oops! You can only upload up to 10 files at once. Please select fewer files."
      );
      return;
    }

    setFiles(selectedFiles);
    updateSelectedFilesInfo(selectedFiles);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const droppedFiles = Array.from(event.dataTransfer.files);
    if (droppedFiles.length > 10) {
      toast.error(
        "Oops! You can only upload up to 10 files at once. Please select fewer files."
      );
      return;
    }
    setFiles(droppedFiles);
    updateSelectedFilesInfo(droppedFiles);
  };

  const updateSelectedFilesInfo = (fileList) => {
    const filesInfo = fileList.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size
    }));
    setSelectedFilesInfo(filesInfo);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      if (
        !files.length ||
        !tags ||
        !visibility ||
        !categories.length ||
        !accessPermissions ||
        !author ||
        !publicationDate ||
        !publisher ||
        !family
      ) {
        throw new Error("Please fill in all required fields.");
      }

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
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
          setUploadProgress((prevProgress) => ({
            ...prevProgress,
            total: percent,
          }));
        },
      };

      const response = await axios.post(
        `${REACT_APP_BACKEND_URL}/documents/upload-bulk`,
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
    setFiles([]);
    setTags("");
    setVisibility("public");
    setCategories([]);
    setAccessPermissions("read");
    setSelectedFilesInfo([]);
    setAuthor("");
    setPublicationDate("");
    setPublisher("");
    setFamily("");
    setUploadProgress({});
  };

  const handleError = (error) => {
    if (error.response) {
      toast.error(error.response.data.message);
    } else {
      setErrorMessage("Failed to upload documents");
    }
    console.error("Error uploading documents:", error);
    setLoading(false);
  };

  const handleDeleteFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    updateSelectedFilesInfo(updatedFiles);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      <div>
        <label className="block text-sm font-semibold mb-1">Tags</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-700 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-2"
          placeholder="Enter tags separated by commas..."
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Category</label>
        <select
          value={categories.length > 0 ? categories[0] : ""}
          onChange={(e) => setCategories([e.target.value])}
          className="bg-gray-300 text-gray-700 font-semibold mt-2 py-4 px-4 rounded inline-flex items-center w-full"
          required
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
          required
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
          required
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
                <p className="text-xs text-gray-500">Select up to 10 files</p>
              </div>
            </label>
            <input
              id="fileInput"
              type="file"
              className="sr-only"
              onChange={handleFileChange}
              multiple
            />
          </div>
          {selectedFilesInfo.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Selected Files:
              </p>
              <ul className="list-disc pl-5">
                {selectedFilesInfo.map((file, index) => (
                    <li key={index} className="flex items-center justify-between">
                    <span className="text-xs text-slate-700">
                      {file.name} ({file.type}, {file.size} bytes)
                    </span>
                    <button
                      onClick={() => handleDeleteFile(index)}
                      className="ml-2 text-gray-500 hover:text-red-500 focus:outline-none"
                    >
                      <MdOutlineDelete className="text-gray-950 hover:text-red-600" />
                    </button>
                  </li>
                ))}
              </ul>
              {uploadProgress.total > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Total Progress:</p>
                  <progress
                    value={uploadProgress.total}
                    max="100"
                    className="w-full h-2 bg-green-300 rounded-md"
                  />
                </div>
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
            "Upload Files"
          )}
        </button>
      </div>
    </form>
  );
};

export default BulkFileUpload;