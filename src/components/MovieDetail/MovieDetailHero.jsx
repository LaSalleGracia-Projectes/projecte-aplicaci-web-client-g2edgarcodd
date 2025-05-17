import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/components/moviedetail.css";
import { getContentVideos } from "../../utils/api";

const MovieDetailHero = ({ movie }) => {
  const { t } = useLanguage();
  const [trailerActive, setTrailerActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [trailerKey, setTrailerKey] = useState("");
  const [heroLoaded, setHeroLoaded] = useState(false);

  const trailerRef = useRef(null);
  const heroRef = useRef(null);
  const timeoutRef = useRef(null);
  const bgRef = useRef(null);

  // Cargar videos de TMDB si es necesario
  useEffect(() => {
    const loadTrailer = async () => {
      if (movie && movie.id && !movie.trailer_key) {
        try {
          const mediaType = movie.media_type || "movie";
          const videos = await getContentVideos(movie.id, mediaType);

          let trailer = videos.find(
            (v) =>
              v.type === "Trailer" &&
              v.official &&
              v.site === "YouTube" &&
              v.iso_639_1 === "es"
          );

          if (!trailer) {
            trailer = videos.find(
              (v) => v.type === "Trailer" && v.official && v.site === "YouTube"
            );
          }

          if (!trailer) {
            trailer = videos.find(
              (v) => v.type === "Trailer" && v.site === "YouTube"
            );
          }

          if (!trailer) {
            trailer = videos.find((v) => v.site === "YouTube");
          }

          if (trailer) {
            setTrailerKey(trailer.key);
          }
        } catch (error) {
          console.error("Error al cargar trailer:", error);
        }
      } else if (movie && movie.trailer_key) {
        setTrailerKey(movie.trailer_key);
      }
    };

    loadTrailer();
  }, [movie]);

  // Si no hay película disponible, mostramos un hero en estado de carga
  if (!movie) {
    return (
      <motion.div
        className="movie-detail-hero movie-detail-hero-loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="movie-detail-hero-loading-content">
          <div className="movie-detail-hero-spinner"></div>
          <div className="movie-detail-loading-text">{t("common.loading")}</div>
        </div>
      </motion.div>
    );
  }

  // Extraer datos de la película
  const {
    title,
    backdrop_path,
    poster_path,
    tagline,
    description,
    vote_average,
    release_date,
    duration,
    genres = [],
    director,
    starring = [],
  } = movie;

  // Formateamos el tiempo de duración
  const formatRuntime = (minutes) => {
    if (!minutes) return "";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  // Obtener la clave del trailer (ya sea de la película o cargada dinámicamente)
  const trailerKeyToUse = trailerKey || movie?.trailer_key;

  // Manejador para activar/desactivar el trailer
  const handleTrailerToggle = () => {
    console.log("Toggle trailer:", !trailerActive);
    setTrailerActive(!trailerActive);

    if (trailerActive) {
      if (trailerRef.current) {
        trailerRef.current.src = "";
        setTimeout(() => {
          trailerRef.current = null;
        }, 100);
      }
    } else {
      setTimeout(() => {
        if (trailerRef.current) {
          // Reiniciar el iframe para que comience la reproducción
          const currentSrc = trailerRef.current.src;
          trailerRef.current.src = currentSrc;
        }
      }, 100);
    }
  };

  // Manejar la carga del trailer
  const handleTrailerLoad = () => {
    console.log("Trailer cargado correctamente");
  };

  // Construir la URL del trailer al estilo Hero
  const trailerUrl = trailerKeyToUse
    ? `https://www.youtube.com/embed/${trailerKeyToUse}?autoplay=1&mute=0&controls=1&showinfo=0&rel=0&loop=1&playlist=${trailerKeyToUse}&enablejsapi=1&origin=${window.location.origin}`
    : "";

  // Efecto para detectar si el hero está en el viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (!entry.isIntersecting && trailerActive) {
          setTrailerActive(false);
        }
      },
      { threshold: 0.3 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, [trailerActive]);

  // Efecto para precargar la imagen del fondo
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    const preloadImage = () => {
      if (backdrop_path) {
        const img = new Image();
        img.onload = () => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          setIsLoading(false);
          setHeroLoaded(true);
        };
        img.onerror = () => {
          setIsLoading(false);
        };
        img.src = backdrop_path;
      } else {
        setIsLoading(false);
      }
    };

    preloadImage();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [backdrop_path]);

  // Limpiar temporizador al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Animaciones para elementos del héroe
  const heroContentAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const heroItemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const trailerButtonAnimation = {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(229, 9, 20, 0.5)",
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 300,
      },
    },
  };

  if (isLoading) {
    return (
      <motion.div
        className="movie-detail-hero-loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="movie-detail-hero-loading-content">
          <div className="movie-detail-hero-spinner"></div>
          <p className="loading-text">{t("common.loading")}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={heroRef}
      className={`movie-detail-hero ${
        trailerActive ? "movie-detail-trailer-active" : ""
      }`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      {/* Fondo del hero con animación */}
      <motion.div
        ref={bgRef}
        className={`movie-detail-parallax-bg ${
          trailerActive ? "movie-detail-dimmed" : ""
        }`}
        style={{
          backgroundImage: backdrop_path
            ? `url(${backdrop_path})`
            : "linear-gradient(45deg, #1a1a2e 0%, #16213e 100%)",
        }}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{
          scale: trailerActive ? 1.05 : heroLoaded ? 1.05 : 1,
          opacity: 1,
        }}
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
      />

      {/* Overlay para mejorar visibilidad del contenido */}
      <motion.div
        className={`movie-detail-hero-overlay ${
          trailerActive ? "movie-detail-transparent" : ""
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Contenedor para el trailer de YouTube con animación */}
      <AnimatePresence>
        {trailerActive && trailerKeyToUse && (
          <motion.div
            className="movie-detail-trailer-container movie-detail-active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 3,
            }}
          >
            <iframe
              ref={trailerRef}
              className="movie-detail-trailer-frame"
              src={trailerUrl}
              title={`${title} Trailer`}
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

      {/* Contenido principal del hero con animaciones */}
      <div className="movie-detail-hero-content-container">
        <motion.div
          className={`movie-detail-hero-content ${
            trailerActive ? "movie-detail-content-hidden" : ""
          }`}
          variants={heroContentAnimation}
          initial="hidden"
          animate="visible"
        >
          <div className="movie-detail-hero-content-inner">
            <motion.h1
              className="movie-detail-hero-title"
              variants={heroItemAnimation}
            >
              {title}
            </motion.h1>

            {/* Tagline con animación */}
            {!trailerActive && tagline && (
              <motion.div
                className="movie-detail-hero-tagline"
                variants={heroItemAnimation}
              >
                {tagline}
              </motion.div>
            )}

            {/* Metadatos con animación */}
            {!trailerActive && (
              <motion.div
                className="movie-detail-hero-meta"
                variants={heroItemAnimation}
              >
                {vote_average && (
                  <span className="movie-detail-hero-rating">
                    <i className="fas fa-star"></i>
                    {vote_average.toFixed(1)}
                  </span>
                )}

                {movie.year && (
                  <span className="movie-detail-hero-year">{movie.year}</span>
                )}

                {duration && (
                  <span className="movie-detail-hero-duration">
                    {formatRuntime(duration)}
                  </span>
                )}

                <span className="movie-detail-content-type movie">
                  {movie.media_type === "tv"
                    ? t("common.series")
                    : t("common.movie")}
                </span>
              </motion.div>
            )}

            {/* Información de director y actores */}
            {!trailerActive && (
              <motion.div
                className="movie-detail-hero-creators"
                variants={heroItemAnimation}
              >
                {director && (
                  <div className="movie-detail-hero-director">
                    <span className="movie-detail-director-label">
                      {movie.media_type === "tv"
                        ? t("movieDetail.creator")
                        : t("movieDetail.director")}
                      :
                    </span>
                    <span className="movie-detail-director-name">
                      {director}
                    </span>
                  </div>
                )}
                {starring && starring.length > 0 && (
                  <div className="movie-detail-hero-starring">
                    <span className="movie-detail-starring-label">
                      {t("movieDetail.starring")}:
                    </span>
                    <span className="movie-detail-starring-names">
                      {starring.slice(0, 3).join(", ")}
                    </span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Géneros con animación */}
            {!trailerActive && genres && genres.length > 0 && (
              <motion.div
                className="movie-detail-hero-genres"
                variants={heroItemAnimation}
              >
                {genres.map((genre, index) => (
                  <motion.div
                    key={index}
                    className="movie-detail-genre-tag"
                    whileHover={{
                      y: -4,
                      boxShadow: "0 8px 15px rgba(0,0,0,0.2)",
                    }}
                  >
                    {genre}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Sinopsis con animación */}
            {!trailerActive && description && (
              <motion.p
                className="movie-detail-hero-description"
                variants={heroItemAnimation}
              >
                {description}
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

MovieDetailHero.propTypes = {
  movie: PropTypes.object,
};

export default MovieDetailHero;
