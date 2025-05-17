import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import PropTypes from "prop-types";
import "../../styles/components/moviedetail-enhanced.css";
import { getContentVideos } from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";

function VideoPlayer({
  videoId,
  movieId,
  mediaType = "movie",
  thumbnailUrl,
  title,
}) {
  const { t, language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingPlayer, setLoadingPlayer] = useState(false);
  const [actualVideoId, setActualVideoId] = useState(videoId);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);

  // Referencias para el contenedor y el iframe del video
  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);

  // Cargar video desde la API si no se proporciona videoId
  useEffect(() => {
    if (!videoId && movieId) {
      const loadVideoFromApi = async () => {
        try {
          setLoadingPlayer(true);
          const videos = await getContentVideos(movieId, mediaType, language);

          // Buscar primero trailers oficiales
          const trailer =
            videos.find(
              (v) => v.type === "Trailer" && v.official && v.site === "YouTube"
            ) ||
            videos.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
            videos.find((v) => v.site === "YouTube");

          if (trailer) {
            setActualVideoId(trailer.key);
            setLoadingPlayer(false);
          } else {
            console.warn("No se encontraron videos disponibles");
            setLoadingPlayer(false);
          }
        } catch (error) {
          console.error("Error al cargar videos:", error);
          setLoadingPlayer(false);
        }
      };

      loadVideoFromApi();
    } else {
      setActualVideoId(videoId);
    }
  }, [videoId, movieId, mediaType, language]);

  // Manejar clic en la miniatura para reproducir el video
  const handlePlayClick = () => {
    if (!actualVideoId) return;
    setLoadingPlayer(true);
    setIsPlaying(true);
  };

  // Alternar reproducción del trailer
  const handleTrailerToggle = () => {
    setIsPlaying(!isPlaying);

    if (isPlaying) {
      if (videoRef.current) {
        videoRef.current.src = "";
        setTimeout(() => {
          videoRef.current = null;
        }, 100);
      }
    } else {
      setTimeout(() => {
        if (videoRef.current) {
          // Reiniciar el iframe para que comience la reproducción
          const currentSrc = videoRef.current.src;
          videoRef.current.src = currentSrc;
        }
      }, 100);
    }
  };

  // Control de volumen (slider)
  const handleVolumeChange = (e) => {
    if (e) e.stopPropagation();

    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);

    // Si el volumen es 0, mutear, de lo contrario desmutear
    const shouldBeMuted = newVolume === 0;

    if (shouldBeMuted !== isMuted) {
      setIsMuted(shouldBeMuted);

      if (videoRef.current) {
        try {
          // Actualizar el iframe src para reflejar el cambio en mute
          let currentSrc = videoRef.current.src;
          if (shouldBeMuted) {
            currentSrc = currentSrc.replace("mute=0", "mute=1");
          } else {
            currentSrc = currentSrc.replace("mute=1", "mute=0");
          }
          videoRef.current.src = currentSrc;
        } catch (error) {
          console.error("Error al cambiar el volumen:", error);
        }
      }
    }
  };

  // Entrar en modo pantalla completa
  const handleFullScreen = (e) => {
    if (e) e.stopPropagation();

    const iframe = videoRef.current;
    if (!iframe) return;

    try {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.mozRequestFullScreen) {
        iframe.mozRequestFullScreen();
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
      }
    } catch (error) {
      console.error("Error al activar pantalla completa:", error);
    }
  };

  // Gestionar evento de carga del iframe
  const handleTrailerLoad = () => {
    console.log("Trailer cargado correctamente");
    setLoadingPlayer(false);
  };

  // Construir la URL del trailer al estilo Hero
  const trailerUrl = actualVideoId
    ? `https://www.youtube.com/embed/${actualVideoId}?autoplay=1&mute=${
        isMuted ? 1 : 0
      }&controls=1&showinfo=0&rel=0&loop=1&playlist=${actualVideoId}&enablejsapi=1&origin=${
        window.location.origin
      }`
    : "";

  // Variantes para las animaciones
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.2 },
    },
  };

  const controlsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.3 },
    },
  };

  return (
    <motion.div
      className="movie-detail-video-player-section hero-style"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="movie-detail-section-header"
        variants={titleVariants}
        initial="hidden"
        animate="visible"
      >
        <h3 className="movie-detail-section-title">
          <i className="fas fa-film"></i> {t("movieDetail.trailer")}
        </h3>
      </motion.div>

      <div
        className={`movie-detail-video-container hero-video-container ${
          isPlaying ? "playing" : ""
        }`}
        ref={videoContainerRef}
      >
        <div
          className="movie-detail-video-thumbnail hero-style-thumbnail"
          onClick={handlePlayClick}
          style={{
            opacity: isPlaying ? 0 : 1,
            pointerEvents: isPlaying ? "none" : "auto",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        >
          <div className="movie-detail-thumbnail-wrapper">
            <img
              src={
                thumbnailUrl ||
                `https://img.youtube.com/vi/${actualVideoId}/maxresdefault.jpg`
              }
              alt={`${title} - ${t("movieDetail.trailer")}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://img.youtube.com/vi/${actualVideoId}/hqdefault.jpg`;
              }}
              className="movie-detail-thumbnail-image hero-image-style"
            />
            <div className="movie-detail-thumbnail-overlay hero-overlay-style"></div>
          </div>

          <div className="movie-detail-video-play-overlay">
            <motion.div
              className="movie-detail-video-play-button hero-play-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-play"></i>
              {loadingPlayer && (
                <span className="movie-detail-loading-indicator">
                  <i className="fas fa-circle-notch fa-spin"></i>
                </span>
              )}
            </motion.div>
            <div className="movie-detail-video-title hero-title-style">
              <motion.h4
                className="hero-cinematic-title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {title || t("movieDetail.officialTrailer")}
              </motion.h4>
              <motion.span
                className="hero-cinematic-tagline"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {t("movieDetail.watchTrailer")}
              </motion.span>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isPlaying && (
            <motion.div
              className="movie-detail-trailer-container hero-trailer-style"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 2,
              }}
            >
              <iframe
                ref={videoRef}
                className="movie-detail-trailer-frame"
                src={trailerUrl}
                title={`${title || "Movie"} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                onLoad={handleTrailerLoad}
                style={{ width: "100%", height: "100%" }}
              ></iframe>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls en la parte inferior con los tres botones alineados */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              className="movie-detail-trailer-controls hero-controls-style"
              variants={controlsVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
            >
              {/* Control de volumen mejorado (izquierda) */}
              <div className="movie-detail-volume-control hero-volume-control">
                <i className={`fas fa-volume${isMuted ? "-mute" : "-up"}`}></i>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="movie-detail-volume-slider hero-volume-slider"
                  aria-label={t("common.volume")}
                />
              </div>

              {/* Botón de cerrar (centro) */}
              <motion.button
                className="movie-detail-btn-trailer hero-btn-style active"
                onClick={handleTrailerToggle}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <i className="fas fa-times"></i>
                {t("common.hideTrailer")}
              </motion.button>

              {/* Botón de pantalla completa (derecha) */}
              <motion.button
                className="movie-detail-video-control-btn movie-detail-video-fullscreen hero-fullscreen-btn"
                onClick={handleFullScreen}
                aria-label={t("common.fullscreen")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-expand"></i>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

VideoPlayer.propTypes = {
  videoId: PropTypes.string,
  movieId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  mediaType: PropTypes.string,
  thumbnailUrl: PropTypes.string,
  title: PropTypes.string,
};

export default VideoPlayer;
