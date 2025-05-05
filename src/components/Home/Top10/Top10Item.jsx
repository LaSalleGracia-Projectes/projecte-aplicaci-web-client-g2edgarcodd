// src/components/Top10/Top10Item.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useFavorites } from "../../../contexts/FavoritesContext";

function Top10Item({ item, index, type }) {
  const { t, currentLanguage } = useLanguage();

  // Usar el contexto de favoritos en lugar del estado local
  const { isFavorite, toggleFavorite } = useFavorites();

  // Verificar si este elemento está en favoritos
  const isItemFavorite = isFavorite(item.id);

  // Genera estrellas basadas en la calificación
  const renderStars = (rating) => {
    // Convertir a escala de 5 estrellas
    const ratingOn5 = rating / 2;
    const stars = [];
    const fullStars = Math.floor(ratingOn5);
    const hasHalfStar = ratingOn5 % 1 >= 0.5;

    // Estrellas completas
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }

    // Media estrella si es necesario
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }

    // Estrellas vacías hasta completar 5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }

    return stars;
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault(); // Evitar que el clic en el icono de favoritos navegue al detalle

    // Crear objeto con la información necesaria para favoritos
    const favoriteItem = {
      id: item.id,
      title: item.title,
      posterPath: item.image,
      type: type,
      rating: item.rating,
    };

    // Llamar a la función del contexto para alternar favorito
    toggleFavorite(favoriteItem);
  };

  return (
    <Link to={`/${type}/${item.id}`} className="top10-item">
      <span className="ranking-number">{item.rank}</span>
      <div className="card">
        <img src={item.image} alt={item.title} className="poster" />
        <button
          className={`favorite-icon ${isItemFavorite ? "active" : ""}`}
          onClick={handleToggleFavorite}
          aria-label={
            isItemFavorite
              ? t("favorites.removeFromFavorites")
              : t("favorites.addToFavorites")
          }
        >
          <i className="fas fa-heart"></i>
        </button>
        <div className="rating-stars">{renderStars(item.rating)}</div>
        {item.trend === "up" && (
          <div className="trend-indicator trend-up">
            <i className="fas fa-arrow-up"></i>
          </div>
        )}
        {item.trend === "down" && (
          <div className="trend-indicator trend-down">
            <i className="fas fa-arrow-down"></i>
          </div>
        )}
      </div>
    </Link>
  );
}

export default Top10Item;
