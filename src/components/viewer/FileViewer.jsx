import React, { useMemo } from 'react';
import PdfComp from './PdfComp';
import DocxViewer from './pdfcomp/DocxViewer';
import ImageViewer from './pdfcomp/ImageViewer';
import VideoViewer from './pdfcomp/VideoViewer';

const FileViewer = ({ file }) => {
  const fileType = useMemo(() => {
    if (typeof file === 'string') {
      const extension = file.split('.').pop().toLowerCase();
      switch (extension) {
        case 'pdf': return 'application/pdf';
        case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif': return 'image';
        case 'mp4':
        case 'webm':
        case 'ogg': return 'video';
        default: return null;
      }
    }
    return null;
  }, [file]);

  const renderViewer = () => {
    switch (fileType) {
      case 'application/pdf':
        return <PdfComp file={file} />;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return <DocxViewer file={file} />;
      case 'image':
        return <ImageViewer file={file} />;
      case 'video':
        return <VideoViewer file={file} />;
      default:
        return <div className="flex items-center justify-center h-full text-center p-4 text-gray-500">Unsupported file type</div>;
    }
  };

  return (
    <div className="file-viewer w-full h-full overflow-hidden">
      {renderViewer()}
    </div>
  );
};

export default FileViewer;