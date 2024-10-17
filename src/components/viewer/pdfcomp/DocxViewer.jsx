import React, { useState, useEffect, useRef } from 'react';
import { renderAsync } from "docx-preview";

const DocxViewer = ({ file }) => {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    const renderDocx = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(file);
        const arrayBuffer = await response.arrayBuffer();
        const container = document.createElement('div');
        await renderAsync(arrayBuffer, container, null, {
          ignoreWidth: false,
          ignoreHeight: false,
          ignoreFonts: false,
          breakPages: true,
          useBase64URL: true,
          experimental: false,
        });
        setContent(container.innerHTML);
      } catch (error) {
        console.error("Error rendering DOCX:", error);
        setError("Failed to load the document. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    renderDocx();
  }, [file]);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const contentElement = containerRef.current.querySelector('.docx-viewer-content');
        if (contentElement) {
          const contentWidth = contentElement.scrollWidth;
          const margin = 32; // 16px on each side
          if (contentWidth + margin > containerWidth) {
            setScale((containerWidth - margin) / contentWidth);
          } else {
            setScale(1);
          }
        }
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [content]);

  if (isLoading) {
    return (
      <div className="flex justify-center w-full items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="docx-viewer" ref={containerRef}>
      <style jsx>{`
        .docx-viewer {
          width: 100%;
          height: 100%;
          overflow-x: auto;
          overflow-y: auto;
          padding: 16px;
        }
        .docx-viewer-content {
          transform-origin: top left;
          transform: scale(${scale});
          width: ${100 / scale}%;
          margin: 0 auto;
        }
        .docx-viewer-content .page {
          margin: 0 auto;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          background-color: white;
        }
        @media (max-width: 640px) {
          .docx-viewer {
            padding: 8px;
          }
        }
      `}</style>
      <div 
        className="docx-viewer-content"
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    </div>
  );
};

export default DocxViewer;