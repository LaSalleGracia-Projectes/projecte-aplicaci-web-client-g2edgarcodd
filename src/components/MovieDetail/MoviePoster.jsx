import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import "../../styles/components/movieposter.css";

const MoviePoster = ({
  posterUrl,
  title,
  className = "",
  showReflection = true,
  onClick = null,
}) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
      transition: { duration: 0.3 },
    },
  };

  if (isLoading) {
    return (
      <div className={`movie-poster-loading ${className}`}>
        <div className="movie-poster-spinner"></div>
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
      </div>
    );
  }

  return (
    <div className={`movie-poster-container ${className}`}>
      <motion.div
        className="movie-poster"
        initial="hidden"
        animate="visible"
        whileHover={onClick ? "hover" : undefined}
        variants={posterVariants}
        onClick={onClick}
      >
        <img
          src={posterUrl}
          alt={`${title} poster`}
          className="movie-poster-image"
        />
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
};

export default MoviePoster;
