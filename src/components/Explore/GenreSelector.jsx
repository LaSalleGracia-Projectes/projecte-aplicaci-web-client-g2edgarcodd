import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useLocation } from "react-router-dom";

function GenreSelector({ genres, activeGenre, onGenreSelect }) {
  const { t } = useLanguage();
  const location = useLocation();

  // Función para construir la URL completa para un género
  const getGenreUrl = (genreId) => {
    const path = location.pathname;
    // Recuperar el valor de ordenación actual de los parámetros de URL
    const urlParams = new URLSearchParams(window.location.search);
    const sortParam = urlParams.get("sort") || "popular";

    return `${path}?genre=${genreId}&sort=${sortParam}`;
  };

  // Manejar el clic en un género y recargar la página
  const handleGenreClick = (genreId) => {
    // Si ya estamos en este género, no hacer nada
    if (genreId === activeGenre) return;

    // Llamar a la función de cambio de género pasada como prop
    onGenreSelect(genreId);

    // Construir la URL y navegar a ella
    const url = getGenreUrl(genreId);
    window.location.href = url;
  };

  return (
    <div className="genre-selector">
      <h3>{t("explore.genres")}</h3>
      <ul className="genre-list">
        {genres.map((genre) => (
          <li
            key={genre.id}
            className={`genre-item ${activeGenre === genre.id ? "active" : ""}`}
            onClick={() => handleGenreClick(genre.id)}
            role="button"
            tabIndex="0"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleGenreClick(genre.id);
              }
            }}
          >
            <div className="genre-content">
              <span className="genre-name">{genre.name}</span>
              {activeGenre === genre.id && (
                <span className="genre-check">
                  <i className="fas fa-check"></i>
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GenreSelector;
