import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Play, Volume2, VolumeX, Maximize, X, Loader } from "lucide-react";
import DocxThumbnail from "./Thumbnail/DocxThumbnail";
import { useInView } from "react-intersection-observer";

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const formatViewCount = (count) => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M views`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K views`;
  return `${count} views`;
};

const Thumbnail = React.memo(function Thumbnail({
  file,
  fileType,
  title,
  channelName,
  viewCount,
  uploadDate,
  duration,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(null);

  const videoRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: "200px 0px",
  });

  const handleResize = useCallback(() => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      containerRef.current.style.height = `${width * 0.5625}px`;
      if (fileType === "pdf") {
        setPdfDimensions({ width, height: width * 0.5625 });
      }
    }
  }, [fileType]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    const handleFullScreenChange = () =>
      setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

  const onDocumentLoadSuccess = useCallback(() => setIsLoading(false), []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (videoRef.current && fileType === "video") {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch((e) => console.error("Error playing video:", e));
    }
  }, [fileType]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (videoRef.current && fileType === "video") {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [fileType]);

  const toggleMute = useCallback((e) => {
    e.stopPropagation();
    setIsMuted((prev) => {
      if (videoRef.current) videoRef.current.muted = !prev;
      return !prev;
    });
  }, []);

  const openFullScreen = useCallback(
    (e) => {
      e.stopPropagation();
      const element =
        fileType === "video" ? videoRef.current : containerRef.current;
      if (element) {
        if (element.requestFullscreen) element.requestFullscreen();
        else if (element.webkitRequestFullscreen)
          element.webkitRequestFullscreen();
        else if (element.msRequestFullscreen) element.msRequestFullscreen();
        if (fileType === "video") element.play();
      }
    },
    [fileType]
  );

  const exitFullScreen = useCallback(() => {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  }, []);

  const handleLoad = useCallback(() => setIsLoading(false), []);

  const loadImage = useCallback((src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = reject;
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (inView && fileType === "image" && file) {
      setIsLoading(true);
      loadImage(file)
        .then((src) => {
          setImageSrc(src);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error loading image:", error);
          setIsLoading(false);
        });
    }
  }, [inView, fileType, file, loadImage]);

  const renderThumbnail = useMemo(() => {
    if (!inView) return null;

    switch (fileType) {
      case "pdf":
        return (
          <>
            {isLoading && <LoadingIndicator />}
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
              <Page
                pageNumber={1}
                width={pdfDimensions.width}
                height={pdfDimensions.height}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          </>
        );
      case "image":
        return (
          <>
            {isLoading && <LoadingIndicator />}
            {imageSrc && (
              <img
                ref={imageRef}
                src={imageSrc}
                alt={title}
                className="w-full h-full object-cover"
                onLoad={handleLoad}
              />
            )}
          </>
        );
      case "video":
        return (
          <>
            {isLoading && <LoadingIndicator />}
            <video
              ref={videoRef}
              muted={isMuted}
              loop
              playsInline
              className={`w-full h-full object-cover ${isLoading ? "hidden" : ""}`}
              onLoadedData={handleLoad}
              preload="metadata"
            >
              <source src={file} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </>
        );
      case "docx":
        return <DocxThumbnail file={file} title={title} />;
      default:
        return <div>Unsupported file type</div>;
    }
  }, [
    file,
    fileType,
    title,
    isLoading,
    isMuted,
    pdfDimensions,
    onDocumentLoadSuccess,
    handleLoad,
    inView,
    imageSrc,
  ]);

  return (
    <div
      ref={ref}
      className="thumbnail-div text-gray-700 flex flex-col items-start justify-start p-0 mb-4 w-full"
    >
      <div
        ref={containerRef}
        className="thumbnail-container relative overflow-hidden rounded-xl w-full cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {renderThumbnail}
        <ThumbnailOverlay
          fileType={fileType}
          duration={duration}
          isHovered={isHovered}
          isMuted={isMuted}
          isLoading={isLoading}
          toggleMute={toggleMute}
          openFullScreen={openFullScreen}
        />
      </div>
      <ThumbnailInfo
        title={title}
        channelName={channelName}
        viewCount={viewCount}
        uploadDate={uploadDate}
      />
      {isFullScreen && (
        <button
          className="fixed top-4 right-4 z-50 bg-black bg-opacity-80 text-white p-2 rounded-full"
          onClick={exitFullScreen}
        >
          <X size={24} />
        </button>
      )}
    </div>
  );
});

const LoadingIndicator = React.memo(() => (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
    <Loader className="animate-spin text-gray-500" size={48} />
  </div>
));

const ThumbnailOverlay = React.memo(
  ({
    fileType,
    duration,
    isHovered,
    isMuted,
    isLoading,
    toggleMute,
    openFullScreen,
  }) => {
    if (isLoading) return null;

    return (
      <>
        {duration && fileType === "video" && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
            {formatDuration(duration)}
          </div>
        )}
        {(fileType === "video" || fileType === "image" || fileType === "docx") && (
          <>
            {isHovered && fileType === "video" && (
              <button
                className="absolute bottom-2 left-2 bg-black bg-opacity-80 text-white p-1 rounded-full"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            )}
            {isHovered && (
              <button
                className="absolute top-2 right-2 bg-black bg-opacity-80 text-white p-1 rounded-full"
                onClick={openFullScreen}
              >
                <Maximize size={16} />
              </button>
            )}
            {!isHovered && fileType === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <Play size={48} className="text-white opacity-80" />
              </div>
            )}
          </>
        )}
      </>
    );
  }
);

const ThumbnailInfo = React.memo(
  ({ title, channelName, viewCount, uploadDate }) => (
    <div className="mt-2 flex w-full">
      <div className="w-9 h-9 rounded-full bg-gray-300 mr-3 flex-shrink-0"></div>
      <div className="flex-grow min-w-0">
        <h3 className="font-semibold text-sm line-clamp-2">{title}</h3>
        <p className="text-xs text-gray-500 mt-1 truncate">{channelName}</p>
        <p className="text-xs text-gray-500 truncate">
          {formatViewCount(viewCount)} • {uploadDate}
        </p>
      </div>
    </div>
  )
);

export default Thumbnail;