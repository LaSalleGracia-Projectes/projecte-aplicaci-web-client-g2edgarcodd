import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useLanguage } from "../../contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

const MediaGallery = ({ movie }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("photos");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [slideshowInterval, setSlideshowInterval] = useState(null);

  // Referencias para la galería de medios
  const photos = movie?.images || [];
  const videos = movie?.videos || [];
  const posters = movie?.posters || [];

  // Efecto para animar la aparición de los elementos de la galería
  useEffect(() => {
    const items = document.querySelectorAll(
      ".movie-detail-photo-item, .movie-detail-video-item"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateY(0)";
            }, index * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    items.forEach((item) => observer.observe(item));

    return () => {
      items.forEach((item) => observer.unobserve(item));
    };
  }, [activeTab]);

  // Efecto para la presentación de diapositivas
  useEffect(() => {
    if (isLightboxOpen && isSlideshow) {
      const interval = setInterval(() => {
        const mediaItems =
          activeTab === "photos"
            ? photos
            : activeTab === "videos"
            ? videos
            : posters;
        setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
      }, 3000);

      setSlideshowInterval(interval);
    } else if (slideshowInterval) {
      clearInterval(slideshowInterval);
    }

    return () => {
      if (slideshowInterval) clearInterval(slideshowInterval);
    };
  }, [
    isSlideshow,
    isLightboxOpen,
    currentIndex,
    activeTab,
    photos,
    videos,
    posters,
  ]);

  // Función para abrir el lightbox
  const openLightbox = (item, index) => {
    setSelectedItem(item);
    setCurrentIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = "hidden"; // Prevenir scroll
  };

  // Función para cerrar el lightbox
  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setIsSlideshow(false);
    document.body.style.overflow = ""; // Restaurar scroll
  };

  // Función para navegar en el lightbox
  const navigate = (direction) => {
    const mediaItems =
      activeTab === "photos"
        ? photos
        : activeTab === "videos"
        ? videos
        : posters;

    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = mediaItems.length - 1;
    if (newIndex >= mediaItems.length) newIndex = 0;

    setSelectedItem(mediaItems[newIndex]);
    setCurrentIndex(newIndex);
  };

  // Función para alternar la presentación de diapositivas
  const toggleSlideshow = () => {
    setIsSlideshow(!isSlideshow);
  };

  // Gestionar la tecla Escape para cerrar el lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    };

    if (isLightboxOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, currentIndex]);

  if (!movie) return null;

  return (
    <div className="movie-detail-media-gallery">
      <h3 className="movie-detail-section-title">
        <i className="fas fa-photo-video"></i> {t("movieDetail.mediaGallery")}
      </h3>

      <div className="movie-detail-media-tabs">
        <button
          className={`movie-detail-media-tab ${
            activeTab === "photos" ? "active" : ""
          }`}
          onClick={() => setActiveTab("photos")}
        >
          <i className="fas fa-image"></i> {t("movieDetail.photos")}
          {photos.length > 0 && (
            <span className="movie-detail-count">({photos.length})</span>
          )}
        </button>

        <button
          className={`movie-detail-media-tab ${
            activeTab === "videos" ? "active" : ""
          }`}
          onClick={() => setActiveTab("videos")}
        >
          <i className="fas fa-film"></i> {t("movieDetail.videos")}
          {videos.length > 0 && (
            <span className="movie-detail-count">({videos.length})</span>
          )}
        </button>

        <button
          className={`movie-detail-media-tab ${
            activeTab === "posters" ? "active" : ""
          }`}
          onClick={() => setActiveTab("posters")}
        >
          <i className="fas fa-file-image"></i> {t("movieDetail.posters")}
          {posters.length > 0 && (
            <span className="movie-detail-count">({posters.length})</span>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "photos" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="movie-detail-photos-grid"
          >
            {photos.length > 0 ? (
              photos.map((photo, index) => (
                <div
                  key={index}
                  className="movie-detail-photo-item"
                  onClick={() => openLightbox(photo, index)}
                >
                  <img
                    src={photo.url}
                    alt={`${movie.title} - ${t("movieDetail.photo")} ${
                      index + 1
                    }`}
                  />
                  <div className="movie-detail-photo-overlay">
                    <div className="movie-detail-photo-actions">
                      <button className="movie-detail-photo-action-btn">
                        <i className="fas fa-search-plus"></i>
                      </button>
                    </div>
                  </div>
                  <div className="movie-detail-photo-number">
                    {index + 1}/{photos.length}
                  </div>
                </div>
              ))
            ) : (
              <div className="movie-detail-no-media">
                <i className="fas fa-image"></i>
                <p>{t("movieDetail.noPhotos")}</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "videos" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="movie-detail-videos-grid"
          >
            {videos.length > 0 ? (
              videos.map((video, index) => (
                <div
                  key={index}
                  className={`movie-detail-video-item ${
                    index === 0 ? "movie-detail-main-trailer" : ""
                  }`}
                  onClick={() => openLightbox(video, index)}
                >
                  <div className="movie-detail-video-thumbnail">
                    <img
                      src={
                        video.thumbnail ||
                        `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`
                      }
                      alt={`${video.name} - ${t("movieDetail.thumbnail")}`}
                    />
                    <div className="movie-detail-play-overlay">
                      <i className="fas fa-play"></i>
                    </div>
                    {video.duration && (
                      <div className="movie-detail-video-duration">
                        {video.duration}
                      </div>
                    )}
                  </div>
                  <h4>
                    {video.name || `${t("movieDetail.trailer")} ${index + 1}`}
                  </h4>
                </div>
              ))
            ) : (
              <div className="movie-detail-no-media">
                <i className="fas fa-video"></i>
                <p>{t("movieDetail.noVideos")}</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "posters" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="movie-detail-posters-grid"
          >
            {posters.length > 0 ? (
              posters.map((poster, index) => (
                <div
                  key={index}
                  className="movie-detail-poster-item"
                  onClick={() => openLightbox(poster, index)}
                >
                  <img
                    src={poster.url}
                    alt={`${movie.title} - ${t("movieDetail.poster")} ${
                      index + 1
                    }`}
                    className="movie-detail-poster-img"
                  />
                  <div className="movie-detail-poster-overlay">
                    <div className="movie-detail-poster-actions">
                      <button className="movie-detail-poster-action-btn">
                        <i className="fas fa-search-plus"></i>
                      </button>
                    </div>
                  </div>
                  <div className="movie-detail-poster-label">
                    {poster.language || t("common.default")}
                  </div>
                </div>
              ))
            ) : (
              <div className="movie-detail-no-media">
                <i className="fas fa-file-image"></i>
                <p>{t("movieDetail.noPosters")}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox para visualización completa */}
      {isLightboxOpen && (
        <div className="movie-detail-media-lightbox" onClick={closeLightbox}>
          <div
            className="movie-detail-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            {activeTab === "photos" && (
              <img
                src={selectedItem.url}
                alt={`${movie.title} - ${t("movieDetail.photo")}`}
                className={`movie-detail-lightbox-image ${
                  isSlideshow ? "movie-detail-transitioning" : ""
                }`}
              />
            )}

            {activeTab === "posters" && (
              <div className="movie-detail-lightbox-poster">
                <img
                  src={selectedItem.url}
                  alt={`${movie.title} - ${t("movieDetail.poster")}`}
                  className={isSlideshow ? "movie-detail-transitioning" : ""}
                />
                {selectedItem.language && (
                  <div className="movie-detail-poster-caption">
                    <div className="movie-detail-poster-language">
                      {t("movieDetail.language")}: {selectedItem.language}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "videos" && (
              <iframe
                src={`https://www.youtube.com/embed/${selectedItem.key}?autoplay=1`}
                title={
                  selectedItem.name ||
                  `${movie.title} - ${t("movieDetail.video")}`
                }
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="movie-detail-lightbox-video"
              ></iframe>
            )}
          </div>

          <button
            className="movie-detail-close-lightbox"
            onClick={closeLightbox}
          >
            <i className="fas fa-times"></i>
          </button>

          <div className="movie-detail-lightbox-controls">
            <button
              className="movie-detail-lightbox-nav movie-detail-prev"
              onClick={(e) => {
                e.stopPropagation();
                navigate(-1);
              }}
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            {activeTab !== "videos" && (
              <button
                className={`movie-detail-lightbox-slideshow ${
                  isSlideshow ? "active" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSlideshow();
                }}
              >
                <i className={isSlideshow ? "fas fa-pause" : "fas fa-play"}></i>
              </button>
            )}

            <div className="movie-detail-lightbox-info">
              {currentIndex + 1} /{" "}
              {activeTab === "photos"
                ? photos.length
                : activeTab === "videos"
                ? videos.length
                : posters.length}
            </div>

            <button
              className="movie-detail-lightbox-nav movie-detail-next"
              onClick={(e) => {
                e.stopPropagation();
                navigate(1);
              }}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          {activeTab !== "videos" && (
            <div className="movie-detail-lightbox-footer">
              <button
                className="movie-detail-lightbox-download"
                onClick={(e) => {
                  e.stopPropagation();
                  const link = document.createElement("a");
                  link.href = selectedItem.url;
                  link.download = `${movie.title}-${
                    activeTab === "photos" ? "photo" : "poster"
                  }-${currentIndex + 1}.jpg`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <i className="fas fa-download"></i> {t("common.download")}
              </button>

              <button
                className="movie-detail-lightbox-share"
                onClick={(e) => {
                  e.stopPropagation();
                  if (navigator.share) {
                    navigator.share({
                      title: `${movie.title} - ${
                        activeTab === "photos"
                          ? t("movieDetail.photo")
                          : t("movieDetail.poster")
                      }`,
                      url: selectedItem.url,
                    });
                  }
                }}
              >
                <i className="fas fa-share-alt"></i> {t("common.share")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

MediaGallery.propTypes = {
  movie: PropTypes.object.isRequired,
};

export default MediaGallery;
