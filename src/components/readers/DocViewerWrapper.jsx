import React from "react";
import DocViewer from "@cyntler/react-doc-viewer";

const DocViewerWrapper = ({ documentUrl }) => {
  const getFileExtension = (filename) => {
    return filename.split(".").pop().toLowerCase();
  };

  const renderViewer = (url, fileType) => {
    switch (fileType) {
      case "pdf":
      case "doc":
      case "docx":
      case "htm":
      case "html":
      case "ppt":
      case "pptx":
      case "txt":
      case "xls":
      case "xlsx":
        return (
          <DocViewer
            documents={[{ uri: url }]}
            className="shadow rounded-xl h-full w-full overflow-hidden"
          />
        );
      case "jpg":
      case "jpeg":
      case "png":
      case "bmp":
      case "tiff":
        return (
          <div className="w-full h-full flex justify-center items-center bg-gray-100">
            <img src={url} alt="Document" className="max-h-full max-w-full" />
          </div>
        );
      default:
        return (
          <div className="w-full h-full flex justify-center items-center bg-gray-100">
            <p className="text-lg text-gray-600">
              Sorry, this file type is not supported for preview.
            </p>
          </div>
        );
    }
  };

  const fileExtension = getFileExtension(documentUrl);
  return renderViewer(documentUrl, fileExtension);
};

export default DocViewerWrapper;
