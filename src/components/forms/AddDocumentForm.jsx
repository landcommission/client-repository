import React, { useState } from "react";
import { Link } from "react-router-dom";
import AccessDenied from "../login/AccessDenied";
import SingleFileUpload from "./SingleFileUpload";
import BulkFileUpload from "./BulkFileUpload";

const AddDocumentForm = ({ currentUser }) => {
  const [bulkUpload, setBulkUpload] = useState(false);

  const handleUploadOptionChange = (event) => {
    setBulkUpload(event.target.value === "bulk");
  };

  return currentUser && currentUser.role === "admin" ? (
    <div className="container mx-auto px-4 md:px-8 lg:px-12">
      <div className="pt-16 mx-auto max-w-screen-md">
        <div className="text-center mb-8">
          <h2 className="text-4xl xl:text-6xl font-extrabold text-gray-900 mx-auto max-w-lg">
            Add Document
          </h2>
        </div>

        <div className="flex items-center mb-4">
          <span className="text-lg font-semibold mr-4">Upload Option:</span>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              value="single"
              checked={!bulkUpload}
              onChange={handleUploadOptionChange}
              className="mr-1"
            />
            Single
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="bulk"
              checked={bulkUpload}
              onChange={handleUploadOptionChange}
              className="mr-1"
            />
            Bulk
          </label>
        </div>

        {bulkUpload ? (
          <BulkFileUpload currentUser={currentUser} />
        ) : (
          <SingleFileUpload currentUser={currentUser} />
        )}

        <div className="p-2 text-center mt-4">
          <p>
            Click{" "}
            <Link to="/allfiles" className="underline text-blue-800">
              Here
            </Link>{" "}
            to view all uploaded files
          </p>
        </div>
      </div>
    </div>
  ) : (
    <AccessDenied />
  );
};

export default AddDocumentForm;