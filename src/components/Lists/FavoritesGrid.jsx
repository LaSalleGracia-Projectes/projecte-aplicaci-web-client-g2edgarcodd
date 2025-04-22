import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useFavorites } from "../../contexts/FavoritesContext";
import FavoriteItem from "./FavoriteItem";

function FavoritesGrid() {
  const { t } = useLanguage();
  const { favorites, removeFavorite } = useFavorites();

  if (!favorites || favorites.length === 0) {
    return (
      <div className="empty-favorites">
        <div className="empty-content">
          <i className="far fa-bookmark empty-icon"></i>
          <h3>{t("favorites.noFavorites")}</h3>
          <p>{t("favorites.noFavoritesDescription")}</p>
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
