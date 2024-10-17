import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Play, Pause, Maximize, Minimize, Volume2, VolumeX, Settings, PictureInPicture, SkipBack, SkipForward, Download } from 'lucide-react';

const VideoViewer = React.memo(({ file }) => {
  const [videoState, setVideoState] = useState({
    isLoading: true,
    isPlaying: false,
    isFullscreen: false,
    isMuted: false,
    duration: 0,
    currentTime: 0,
    volume: 1,
    showControls: true,
    buffered: [],
    quality: 'auto'
  });

  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const updateVideoState = useCallback((newState) => {
    setVideoState(prevState => ({ ...prevState, ...newState }));
  }, []);

  useEffect(() => {
    const hideControlsTimer = () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => updateVideoState({ showControls: false }), 3000);
    };

    if (videoState.isPlaying) {
      hideControlsTimer();
    } else {
      updateVideoState({ showControls: true });
    }

    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [videoState.isPlaying, videoState.currentTime, updateVideoState]);

  const handleLoadedData = useCallback(() => {
    updateVideoState({
      isLoading: false,
      duration: videoRef.current.duration
    });
  }, [updateVideoState]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      updateVideoState({ isPlaying: true });
    } else {
      video.pause();
      updateVideoState({ isPlaying: false });
    }
  }, [updateVideoState]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen();
      updateVideoState({ isFullscreen: true });
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      updateVideoState({ isFullscreen: false });
    }
  }, [updateVideoState]);

  const toggleMute = useCallback(() => {
    videoRef.current.muted = !videoRef.current.muted;
    updateVideoState({ isMuted: !videoState.isMuted });
  }, [videoState.isMuted, updateVideoState]);

  const handleTimeUpdate = useCallback(() => {
    updateVideoState({
      currentTime: videoRef.current.currentTime,
      buffered: Array.from({ length: videoRef.current.buffered.length }, (_, i) => ({
        start: videoRef.current.buffered.start(i),
        end: videoRef.current.buffered.end(i)
      }))
    });
  }, [updateVideoState]);

  const handleSeek = useCallback((e) => {
    const seekTime = (e.nativeEvent.offsetX / e.target.offsetWidth) * videoState.duration;
    videoRef.current.currentTime = seekTime;
    updateVideoState({ currentTime: seekTime });
  }, [videoState.duration, updateVideoState]);

  const handleVolumeChange = useCallback((e) => {
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    updateVideoState({
      volume: newVolume,
      isMuted: newVolume === 0
    });
  }, [updateVideoState]);

  const togglePictureInPicture = useCallback(async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (error) {
      console.error("PiP error:", error);
    }
  }, []);

  const formatTime = useMemo(() => (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, []);

  const skip = useCallback((seconds) => {
    videoRef.current.currentTime += seconds;
  }, []);

  const handleQualityChange = useCallback((newQuality) => {
    updateVideoState({ quality: newQuality });
    // In a real implementation, you would switch video sources here
  }, [updateVideoState]);

  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = file;
    link.download = 'video.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [file]);

  return (
    <div 
      className="relative w-full h-full bg-black overflow-hidden"
      onMouseMove={() => updateVideoState({ showControls: true })}
      onMouseLeave={() => videoState.isPlaying && updateVideoState({ showControls: false })}
    >
      {videoState.isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onLoadedData={handleLoadedData}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
      >
        <source src={file} type="video/mp4" />
        <source src={file} type="video/webm" />
        <source src={file} type="video/ogg" />
        Your browser does not support the video tag.
      </video>
      {videoState.showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm">{formatTime(videoState.currentTime)}</span>
              <div className="flex-grow bg-gray-600 h-1 rounded-full cursor-pointer relative" onClick={handleSeek}>
                {videoState.buffered.map((range, index) => (
                  <div
                    key={index}
                    className="absolute h-full bg-gray-400 opacity-50"
                    style={{
                      left: `${(range.start / videoState.duration) * 100}%`,
                      width: `${((range.end - range.start) / videoState.duration) * 100}%`,
                    }}
                  />
                ))}
                <div 
                  className="bg-white h-full rounded-full relative" 
                  style={{ width: `${(videoState.currentTime / videoState.duration) * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 transform translate-y-[-50%] w-3 h-3 bg-white rounded-full shadow"></div>
                </div>
              </div>
              <span className="text-white text-sm">{formatTime(videoState.duration)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-gray-300 focus:outline-none"
                  aria-label={videoState.isPlaying ? "Pause" : "Play"}
                >
                  {videoState.isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button onClick={() => skip(-10)} className="text-white hover:text-gray-300 focus:outline-none">
                  <SkipBack size={20} />
                </button>
                <button onClick={() => skip(10)} className="text-white hover:text-gray-300 focus:outline-none">
                  <SkipForward size={20} />
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-gray-300 focus:outline-none"
                    aria-label={videoState.isMuted ? "Unmute" : "Mute"}
                  >
                    {videoState.isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={videoState.volume}
                    onChange={handleVolumeChange}
                    className="w-20"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={togglePictureInPicture}
                  className="text-white hover:text-gray-300 focus:outline-none"
                  aria-label="Picture-in-Picture"
                >
                  <PictureInPicture size={20} />
                </button>
                <select
                  onChange={(e) => videoRef.current.playbackRate = e.target.value}
                  className="bg-transparent text-white text-sm focus:outline-none"
                >
                  <option value="0.5">0.5x</option>
                  <option value="1" selected>1x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                </select>
                <select
                  onChange={(e) => handleQualityChange(e.target.value)}
                  value={videoState.quality}
                  className="bg-transparent text-white text-sm focus:outline-none"
                >
                  <option value="auto">Auto</option>
                  <option value="1080p">1080p</option>
                  <option value="720p">720p</option>
                  <option value="480p">480p</option>
                </select>
                <button
                  onClick={handleDownload}
                  className="text-white hover:text-gray-300 focus:outline-none"
                  aria-label="Download video"
                >
                  <Download size={20} />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-gray-300 focus:outline-none"
                  aria-label={videoState.isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {videoState.isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default VideoViewer;