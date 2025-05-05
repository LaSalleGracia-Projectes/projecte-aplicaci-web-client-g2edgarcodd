import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import PropTypes from "prop-types";
import "../../styles/components/moviedetail-enhanced.css";

function VideoPlayer({ videoId, thumbnailUrl, title }) {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Manejar la carga inicial del video y asignar los controladores de eventos
  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      const handleLoadedMetadata = () => {
        setDuration(videoElement.duration);
        setVideoLoaded(true);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(videoElement.currentTime);
        setProgress((videoElement.currentTime / videoElement.duration) * 100);
      };

      videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        videoElement.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);

        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      };
    }
  }, [videoLoaded]);

  // Manejar cambios en el estado de reproducción
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch((error) => {
          console.error("Error al reproducir el video:", error);
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Manejar cambios en el volumen
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Formateador de tiempo (convierte segundos en formato MM:SS)
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  // Manejadores de eventos
  const handlePlayClick = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(Math.max(0, Math.min(100, newVolume)));
  };

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.clientWidth;
    const newProgress = (clickPosition / progressBarWidth) * 100;

    if (videoRef.current) {
      const newTime = (newProgress / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setProgress(newProgress);
      setCurrentTime(newTime);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(
          `Error al intentar entrar en modo pantalla completa:`,
          err.message
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleTrailerClick = () => {
    setIsPlaying(true);
  };

  if (!videoId) {
    return (
      <div className="movie-detail-video-player-container">
        <div className="movie-detail-video-placeholder">
          <div className="movie-detail-video-overlay">
            <div className="movie-detail-trailer-info">
              {t("movieDetail.trailerNotAvailable")}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si el video no está activo, mostrar la miniatura con botón de reproducción
  if (!isPlaying) {
    return (
      <div className="movie-detail-video-player-container">
        <div
          className="movie-detail-video-placeholder"
          onClick={handleTrailerClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={
              thumbnailUrl ||
              `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
            }
            alt={title}
            className="movie-detail-video-thumbnail"
          />
          <div
            className={`movie-detail-video-overlay ${
              isHovered ? "hovered" : ""
            }`}
          >
            <div className="movie-detail-play-button-large">
              <i className="fas fa-play"></i>
            </div>
            <div className="movie-detail-play-text">
              {t("movieDetail.playTrailer")}
            </div>
            <div className="movie-detail-trailer-info">
              {title || t("movieDetail.officialTrailer")}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Video está reproduciéndose
  return (
    <div className="movie-detail-video-player-container" ref={containerRef}>
      <div className="movie-detail-video-info-overlay">
        <div className="movie-detail-video-info-content">
          <div className="movie-detail-video-info-title">
            <h2>{title || t("movieDetail.officialTrailer")}</h2>
          </div>
        </div>
      </div>
      <video
        ref={videoRef}
        className="movie-detail-video-player"
        width="100%"
        controls={false}
        onClick={handlePlayClick}
        poster={
          thumbnailUrl ||
          `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        }
      >
        <source
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          type="video/mp4"
        />
        {t("movieDetail.videoNotSupported")}
      </video>
      <div className="movie-detail-video-controls">
        <div className="movie-detail-control-buttons">
          <button
            className="movie-detail-control-button main-control"
            onClick={handlePlayClick}
          >
            <i className={isPlaying ? "fas fa-pause" : "fas fa-play"}></i>
          </button>
          <button className="movie-detail-control-button">
            <i className="fas fa-step-backward"></i>
          </button>
          <button className="movie-detail-control-button">
            <i className="fas fa-step-forward"></i>
          </button>
        </div>

        <div className="movie-detail-volume-control">
          <i
            className={
              volume === 0
                ? "fas fa-volume-mute"
                : volume < 30
                ? "fas fa-volume-down"
                : "fas fa-volume-up"
            }
          ></i>
          <div className="movie-detail-volume-slider">
            <div
              className="movie-detail-volume-progress"
              style={{ width: `${volume}%` }}
            ></div>
            <div
              className="movie-detail-volume-handle"
              style={{ left: `${volume}%` }}
            ></div>
          </div>
        </div>

        <div className="movie-detail-video-progress">
          <div className="movie-detail-progress-time">
            {formatTime(currentTime)}
          </div>
          <div
            className="movie-detail-progress-bar-container"
            onClick={handleProgressClick}
          >
            <div
              className="movie-detail-progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
            <div
              className="movie-detail-progress-handle"
              style={{ left: `${progress}%` }}
            ></div>
            <div
              className="movie-detail-progress-preview"
              style={{ left: `${progress}%` }}
            >
              <img
                src={
                  thumbnailUrl ||
                  `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                }
                className="movie-detail-preview-thumbnail"
                alt="Preview"
              />
              <div className="movie-detail-preview-time">
                {formatTime(currentTime)}
              </div>
            </div>
          </div>
          <div className="movie-detail-progress-duration">
            {formatTime(duration)}
          </div>
        </div>

        <div className="movie-detail-video-settings">
          <button className="movie-detail-control-button">
            <i className="fas fa-cog"></i>
            <div className="movie-detail-settings-dropdown">
              <div className="movie-detail-settings-option">
                <span>{t("videoPlayer.quality")}</span>
                <select>
                  <option value="auto">Auto (720p)</option>
                  <option value="1080p">1080p</option>
                  <option value="720p">720p</option>
                  <option value="480p">480p</option>
                  <option value="360p">360p</option>
                </select>
              </div>
              <div className="movie-detail-settings-option">
                <span>{t("videoPlayer.speed")}</span>
                <select>
                  <option value="0.5">0.5x</option>
                  <option value="1" selected>
                    1x
                  </option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                </select>
              </div>
            </div>
          </button>
          <button
            className="movie-detail-control-button"
            onClick={toggleFullscreen}
          >
            <i className={fullscreen ? "fas fa-compress" : "fas fa-expand"}></i>
          </button>
        </div>
      </div>
    </div>
  );
}

VideoPlayer.propTypes = {
  videoId: PropTypes.string,
  thumbnailUrl: PropTypes.string,
  title: PropTypes.string,
};

export default VideoPlayer;
