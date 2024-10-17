import React, { useState, useEffect, useCallback, useMemo } from "react";
import { renderAsync } from "docx-preview";
import html2canvas from "html2canvas";
import { FileText, Loader, AlertCircle } from "lucide-react";
import { useInView } from "react-intersection-observer";

const DocxThumbnail = React.memo(({ file, title }) => {
  const [state, setState] = useState({
    docxThumbnail: null,
    isProcessing: false,
    error: null,
  });

  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  });

  const processDocx = useCallback(async () => {
    if (!inView) return;

    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      const arrayBuffer = await getArrayBuffer(file);
      const container = createContainer();
      await renderDocx(arrayBuffer, container);
      const dataUrl = await generateThumbnail(container);
      setState(prev => ({ ...prev, docxThumbnail: dataUrl, isProcessing: false }));
      document.body.removeChild(container);
    } catch (error) {
      console.error("Error rendering DOCX:", error);
      setState(prev => ({
        ...prev,
        error: error.message || "Failed to generate preview",
        isProcessing: false,
      }));
    }
  }, [file, inView]);

  useEffect(() => {
    if (file && inView) {
      const timer = setTimeout(processDocx, 100);
      return () => clearTimeout(timer);
    }
  }, [file, processDocx, inView]);

  const content = useMemo(() => {
    const { docxThumbnail, isProcessing, error } = state;

    if (!inView) return <div ref={ref} className="w-full h-full" />;
    if (isProcessing) return <ProcessingView />;
    if (error) return <ErrorView error={error} />;
    if (docxThumbnail) return <ThumbnailView src={docxThumbnail} alt={title} />;
    return <NoPreviewView />;
  }, [state, title, inView, ref]);

  return <div ref={ref} className="w-full h-full">{content}</div>;
});

const getArrayBuffer = async (file) => {
  if (file instanceof Blob) {
    return await file.arrayBuffer();
  }
  if (typeof file === 'string') {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.arrayBuffer();
  }
  throw new Error('Unsupported file type');
};

const createContainer = () => {
  const container = document.createElement('div');
  Object.assign(container.style, {
    width: '800px',
    height: '600px',
    overflow: 'hidden',
    position: 'absolute',
    left: '-9999px',
  });
  document.body.appendChild(container);
  return container;
};

const renderDocx = async (arrayBuffer, container) => {
  await renderAsync(arrayBuffer, container, container, {
    className: "docx-preview",
    inWrapper: false,
  });
};

const generateThumbnail = async (container) => {
  const canvas = await html2canvas(container, {
    width: 800,
    height: 600,
    scale: 1,
    useCORS: true,
    logging: false,
  });
  return canvas.toDataURL('image/jpeg', 0.7);
};

const ProcessingView = React.memo(() => (
  <div className="flex flex-col items-center justify-center h-full">
    <Loader className="animate-spin text-gray-400" size={48} />
    <span className="mt-2 text-gray-600 font-medium">Generating preview...</span>
  </div>
));

const ErrorView = React.memo(({ error }) => (
  <div className="flex flex-col items-center justify-center h-full">
    <AlertCircle size={48} className="text-red-400 mb-2" />
    <span className="text-red-600 font-medium text-center">{error}</span>
    <span className="mt-2 text-gray-500 text-sm">Unable to preview document</span>
  </div>
));

const ThumbnailView = React.memo(({ src, alt }) => (
  <img 
    src={src} 
    alt={alt} 
    className="w-full h-full object-contain"
    loading="lazy"
  />
));

const NoPreviewView = React.memo(() => (
  <div className="flex flex-col items-center justify-center h-full">
    <FileText size={48} className="text-gray-400 mb-2" />
    <span className="text-gray-600 font-medium text-center">Preview not available</span>
  </div>
));

export default DocxThumbnail;