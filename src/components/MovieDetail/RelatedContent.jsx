import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import PropTypes from "prop-types";
import "../../styles/components/moviedetail-enhanced.css";

function RelatedContent({ movieId, movieGenres = [] }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("recommended");
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);

  // Simulación de carga de películas relacionadas
  useEffect(() => {
    setLoading(true);

    // Simulamos una petición a API
    setTimeout(() => {
      const demoMovies = generateDemoMovies(movieId, activeTab);
      setRelatedMovies(demoMovies);
      setLoading(false);
    }, 800);
  }, [movieId, activeTab]);

  // Generar películas demo para la muestra
  const generateDemoMovies = (movieId, type) => {
    const baseMovies = [
      {
        id: `related-${type}-1`,
        title: "Interestelar",
        poster:
          "https://es.web.img3.acsta.net/pictures/14/10/02/11/07/341344.jpg",
        year: "2014",
        genres: ["Ciencia ficción", "Aventura"],
        rating: 9.2,
      },
      {
        id: `related-${type}-2`,
        title: "Blade Runner 2049",
        poster:
          "https://es.web.img2.acsta.net/pictures/17/08/24/11/58/347696.jpg",
        year: "2017",
        genres: ["Ciencia ficción", "Drama"],
        rating: 8.7,
      },
      {
        id: `related-${type}-3`,
        title: "La Llegada",
        poster:
          "https://es.web.img3.acsta.net/pictures/16/10/13/11/15/317120.jpg",
        year: "2016",
        genres: ["Ciencia ficción", "Drama"],
        rating: 8.5,
      },
      {
        id: `related-${type}-4`,
        title: "Ex Machina",
        poster:
          "https://es.web.img3.acsta.net/pictures/14/12/17/10/24/051812.jpg",
        year: "2014",
        genres: ["Ciencia ficción", "Thriller"],
        rating: 8.3,
      },
      {
        id: `related-${type}-5`,
        title: "Mad Max: Fury Road",
        poster:
          "https://es.web.img3.acsta.net/pictures/15/04/14/15/25/128120.jpg",
        year: "2015",
        genres: ["Acción", "Aventura"],
        rating: 8.8,
      },
      {
        id: `related-${type}-6`,
        title: "El Renacido",
        poster:
          "https://es.web.img3.acsta.net/pictures/15/12/23/12/37/091500.jpg",
        year: "2015",
        genres: ["Aventura", "Supervivencia"],
        rating: 8.6,
      },
      {
        id: `related-${type}-7`,
        title: "La La Land",
        poster:
          "https://es.web.img3.acsta.net/pictures/16/11/30/15/41/048911.jpg",
        year: "2016",
        genres: ["Musical", "Drama"],
        rating: 8.4,
      },
      {
        id: `related-${type}-8`,
        title: "Parásitos",
        poster:
          "https://es.web.img3.acsta.net/pictures/19/06/07/12/47/3068315.jpg",
        year: "2019",
        genres: ["Drama", "Thriller"],
        rating: 9.0,
      },
    ];

    // Adaptar la lista según el tipo seleccionado
    if (type === "recommended") {
      // Ordenar por puntuación para recomendados
      return [...baseMovies].sort((a, b) => b.rating - a.rating);
    } else if (type === "similar") {
      // Cambiar ligeramente los IDs para simular contenido diferente
      return baseMovies.map((movie) => ({
        ...movie,
        id: `similar-${movie.id}`,
      }));
    } else {
      // Cambiar los años para simular lanzamientos más recientes
      return baseMovies.map((movie) => ({
        ...movie,
        id: `latest-${movie.id}`,
        year: "2023",
      }));
    }
  };

  // Navegar por el carrusel
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -500 : 500;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Componente de esqueleto para carga
  const RelatedContentSkeleton = () => (
    <div className="movie-detail-related-skeleton">
      <div className="skeleton-title"></div>
      <div className="skeleton-tabs">
        <div className="skeleton-tab"></div>
        <div className="skeleton-tab"></div>
        <div className="skeleton-tab"></div>
      </div>
      <div className="related-items-skeleton">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="related-item-skeleton">
            <div className="skeleton-poster"></div>
            <div className="skeleton-title"></div>
            <div className="skeleton-meta"></div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return <RelatedContentSkeleton />;
  }

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
          {relatedMovies.map((movie) => (
            <div key={movie.id} className="movie-detail-related-item">
              <Link
                to={`/movie/${movie.id}`}
                className="movie-detail-related-poster-link"
              >
                <div className="movie-detail-related-poster-wrapper">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="movie-detail-related-poster"
                  />
                  <div className="movie-detail-related-poster-overlay">
                    <div className="related-movie-rating">
                      <i className="fas fa-star"></i> {movie.rating.toFixed(1)}
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
                    {movie.year}
                  </span>
                  <span className="movie-detail-related-genres">
                    {movie.genres.join(", ")}
                  </span>
                </div>
              </div>
            </div>
          ))}
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
  movieGenres: PropTypes.arrayOf(PropTypes.string),
};

export default RelatedContent;
