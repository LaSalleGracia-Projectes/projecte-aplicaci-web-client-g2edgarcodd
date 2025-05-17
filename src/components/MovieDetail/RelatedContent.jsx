import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import PropTypes from "prop-types";
import "../../styles/components/moviedetail-enhanced.css";
import {
  getImageUrl,
  getContentRecommendations,
  getSimilarContent,
  getContentByGenres,
  getTMDBTrendingMovies,
} from "../../utils/api";

function RelatedContent({ movieId, movieGenres = [], mediaType = "movie" }) {
  const { t, language } = useLanguage(); // Obtener idioma actual
  const [activeTab, setActiveTab] = useState("recommended");
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);

  // Cargar datos reales de TMDB
  useEffect(() => {
    const fetchRelatedContent = async () => {
      try {
        setLoading(true);
        let results = [];

        if (activeTab === "recommended") {
          const recommendedData = await getContentRecommendations(
            movieId,
            mediaType,
            1,
            language
          );
          results = recommendedData;
        } else if (activeTab === "similar") {
          const similarData = await getSimilarContent(
            movieId,
            mediaType,
            1,
            language
          );
          results = similarData;
        } else if (activeTab === "latest") {
          // En caso de "latest", podríamos usar otro endpoint o mostrar contenido por géneros
          if (movieGenres && movieGenres.length > 0) {
            const genreContent = await getContentByGenres(
              movieGenres.slice(0, 2),
              mediaType,
              1,
              language
            );
            results = genreContent;
          } else {
            // Si no hay géneros disponibles, cargar trending
            const trendingContent = await getTMDBTrendingMovies(
              "week",
              language
            );
            results = trendingContent;
          }
        }

        // Procesar resultados para formato unificado
        const processedResults = results.map((item) => ({
          id: item.id,
          title: item.title || item.name,
          poster: getImageUrl(item.poster_path, "medium", "poster"),
          rating: item.vote_average || 0,
          year: item.release_date
            ? new Date(item.release_date).getFullYear()
            : item.first_air_date
            ? new Date(item.first_air_date).getFullYear()
            : "",
          mediaType: item.media_type || mediaType,
          popularity: item.popularity,
        }));

        setRelatedMovies(processedResults);
      } catch (error) {
        console.error("Error al cargar contenido relacionado:", error);
        setRelatedMovies([]);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchRelatedContent();
    }
  }, [movieId, activeTab, mediaType, movieGenres, language]); // Añadir language a las dependencias

  // Navegar por el carrusel
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="movie-detail-related-content-section">
      <div className="movie-detail-section-header movie-detail-with-tabs">
        <h3 className="movie-detail-section-title">
          <i className="fas fa-film"></i>
          {t("movieDetail.relatedContent")}
        </h3>

        <div className="movie-detail-content-tabs">
          <button
            className={`movie-detail-content-tab ${
              activeTab === "recommended" ? "active" : ""
            }`}
            onClick={() => setActiveTab("recommended")}
          >
            <i className="fas fa-star"></i> {t("movieDetail.recommended")}
          </button>
          <button
            className={`movie-detail-content-tab ${
              activeTab === "similar" ? "active" : ""
            }`}
            onClick={() => setActiveTab("similar")}
          >
            <i className="fas fa-clone"></i> {t("movieDetail.similar")}
          </button>
          <button
            className={`movie-detail-content-tab ${
              activeTab === "latest" ? "active" : ""
            }`}
            onClick={() => setActiveTab("latest")}
          >
            <i className="fas fa-calendar-alt"></i> {t("movieDetail.latest")}
          </button>
        </div>
      </div>

      <div className="movie-detail-related-content-carousel-container">
        <button
          className="movie-detail-carousel-arrow left"
          onClick={() => scrollCarousel("left")}
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        <div
          className="movie-detail-related-content-carousel"
          ref={carouselRef}
        >
          {loading ? (
            // Mostrar esqueletos de carga
            Array(6)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="movie-detail-related-item-skeleton">
                  <div className="movie-detail-related-poster-skeleton"></div>
                  <div className="movie-detail-related-title-skeleton"></div>
                  <div className="movie-detail-related-meta-skeleton"></div>
                </div>
              ))
          ) : relatedMovies.length > 0 ? (
            relatedMovies.map((movie) => (
              <div key={movie.id} className="movie-detail-related-item">
                <Link
                  to={`/${movie.mediaType === "tv" ? "series" : "movie"}/${
                    movie.id
                  }`}
                  className="movie-detail-related-poster-link"
                >
                  <div className="movie-detail-related-poster-wrapper">
                    <img
                      src={
                        movie.poster ||
                        "https://via.placeholder.com/185x278?text=No+Image"
                      }
                      alt={movie.title}
                      className="movie-detail-related-poster"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/185x278?text=No+Image";
                      }}
                    />
                    <div className="movie-detail-related-poster-overlay">
                      <div className="related-movie-rating">
                        <i className="fas fa-star"></i>{" "}
                        {movie.rating.toFixed(1)}
                      </div>

                      <button className="related-movie-quickview">
                        <i className="fas fa-eye"></i>
                      </button>
                    </div>
                  </div>
                </Link>

                <div className="movie-detail-related-info">
                  <h4 className="movie-detail-related-title">{movie.title}</h4>
                  <div className="movie-detail-related-meta">
                    <span className="movie-detail-related-year">
                      {movie.year || t("common.unknown")}
                    </span>
                    <span className="movie-detail-related-type">
                      {movie.mediaType === "tv"
                        ? t("common.series")
                        : t("common.movie")}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="movie-detail-no-related">
              <i className="fas fa-film-slash fa-3x"></i>
              <p>{t("movieDetail.noRelatedContent")}</p>
            </div>
          )}
        </div>

        <button
          className="movie-detail-carousel-arrow right"
          onClick={() => scrollCarousel("right")}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}

RelatedContent.propTypes = {
  movieId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  movieGenres: PropTypes.array,
  mediaType: PropTypes.string,
};

export default RelatedContent;
