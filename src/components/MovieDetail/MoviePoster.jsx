import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import "../../styles/components/movieposter.css";

const MoviePoster = ({
  posterUrl,
  title,
  className = "",
  showReflection = true,
  onClick = null,
  rating = null,
}) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!posterUrl) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setIsLoading(false);
      setHasError(false);
    };
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };
    img.src = posterUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [posterUrl]);

  // Variantes para animaciones
  const posterVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 15px 20px rgba(0,0,0,0.25)",
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };

  // Animación del brillo
  const shineVariants = {
    initial: {
      opacity: 0,
      x: "-100%",
      y: "-100%",
      skew: "20deg",
    },
    hover: {
      opacity: 0.4,
      x: "100%",
      y: "100%",
      skew: "20deg",
      transition: {
        duration: 1.2,
        ease: "easeOut",
      },
    },
  };

  if (isLoading) {
    return (
      <div className={`movie-poster-loading ${className}`}>
        <div className="movie-poster-spinner">
          <div className="movie-poster-spinner-inner"></div>
        </div>
        <div className="movie-poster-loading-text">{t("common.loading")}</div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`movie-poster-error ${className}`}>
        <div className="movie-poster-error-icon">
          <i className="fas fa-image-slash"></i>
        </div>
        <div className="movie-poster-error-text">
          {t("common.imageNotAvailable")}
        </div>
        <div className="movie-poster-error-title">{title}</div>
      </div>
    );
  }

  // Determinar el color de calificación si está disponible
  const getRatingColor = () => {
    if (!rating) return "";
    if (rating >= 8) return "excellent";
    if (rating >= 6.5) return "good";
    if (rating >= 5) return "average";
    return "poor";
  };

  return (
    <div className={`movie-poster-container ${className}`}>
      <motion.div
        className="movie-poster"
        initial="hidden"
        animate="visible"
        whileHover={onClick || isHovered ? "hover" : undefined}
        variants={posterVariants}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="movie-poster-image-container">
          <img
            src={posterUrl}
            alt={`${title} poster`}
            className="movie-poster-image"
          />

          <motion.div
            className="movie-poster-shine"
            variants={shineVariants}
            initial="initial"
            animate={isHovered ? "hover" : "initial"}
          />

          {rating && (
            <div className={`movie-poster-rating ${getRatingColor()}`}>
              <span>{Number(rating).toFixed(1)}</span>
            </div>
          )}

          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="movie-poster-hover-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="movie-poster-hover-content">
                  <div className="movie-poster-hover-title">{title}</div>

                  {onClick && (
                    <motion.button
                      className="movie-poster-hover-button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onClick();
                      }}
                    >
                      <i className="fas fa-info-circle"></i>{" "}
                      {t("common.details")}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {showReflection && <div className="movie-poster-reflection"></div>}
      </motion.div>
    </div>
  );
};

MoviePoster.propTypes = {
  posterUrl: PropTypes.string,
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  showReflection: PropTypes.bool,
  onClick: PropTypes.func,
  rating: PropTypes.number,
};

export default MoviePoster;
