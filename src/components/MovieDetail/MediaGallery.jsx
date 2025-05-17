import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  getContentImages,
  getContentVideos,
  getImageUrl,
} from "../../utils/api";
import "../../styles/components/moviedetail-enhanced.css";

const MediaGallery = ({ movie }) => {
  const { t, language } = useLanguage(); // Obtener el idioma actual
  const [activeTab, setActiveTab] = useState("photos");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [slideshowInterval, setSlideshowInterval] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estado para almacenar los medios de TMDB
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [posters, setPosters] = useState([]);

  // Nuevos estados para limitar la visualización inicial
  const [photoLimit, setPhotoLimit] = useState(6);
  const [videoLimit, setVideoLimit] = useState(6);
  const [posterLimit, setPosterLimit] = useState(6);
  const [photosExpanded, setPhotosExpanded] = useState(false);
  const [videosExpanded, setVideosExpanded] = useState(false);
  const [postersExpanded, setPostersExpanded] = useState(false);

  // Cargar imágenes y videos de TMDB
  useEffect(() => {
    const loadMediaContent = async () => {
      if (!movie || !movie.id) return;

      setLoading(true);

      try {
        const mediaType = movie.media_type || "movie";

        // Cargar imágenes
        const imagesData = await getContentImages(
          movie.id,
          mediaType,
          language
        );

        // Procesar backdrops (fotos)
        const processedPhotos =
          imagesData.backdrops?.map((image) => ({
            url: getImageUrl(image.file_path, "large", "backdrop"),
            width: image.width,
            height: image.height,
            aspect_ratio: image.aspect_ratio,
            language: image.iso_639_1,
            vote_average: image.vote_average,
          })) || [];
        setPhotos(processedPhotos);

        // Procesar pósters
        const processedPosters =
          imagesData.posters?.map((poster) => ({
            url: getImageUrl(poster.file_path, "large", "poster"),
            width: poster.width,
            height: poster.height,
            aspect_ratio: poster.aspect_ratio,
            language: poster.iso_639_1,
            vote_average: poster.vote_average,
          })) || [];
        setPosters(processedPosters);

        // Cargar videos
        const videosData = await getContentVideos(
          movie.id,
          mediaType,
          language
        );

        // Procesar videos (principalmente trailers y teasers)
        const processedVideos =
          videosData?.map((video) => ({
            key: video.key,
            name: video.name,
            type: video.type,
            site: video.site,
            official: video.official,
            published_at: video.published_at,
            thumbnail:
              video.site === "YouTube"
                ? `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`
                : null,
          })) || [];
        setVideos(processedVideos);
      } catch (error) {
        console.error("Error al cargar medios:", error);

        // En caso de error, usar los datos que ya existen en el objeto movie si están disponibles
        if (movie.images) setPhotos(movie.images);
        if (movie.videos) setVideos(movie.videos);
        if (movie.posters) setPosters(movie.posters);
      } finally {
        setLoading(false);
      }
    };

    loadMediaContent();
  }, [movie?.id, movie?.media_type, language]); // Añadir language a las dependencias

  // Efecto para manejar el lightbox de visualización
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return;

      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowLeft":
          navigate(-1);
          break;
        case "ArrowRight":
          navigate(1);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, currentIndex]);

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

  // Funciones para expandir o contraer las secciones
  const togglePhotosExpanded = () => {
    if (photosExpanded) {
      setPhotoLimit(6);
      setPhotosExpanded(false);
      // Desplazarse hacia arriba hasta el principio de la sección
      document
        .querySelector(".movie-detail-photos-grid")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setPhotoLimit(photos.length);
      setPhotosExpanded(true);
    }
  };

  const toggleVideosExpanded = () => {
    if (videosExpanded) {
      setVideoLimit(6);
      setVideosExpanded(false);
      document
        .querySelector(".movie-detail-videos-grid")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setVideoLimit(videos.length);
      setVideosExpanded(true);
    }
  };

  const togglePostersExpanded = () => {
    if (postersExpanded) {
      setPosterLimit(6);
      setPostersExpanded(false);
      document
        .querySelector(".movie-detail-posters-grid")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setPosterLimit(posters.length);
      setPostersExpanded(true);
    }
  };

  if (!movie) return null;

  // Mostrar indicador de carga mientras se obtienen los medios
  if (loading) {
    return (
      <div className="movie-detail-media-gallery">
        <h3 className="movie-detail-section-title">
          <i className="fas fa-photo-video"></i> {t("movieDetail.mediaGallery")}
        </h3>
        <div className="movie-detail-media-loading">
          <div className="movie-detail-media-loading-spinner"></div>
          <p>{t("common.loadingMedia")}</p>
        </div>
      </div>
    );
  }

  // Obtener los elementos limitados para mostrar
  const displayedPhotos = photos.slice(0, photoLimit);
  const displayedVideos = videos.slice(0, videoLimit);
  const displayedPosters = posters.slice(0, posterLimit);

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

      {activeTab === "photos" && (
        <div className="movie-detail-media-section">
          <div className="movie-detail-photos-grid">
            {photos.length > 0 ? (
              displayedPhotos.map((photo, index) => (
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
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/500x281?text=Image+Not+Available";
                    }}
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
                <i className="fas fa-images fa-3x"></i>
                <p>{t("movieDetail.noPhotosAvailable")}</p>
              </div>
            )}
          </div>

          {photos.length > 6 && (
            <div className="movie-detail-view-more-container">
              <button
                className="movie-detail-view-more-button"
                onClick={togglePhotosExpanded}
              >
                {photosExpanded ? (
                  <>
                    <i className="fas fa-chevron-up"></i> {t("common.showLess")}
                  </>
                ) : (
                  <>
                    <i className="fas fa-chevron-down"></i>{" "}
                    {t("common.viewAll")} {photos.length}{" "}
                    {t("movieDetail.photos")}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "videos" && (
        <div className="movie-detail-media-section">
          <div className="movie-detail-videos-grid">
            {videos.length > 0 ? (
              displayedVideos.map((video, index) => (
                <div
                  key={index}
                  className={`movie-detail-video-item ${
                    video.type === "Trailer" && index === 0
                      ? "movie-detail-main-trailer"
                      : ""
                  }`}
                  onClick={() => openLightbox(video, index)}
                >
                  <div className="movie-detail-video-thumbnail">
                    <img
                      src={
                        video.thumbnail ||
                        `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`
                      }
                      alt={`${video.name || t("movieDetail.video")} - ${t(
                        "movieDetail.thumbnail"
                      )}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/480x360?text=Video+Not+Available";
                      }}
                    />
                    <div className="movie-detail-play-overlay">
                      <i className="fas fa-play"></i>
                    </div>
                  </div>
                  <h4>
                    {video.name || `${t("movieDetail.video")} ${index + 1}`}
                  </h4>
                  <div className="movie-detail-video-meta">
                    <span className="movie-detail-video-type">
                      {video.type}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="movie-detail-no-media">
                <i className="fas fa-video fa-3x"></i>
                <p>{t("movieDetail.noVideosAvailable")}</p>
              </div>
            )}
          </div>

          {videos.length > 6 && (
            <div className="movie-detail-view-more-container">
              <button
                className="movie-detail-view-more-button"
                onClick={toggleVideosExpanded}
              >
                {videosExpanded ? (
                  <>
                    <i className="fas fa-chevron-up"></i> {t("common.showLess")}
                  </>
                ) : (
                  <>
                    <i className="fas fa-chevron-down"></i>{" "}
                    {t("common.viewAll")} {videos.length}{" "}
                    {t("movieDetail.videos")}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "posters" && (
        <div className="movie-detail-media-section">
          <div className="movie-detail-posters-grid">
            {posters.length > 0 ? (
              displayedPosters.map((poster, index) => (
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
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/342x513?text=Poster+Not+Available";
                    }}
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
                <i className="fas fa-file-image fa-3x"></i>
                <p>{t("movieDetail.noPostersAvailable")}</p>
              </div>
            )}
          </div>

          {posters.length > 6 && (
            <div className="movie-detail-view-more-container">
              <button
                className="movie-detail-view-more-button"
                onClick={togglePostersExpanded}
              >
                {postersExpanded ? (
                  <>
                    <i className="fas fa-chevron-up"></i> {t("common.showLess")}
                  </>
                ) : (
                  <>
                    <i className="fas fa-chevron-down"></i>{" "}
                    {t("common.viewAll")} {posters.length}{" "}
                    {t("movieDetail.posters")}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

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
                      {t("movieDetail.language")}:{" "}
                      {selectedItem.language || t("common.unknown")}
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
        </div>
      )}
    </div>
  );
};

MediaGallery.propTypes = {
  movie: PropTypes.object.isRequired,
};

export default MediaGallery;
