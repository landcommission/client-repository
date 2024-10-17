import { useEffect, useState } from "react";
import { AiOutlineFileText, AiOutlineFilePdf, AiOutlineFileWord, AiOutlineFileExcel, AiOutlineFilePpt } from "react-icons/ai";
import { BsFileEarmarkImage, BsFileEarmarkPdf, BsFileEarmarkWord, BsFileEarmarkExcel, BsFileEarmarkPpt } from "react-icons/bs";

const FileIcon = ({ filename }) => {
  const [extension, setExtension] = useState("");

  // Extracting the file extension
  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };

  // Mapping file extensions to corresponding icons
  const iconMap = {
    txt: <AiOutlineFileText size={36} color="#007ACC" />,
    pdf: <AiOutlineFilePdf size={36} color="#FF0000" />,
    doc: <AiOutlineFileWord size={36} color="#2B579A" />,
    docx: <AiOutlineFileWord size={36} color="#2B579A" />,
    xls: <AiOutlineFileExcel size={36} color="#217346" />,
    xlsx: <AiOutlineFileExcel size={36} color="#217346" />,
    ppt: <AiOutlineFilePpt size={36} color="#B7472A" />,
    pptx: <AiOutlineFilePpt size={36} color="#B7472A" />,
    jpg: <BsFileEarmarkImage size={36} color="#FF5733" />,
    jpeg: <BsFileEarmarkImage size={36} color="#FF5733" />,
    png: <BsFileEarmarkImage size={36} color="#FF5733" />,
    gif: <BsFileEarmarkImage size={36} color="#FF5733" />,
    pdf: <BsFileEarmarkPdf size={36} color="#FF0000" />,
    doc: <BsFileEarmarkWord size={36} color="#2B579A" />,
    docx: <BsFileEarmarkWord size={36} color="#2B579A" />,
    xls: <BsFileEarmarkExcel size={36} color="#217346" />,
    xlsx: <BsFileEarmarkExcel size={36} color="#217346" />,
    ppt: <BsFileEarmarkPpt size={36} color="#B7472A" />,
    pptx: <BsFileEarmarkPpt size={36} color="#B7472A" />,
  };

  useEffect(() => {
    const fileExtension = getFileExtension(filename);
    setExtension(fileExtension);
  }, [filename]);

  return (
    <>
      {iconMap[extension] || <AiOutlineFileText size={36} color="#000" />} {/* Default icon */}
    </>
  );
};

export default FileIcon;
