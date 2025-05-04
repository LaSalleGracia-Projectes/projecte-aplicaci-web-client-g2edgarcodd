import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";

function GenreSelector({ genres, activeGenre, onGenreSelect }) {
  const { t } = useLanguage();

  return (
    <div className="genre-selector">
      <h3>{t("explore.genres")}</h3>
      <ul className="genre-list">
        {genres.map((genre) => (
          <li
            key={genre.id}
            className={`genre-item ${activeGenre === genre.id ? "active" : ""}`}
            onClick={() => onGenreSelect(genre.id)}
          >
            <span className="genre-name">{genre.name}</span>
            {activeGenre === genre.id && <i className="fas fa-check"></i>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GenreSelector;
