import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useLanguage } from "../../contexts/LanguageContext";
import MovieDetailHero from "./MovieDetailHero";
import MovieInfo from "./MovieInfo";
import Cast from "./Cast";
import MediaGallery from "./MediaGallery";
import MoviePoster from "./MoviePoster";
import FavoriteButton from "../UI/FavoriteButton";

const MovieDetail = ({ movie }) => {
  const { t } = useLanguage();
  const [trailerActive, setTrailerActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Efecto para detectar el desplazamiento y aplicar estilos en consecuencia
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Manejador para activar el trailer desde cualquier componente hijo
  const handlePlayTrailer = () => {
    setTrailerActive(true);

    // Desplazar suavemente hacia arriba para mostrar el trailer en el hero
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!movie) {
    return (
      <div className="movie-detail-loading-container">
        <div className="movie-detail-loading-spinner"></div>
        <p>{t("common.loading")}</p>
      </div>
    );
  }

  // Preparar objeto para el botón de favoritos
  const favoriteItem = {
    id: movie.id,
    title: movie.title,
    posterPath: movie.posterUrl || movie.posterPath,
    year: movie.year || movie.releaseDate?.substring(0, 4),
    type: movie.isSeries ? "series" : "movie",
    description: movie.overview || movie.description,
  };

  return (
    <div className="movie-detail-container">
      {/* Hero de la película con trailer incorporado */}
      <MovieDetailHero
        movie={movie}
        trailerActive={trailerActive}
        setTrailerActive={setTrailerActive}
      />

      <div className="movie-detail-content">
        <div className="movie-detail-layout">
          {/* Columna lateral con póster mejorado */}
          <div className="movie-detail-sidebar">
            {/* Componente de póster mejorado */}
            <MoviePoster movie={movie} onPlayTrailer={handlePlayTrailer} />

            {/* Botones de acción para póster */}
            <div className="movie-detail-poster-actions">
              <button
                className="movie-detail-btn movie-detail-btn-trailer"
                onClick={handlePlayTrailer}
              >
                <i className="fas fa-play"></i> {t("common.watchTrailer")}
              </button>

              <FavoriteButton
                item={favoriteItem}
                size="lg"
                showText={true}
                className="movie-detail-btn"
              />
            </div>

            {/* Sección de "Dónde ver" */}
            {movie.streamingProviders &&
              movie.streamingProviders.length > 0 && (
                <div className="movie-detail-where-to-watch">
                  <h3 className="movie-detail-sidebar-title">
                    <i className="fas fa-tv"></i>{" "}
                    {t("movieDetail.whereToWatch")}
                  </h3>
                  <div className="movie-detail-streaming-services">
                    {movie.streamingProviders.map((provider, index) => (
                      <div
                        key={index}
                        className="movie-detail-streaming-provider"
                      >
                        <img
                          src={provider.logo}
                          alt={provider.name}
                          className="movie-detail-provider-logo"
                        />
                        <span className="movie-detail-provider-name">
                          {provider.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Información adicional */}
            <div className="movie-detail-sidebar-info">
              <h3 className="movie-detail-sidebar-title">
                <i className="fas fa-info-circle"></i>{" "}
                {t("movieDetail.additionalInfo")}
              </h3>
              <ul className="movie-detail-additional-info-list">
                {movie.originalTitle && (
                  <li className="movie-detail-additional-info-item">
                    <span className="movie-detail-info-label">
                      {t("movieDetail.originalTitle")}:
                    </span>
                    <span className="movie-detail-info-value">
                      {movie.originalTitle}
                    </span>
                  </li>
                )}

                {movie.status && (
                  <li className="movie-detail-additional-info-item">
                    <span className="movie-detail-info-label">
                      {t("movieDetail.status")}:
                    </span>
                    <span className="movie-detail-info-value">
                      {movie.status}
                    </span>
                  </li>
                )}

                {movie.originalLanguage && (
                  <li className="movie-detail-additional-info-item">
                    <span className="movie-detail-info-label">
                      {t("movieDetail.originalLanguage")}:
                    </span>
                    <span className="movie-detail-info-value">
                      {t(`languages.${movie.originalLanguage}`) ||
                        movie.originalLanguage}
                    </span>
                  </li>
                )}

                {movie.budget && (
                  <li className="movie-detail-additional-info-item">
                    <span className="movie-detail-info-label">
                      {t("movieDetail.budget")}:
                    </span>
                    <span className="movie-detail-info-value">
                      {movie.budget}
                    </span>
                  </li>
                )}

                {movie.revenue && (
                  <li className="movie-detail-additional-info-item">
                    <span className="movie-detail-info-label">
                      {t("movieDetail.revenue")}:
                    </span>
                    <span className="movie-detail-info-value">
                      {movie.revenue}
                    </span>
                  </li>
                )}
              </ul>
            </div>

            {/* Botones de acción flotantes que aparecen al hacer scroll */}
            <div
              className={`movie-detail-floating-actions ${
                isScrolled ? "active" : ""
              }`}
            >
              <button
                className="movie-detail-floating-action movie-detail-floating-trailer"
                onClick={handlePlayTrailer}
              >
                <i className="fas fa-film"></i>
                <span>{t("common.watchTrailer")}</span>
              </button>

              <FavoriteButton
                item={favoriteItem}
                size="md"
                className="movie-detail-floating-action movie-detail-floating-favorite"
              />

              <button className="movie-detail-floating-action movie-detail-floating-list">
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>

          {/* Contenido principal de la película */}
          <div className="movie-detail-main-content">
            {/* Información detallada de la película con pestañas */}
            <MovieInfo movie={movie} />

            {/* Sección de reparto */}
            <Cast cast={movie.cast} />

            {/* Galería de medios mejorada */}
            <MediaGallery movie={movie} />

            {/* Películas relacionadas */}
            {movie.relatedMovies && movie.relatedMovies.length > 0 && (
              <div className="movie-detail-related-movies">
                <h3 className="movie-detail-section-title">
                  <i className="fas fa-film"></i>{" "}
                  {t("movieDetail.relatedMovies")}
                </h3>
                <div className="movie-detail-related-movies-grid">
                  {movie.relatedMovies.map((relatedMovie, index) => (
                    <div key={index} className="movie-detail-related-movie">
                      <div className="movie-detail-related-movie-poster">
                        <img
                          src={relatedMovie.posterPath}
                          alt={relatedMovie.title}
                          className="movie-detail-related-poster-img"
                        />
                        <div className="movie-detail-related-poster-overlay">
                          <button className="movie-detail-related-action-btn">
                            <i className="fas fa-info-circle"></i>
                          </button>
                        </div>
                      </div>
                      <h4 className="movie-detail-related-movie-title">
                        {relatedMovie.title}
                      </h4>
                      <div className="movie-detail-related-movie-info">
                        <span className="movie-detail-related-movie-year">
                          {relatedMovie.year}
                        </span>
                        {relatedMovie.rating && (
                          <span className="movie-detail-related-movie-rating">
                            <i className="fas fa-star"></i>{" "}
                            {relatedMovie.rating}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

MovieDetail.propTypes = {
  movie: PropTypes.object,
};

export default MovieDetail;
