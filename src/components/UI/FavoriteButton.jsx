import React, { useState } from "react";
import PropTypes from "prop-types";
import { useFavorites } from "../../contexts/FavoritesContext";
import { useLanguage } from "../../contexts/LanguageContext";
import "../../styles/components/ui.css";

/**
 * Botón para añadir/quitar elementos de favoritos
 */
const FavoriteButton = ({
  item,
  size = "md",
  showText = false,
  className = "",
}) => {
  const { t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);

  const isItemFavorite = isFavorite(item.id);

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Activar animación
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);

    // Actualizar favoritos
    toggleFavorite(item);
  };

  return (
    <button
      onClick={handleToggleFavorite}
      className={`favorite-button ${size} ${isItemFavorite ? "active" : ""} ${
        isAnimating ? "animating" : ""
      } ${className}`}
      aria-label={
        isItemFavorite
          ? t("favorites.removeFromFavorites")
          : t("favorites.addToFavorites")
      }
    >
      <i className={`${isItemFavorite ? "fas" : "far"} fa-heart`}></i>
      {showText && (
        <span className="favorite-button-text">
          {isItemFavorite
            ? t("favorites.removeFromFavorites")
            : t("favorites.addToFavorites")}
        </span>
      )}
    </button>
  );
};

FavoriteButton.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    posterPath: PropTypes.string,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  showText: PropTypes.bool,
  className: PropTypes.string,
};

export default FavoriteButton;
