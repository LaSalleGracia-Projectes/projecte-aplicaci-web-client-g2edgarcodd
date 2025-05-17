import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { useFavorites } from "../../contexts/FavoritesContext";
import FavoriteItem from "./FavoriteItem";

function FavoritesGrid() {
  const { t } = useLanguage();
  const { favorites, removeFavorite } = useFavorites();

  if (!favorites || favorites.length === 0) {
    return (
      <div className="favorites-empty-state">
        <div className="empty-state-container">
          <i className="fas fa-heart empty-icon"></i>
          <h3>{t("lists.noFavorites")}</h3>
          <p>{t("lists.noFavoritesDescription")}</p>
          <Link to="/explore" className="btn-primary">
            <i className="fas fa-compass"></i> {t("explore.title")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-grid">
      {favorites.map((favorite) => (
        <FavoriteItem
          key={favorite.id}
          favorite={favorite}
          onRemoveFavorite={removeFavorite}
        />
      ))}
    </div>
  );
}

export default FavoritesGrid;
