import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/components/moviedetail.css";

const MovieDetailHero = ({ movie }) => {
  const { t } = useLanguage();
  const [trailerActive, setTrailerActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [inView, setInView] = useState(true);

  const trailerRef = useRef(null);
  const heroRef = useRef(null);
  const timeoutRef = useRef(null);

  // Si no hay película disponible, mostramos un hero en estado de carga
  if (!movie) {
    return (
      <div className="movie-detail-hero movie-detail-hero-loading">
        <div className="movie-detail-hero-spinner"></div>
        <div className="movie-detail-loading-text">{t("common.loading")}</div>
      </div>
    );
  }

  // Extraer datos de la película
  const {
    title,
    backdrop_path,
    poster_path,
    tagline,
    overview,
    vote_average,
    release_date,
    runtime,
    genres = [],
    director,
    starring = [],
    trailer_key,
    awards,
  } = movie;

  // Formateamos el año de lanzamiento
  const releaseYear = release_date ? new Date(release_date).getFullYear() : "";

  // Formateamos el tiempo de duración
  const formatRuntime = (minutes) => {
    if (!minutes) return "";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  // Formateamos el rating para asegurarnos que sea un número
  const formatRating = (rating) => {
    // Asegurarnos de que sea un número o convertirlo a 0 si no es válido
    const numRating =
      typeof rating === "number"
        ? rating
        : typeof rating === "string" && !isNaN(parseFloat(rating))
        ? parseFloat(rating)
        : 0;

    // Aplicar toFixed solo al valor numérico
    return numRating.toFixed(1);
  };

  // Manejador para activar/desactivar el trailer
  const toggleTrailer = () => {
    setTrailerActive(!trailerActive);

    // Si el trailer se está activando, lo reproducimos
    if (!trailerActive && trailerRef.current) {
      trailerRef.current.src = `https://www.youtube.com/embed/${trailer_key}?autoplay=1&mute=0&enablejsapi=1&origin=${window.location.origin}`;
    } else if (trailerRef.current) {
      // Si el trailer se está desactivando, detenemos la reproducción
      trailerRef.current.src = "";
    }
  };

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

  // Efecto para gestionar la reproducción del trailer según si está en vista
  useEffect(() => {
    if (inView && trailerActive && trailerRef.current) {
      try {
        trailerRef.current.contentWindow.postMessage(
          '{"event":"command","func":"playVideo","args":""}',
          "*"
        );
      } catch (error) {
        console.error("Error al reproducir el trailer:", error);
      }
    } else if (!inView && trailerActive && trailerRef.current) {
      try {
        trailerRef.current.contentWindow.postMessage(
          '{"event":"command","func":"pauseVideo","args":""}',
          "*"
        );
      } catch (error) {
        console.error("Error al pausar el trailer:", error);
      }
    }
  }, [inView, trailerActive]);

  // Efecto para realizar el desplazamiento paralaje en el fondo
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollPosition = window.scrollY;
        const parallaxBg = heroRef.current.querySelector(
          ".movie-detail-parallax-bg"
        );
        if (parallaxBg) {
          // Movimiento paralaje suave
          parallaxBg.style.transform = `translateY(${scrollPosition * 0.4}px)`;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Timeout para evitar carga infinita
    timeoutRef.current = setTimeout(() => {
      console.log("⏱️ Timeout en carga de imagen hero - forzando renderizado");
      setIsLoading(false);
    }, 3000);

    // Precargar imagen de fondo
    const preloadImage = () => {
      if (backdrop_path) {
        const img = new Image();
        img.onload = () => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          setIsLoading(false);
        };
        img.onerror = () => {
          console.warn(`⚠️ Error cargando imagen de fondo: ${backdrop_path}`);
          setIsLoading(false);
        };
        img.src = backdrop_path;
      } else {
        setIsLoading(false);
      }
    };

    preloadImage();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [backdrop_path]);

  // Variantes para las animaciones de contenido
  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    }),
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  if (isLoading) {
    return (
      <div className="movie-detail-hero-loading">
        <div className="movie-detail-hero-spinner"></div>
        <p className="loading-text">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div
      ref={heroRef}
      className={`movie-detail-hero ${
        trailerActive ? "movie-detail-trailer-active" : ""
      }`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Fondo con efecto paralaje */}
      <div
        className={`movie-detail-parallax-bg ${
          trailerActive ? "movie-detail-dimmed" : ""
        }`}
        style={{
          backgroundImage: backdrop_path
            ? `url(${backdrop_path})`
            : "linear-gradient(45deg, #1a1a2e 0%, #16213e 100%)",
        }}
      ></div>

      {/* Overlay para mejorar visibilidad del contenido */}
      <div
        className={`movie-detail-hero-overlay ${
          trailerActive ? "movie-detail-transparent" : ""
        }`}
      ></div>

      {/* Contenedor para el trailer de YouTube */}
      <div
        className={`movie-detail-trailer-container ${
          trailerActive ? "movie-detail-active" : ""
        }`}
      >
        <iframe
          ref={trailerRef}
          className="movie-detail-trailer-frame"
          title={`${title} Trailer`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* Contenido principal del hero */}
      <AnimatePresence mode="wait">
        <div className="movie-detail-hero-content-container">
          <div
            className={`movie-detail-hero-content ${
              trailerActive ? "movie-detail-content-hidden" : ""
            }`}
          >
            <motion.div
              className="movie-detail-hero-content-inner"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
                exit: { opacity: 0 },
              }}
            >
              {/* Badge de premios si existe */}
              {awards && !trailerActive && (
                <motion.div
                  className="movie-detail-award-badge"
                  custom={0}
                  variants={contentVariants}
                >
                  <i className="fas fa-award"></i>
                  <span>{awards}</span>
                </motion.div>
              )}

              <motion.h1
                className="movie-detail-hero-title"
                custom={1}
                variants={contentVariants}
              >
                {title}
              </motion.h1>

              {/* Tagline si existe */}
              {!trailerActive && tagline && (
                <motion.div
                  className="movie-detail-hero-tagline"
                  custom={2}
                  variants={contentVariants}
                >
                  {tagline}
                </motion.div>
              )}

              {/* Metadatos: calificación, año, duración, tipo de contenido */}
              {!trailerActive && (
                <motion.div
                  className="movie-detail-hero-meta"
                  custom={3}
                  variants={contentVariants}
                >
                  {vote_average && (
                    <span className="movie-detail-hero-rating">
                      <i className="fas fa-star"></i>
                      {formatRating(vote_average)}
                    </span>
                  )}

                  {releaseYear && (
                    <span className="movie-detail-hero-year">
                      {releaseYear}
                    </span>
                  )}

                  {runtime && (
                    <span className="movie-detail-hero-duration">
                      {formatRuntime(runtime)}
                    </span>
                  )}

                  <span className="movie-detail-content-type movie">
                    {t("common.movie")}
                  </span>
                </motion.div>
              )}

              {/* Información de director y actores */}
              {!trailerActive && (
                <motion.div
                  className="movie-detail-hero-creators"
                  custom={4}
                  variants={contentVariants}
                >
                  {director && (
                    <div className="movie-detail-hero-director">
                      <span className="movie-detail-director-label">
                        {t("movieDetail.director")}:
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

              {/* Géneros */}
              {!trailerActive && genres && genres.length > 0 && (
                <motion.div
                  className="movie-detail-hero-genres"
                  custom={5}
                  variants={contentVariants}
                >
                  {genres.map((genre, index) => (
                    <div key={index} className="movie-detail-genre-tag">
                      {genre}
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Sinopsis */}
              {!trailerActive && overview && (
                <motion.p
                  className="movie-detail-hero-description"
                  custom={6}
                  variants={contentVariants}
                >
                  {overview}
                </motion.p>
              )}

              {/* Botones de acción */}
              <motion.div
                className="movie-detail-hero-buttons"
                custom={7}
                variants={contentVariants}
              >
                <button
                  className={`movie-detail-btn-trailer ${
                    trailerActive ? "active" : ""
                  }`}
                  onClick={toggleTrailer}
                >
                  <i
                    className={`fas ${trailerActive ? "fa-times" : "fa-film"}`}
                  ></i>
                  {trailerActive
                    ? t("common.hideTrailer")
                    : t("common.watchTrailer")}
                </button>

                {!trailerActive && (
                  <>
                    <button className="movie-detail-btn-watch">
                      <i className="fas fa-play"></i>
                      {t("common.watchNow")}
                    </button>

                    <button className="movie-detail-btn-info">
                      <i className="fas fa-info-circle"></i>
                      {t("common.seeMore")}
                    </button>
                  </>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </AnimatePresence>
    </div>
  );
};

export default MovieDetailHero;
