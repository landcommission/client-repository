import axios from "axios";
import React, { useState, useEffect } from "react";
import { Document, Page } from "@react-pdf/renderer";

const PdfViewer = ({ filename }) => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        console.log("Fetching PDF...");
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/documents/${filename}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
          }
        );
        console.log("PDF fetched successfully:", response);

        // Convert PDF blob to URL
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        console.log("PDF URL:", pdfUrl);

        // Update state
        setPdfUrl(pdfUrl);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching PDF:", error);
        setLoading(false);
      }
    };

    fetchPdf();
  }, [filename]);

  return (
    <div>
      {loading ? (
        <p>Loading PDF...</p>
      ) : (
        <Document file={pdfUrl}>
          <Page pageNumber={1} />
        </Document>
      )}
    </div>
  );
};

export default PdfViewer;
