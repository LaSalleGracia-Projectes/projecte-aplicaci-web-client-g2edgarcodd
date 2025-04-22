import React, { useRef, useEffect } from "react";
import { useFavorites } from "../../contexts/FavoritesContext";
import { useLanguage } from "../../contexts/LanguageContext";
import PropTypes from "prop-types";

function FavoriteButton({
  item,
  size = "md",
  showText = false,
  className = "",
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t } = useLanguage();
  const favoriteIconRef = useRef(null);

  const isItemFavorite = isFavorite(item.id);

  // Determinar el tipo de contenido para la estructura del favorito
  const contentType =
    item.contentType === "film" || item.type === "movie" ? "movie" : "series";

  const handleToggleFavorite = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Preparar objeto para guardar en favoritos
    const favoriteItem = {
      id: item.id,
      title: item.title,
      posterPath: item.image || item.posterPath,
      year: item.year,
      type: contentType,
      description: item.description?.substring(0, 100), // Limitar longitud de descripción
    };

    // Llamar a la función del contexto para alternar favorito
    toggleFavorite(favoriteItem);

    // Animación del icono
    if (favoriteIconRef.current) {
      favoriteIconRef.current.classList.add("beat");
      favoriteIconRef.current.addEventListener(
        "animationend",
        () => {
          if (favoriteIconRef.current) {
            favoriteIconRef.current.classList.remove("beat");
          }
        },
        { once: true }
      );
    }
  };

  // Clases para tamaños
  const sizeClass =
    {
      sm: "favorite-btn-sm",
      md: "favorite-btn-md",
      lg: "favorite-btn-lg",
    }[size] || "favorite-btn-md";

  return (
    <button
      className={`favorite-btn ${sizeClass} ${
        isItemFavorite ? "active" : ""
      } ${className}`}
      onClick={handleToggleFavorite}
      aria-label={
        isItemFavorite
          ? t("favorites.removeFromFavorites")
          : t("favorites.addToFavorites")
      }
    >
      <span ref={favoriteIconRef} className="favorite-icon">
        <i className="fas fa-heart"></i>
      </span>

      {showText && (
        <span className="favorite-text">
          {isItemFavorite
            ? t("favorites.removeFromFavorites")
            : t("favorites.addToFavorites")}
        </span>
      )}
    </button>
  );
}

FavoriteButton.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string,
    posterPath: PropTypes.string,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string,
    contentType: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  showText: PropTypes.bool,
  className: PropTypes.string,
};

export default FavoriteButton;
