import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  searchTMDBMovies,
  searchTMDBTVShows,
  getImageUrl,
} from "../../utils/api";

function SearchOverlay({ active, toggleSearch }) {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [searchPlaceholder, setSearchPlaceholder] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Actualizar el placeholder cuando cambie el idioma
  useEffect(() => {
    setSearchPlaceholder(t("common.search"));
  }, [t, language]);

  // Autofocus cuando el overlay está activo
  useEffect(() => {
    if (active && inputRef.current) {
      // Pequeño timeout para asegurar que la animación ha comenzado
      setTimeout(() => {
        inputRef.current.focus();
      }, 300);
    }
  }, [active]);

  // Función para buscar películas y series
  const searchContent = async (term) => {
    if (!term || term.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // Buscar películas y series en paralelo usando el idioma actual
      // Pasamos el idioma como tercer parámetro (el segundo es la página)
      const [moviesData, tvShowsData] = await Promise.all([
        searchTMDBMovies(term, 1, language),
        searchTMDBTVShows(term, 1, language),
      ]);

      // Preparar datos de películas
      const movies = Array.isArray(moviesData)
        ? moviesData.map((movie) => ({
            id: movie.id,
            title: movie.title,
            image: movie.poster_path
              ? getImageUrl(movie.poster_path, "small", "poster")
              : null,
            year: movie.release_date
              ? new Date(movie.release_date).getFullYear()
              : "",
            type: "movie",
          }))
        : [];

      // Preparar datos de series
      const tvShows = Array.isArray(tvShowsData)
        ? tvShowsData.map((show) => ({
            id: show.id,
            title: show.name,
            image: show.poster_path
              ? getImageUrl(show.poster_path, "small", "poster")
              : null,
            year: show.first_air_date
              ? new Date(show.first_air_date).getFullYear()
              : "",
            type: "tv",
          }))
        : [];

      // Combinar resultados: 3 películas y 3 series como máximo
      const combinedResults = [...movies.slice(0, 3), ...tvShows.slice(0, 3)];

      console.log("Resultados de búsqueda:", combinedResults);
      setSearchResults(combinedResults);
    } catch (error) {
      console.error("Error al realizar la búsqueda:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cambios en el campo de búsqueda
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Solo buscar si hay al menos 3 caracteres
    if (value.length >= 3) {
      searchContent(value);
    } else {
      setSearchResults([]);
    }
  };

  // Evitar que el clic en el interior se propague
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("search-overlay")) {
      toggleSearch();
    }
  };

  // Cerrar con la tecla Escape
  const handleKeydown = (e) => {
    if (e.key === "Escape") {
      toggleSearch();
    }
  };

  // Navegar al detalle del elemento seleccionado
  const handleResultClick = (result) => {
    if (result.type === "movie") {
      navigate(`/movie/${result.id}`);
    } else {
      navigate(`/tv/${result.id}`);
    }
    toggleSearch(); // Cerrar el overlay después de seleccionar
  };

  return (
    <div
      className={`search-overlay ${active ? "active" : ""}`}
      onClick={handleOverlayClick}
    >
      <div className="search-box">
        <input
          ref={inputRef}
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeydown}
          aria-label={searchPlaceholder}
        />

        {/* Resultados de búsqueda */}
        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((result) => (
              <div
                key={`${result.type}-${result.id}`}
                className="search-result-item"
                onClick={() => handleResultClick(result)}
              >
                {result.image ? (
                  <img
                    src={result.image}
                    alt={result.title}
                    className="search-result-image"
                  />
                ) : (
                  <div className="search-result-image-placeholder"></div>
                )}
                <div className="search-result-info">
                  <h4 className="search-result-title">{result.title}</h4>
                  <div className="search-result-meta">
                    <span>{result.year}</span>
                    <span className="search-result-type">
                      {result.type === "movie"
                        ? t("common.movie")
                        : t("common.series")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="search-loading">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
        )}
      </div>
      <div className="close-search" onClick={toggleSearch}>
        <i className="fas fa-times"></i>
      </div>
    </div>
  );
}

export default SearchOverlay;
