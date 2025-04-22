import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import FavoriteButton from "../UI/FavoriteButton";
import PropTypes from "prop-types";

function FavoriteItem({ favorite, onRemoveFavorite }) {
  const { t } = useLanguage();

  // Determina la URL de destino según el tipo de contenido
  const getItemUrl = () => {
    if (favorite.type === "movie") {
      return `/movie/${favorite.id}`;
    } else {
      return `/series/${favorite.id}`;
    }
  };

  return (
    <div className="favorite-item">
      <div className="favorite-item-poster">
        {favorite.posterPath ? (
          <img
            src={favorite.posterPath}
            alt={favorite.title}
            className="favorite-poster-img"
          />
        ) : (
          <div className="favorite-poster-placeholder">
            <i className="fas fa-film"></i>
          </div>
        )}

        <div className="favorite-item-overlay">
          <Link to={getItemUrl()} className="favorite-item-overlay-btn">
            <i className="fas fa-info-circle"></i>
            <span>{t("common.moreInfo")}</span>
          </Link>

          <div className="favorite-item-actions">
            <FavoriteButton
              item={favorite}
              size="sm"
              className="favorite-item-action-btn"
            />
          </div>
        </div>
      </div>

      <div className="favorite-item-info">
        <h3 className="favorite-item-title">{favorite.title}</h3>
        <div className="favorite-item-details">
          {favorite.year && (
            <span className="favorite-item-year">{favorite.year}</span>
          )}
          <span className="favorite-item-type">
            <i
              className={`fas ${
                favorite.type === "movie" ? "fa-film" : "fa-tv"
              }`}
            ></i>
            {favorite.type === "movie" ? t("common.film") : t("common.series")}
          </span>
        </div>
        {favorite.description && (
          <p className="favorite-item-description">{favorite.description}</p>
        )}
      </div>
    </div>
  );
}

FavoriteItem.propTypes = {
  favorite: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    posterPath: PropTypes.string,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  onRemoveFavorite: PropTypes.func.isRequired,
};

export default FavoriteItem;
