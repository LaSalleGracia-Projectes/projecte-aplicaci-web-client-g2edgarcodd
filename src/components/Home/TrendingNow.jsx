import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { useFavorites } from "../../contexts/FavoritesContext";
import "../../styles/components/trendingnow.css";

function TrendingNow({ movies = [] }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const sliderRef = useRef(null);
  const maxScroll = useRef(0);
  const [showLeftArrow, setShowLeftArrow] = useState(true); // Mostrar flecha izquierda desde el inicio
  const [showRightArrow, setShowRightArrow] = useState(true);
  const { t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Formatea los datos de películas para el componente
  const trendingContent = movies.map((movie) => {
    // Calcula un porcentaje de tendencia basado en la popularidad
    const trendingPercentage = `+${Math.floor((movie.popularity / 10) * 100)}%`;

    // Extrae el año de la fecha de lanzamiento
    const year = movie.release_date ? movie.release_date.substring(0, 4) : "";

    // Mapea los genre_ids a un formato compatible
    const genres = (movie.genre_ids || []).slice(0, 2).map((id) => {
      // Mapeo simple de IDs de género a keys de traducción
      const genreMap = {
        28: "genres.action",
        12: "genres.adventure",
        16: "genres.animation",
        35: "genres.comedy",
        80: "genres.crime",
        99: "genres.documentary",
        18: "genres.drama",
        10751: "genres.family",
        14: "genres.fantasy",
        36: "genres.history",
        27: "genres.horror",
        10402: "genres.music",
        9648: "genres.mystery",
        10749: "genres.romance",
        878: "genres.scifi",
        10770: "genres.tvMovie",
        53: "genres.thriller",
        10752: "genres.war",
        37: "genres.western",
        10759: "genres.action",
        10765: "genres.scifi",
      };
      return { key: genreMap[id] || "genres.other" };
    });

    return {
      id: movie.id,
      titleKey: movie.title,
      image: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
        : "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      genres,
      year,
      trending: trendingPercentage,
      rating: movie.vote_average || 0,
      type: "movie",
    };
  });

  // Actualizar maxScroll cuando cambie el tamaño
  useEffect(() => {
    const updateMaxScroll = () => {
      if (sliderRef.current) {
        maxScroll.current =
          sliderRef.current.scrollWidth - sliderRef.current.clientWidth;
        updateArrowVisibility(sliderRef.current.scrollLeft);
      }
    };

    updateMaxScroll();
    window.addEventListener("resize", updateMaxScroll);

    sliderRef.current?.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", updateMaxScroll);
      sliderRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, [movies]); // Añadimos movies como dependencia para recalcular cuando cambien

  const updateArrowVisibility = (position) => {
    setShowLeftArrow(true); // Siempre mostramos la flecha izquierda
    setShowRightArrow(position < maxScroll.current - 10);
  };

  const scroll = (direction) => {
    if (sliderRef.current) {
      if (direction === "left") {
        // Para la flecha izquierda, siempre volvemos al inicio
        sliderRef.current.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        const scrollAmount = 300;
        const newPosition = scrollPosition + scrollAmount;

        sliderRef.current.scrollTo({
          left: newPosition,
          behavior: "smooth",
        });
      }
    }
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      setScrollPosition(sliderRef.current.scrollLeft);
      updateArrowVisibility(sliderRef.current.scrollLeft);
    }
  };

  const handleToggleFavorite = (e, item) => {
    e.preventDefault(); // Prevenir navegación
    e.stopPropagation(); // Prevenir propagación del evento

    const favoriteItem = {
      id: item.id,
      title: item.titleKey,
      posterPath: item.image,
      year: item.year,
      type: item.type,
      rating: item.rating,
    };

    toggleFavorite(favoriteItem);
  };

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

  return (
    <section className="trending-section">
      <div className="section-header">
        <h2>{t("home.trendingNow")}</h2>
        <p className="section-description">{t("home.trendingDescription")}</p>
      </div>

      <div className="trending-container">
        {/* Flecha izquierda siempre visible */}
        <button
          className="trending-arrow arrow-left visible"
          onClick={() => scroll("left")}
          aria-label={t("common.scrollLeft")}
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        <div className="trending-slider" ref={sliderRef}>
          {trendingContent.map((item) => (
            <Link
              to={`/${item.type}/${item.id}`}
              className="trending-item"
              key={item.id}
            >
              <div className="trending-image-container">
                <img src={item.image} alt={item.titleKey} />
                <span className="trending-badge">
                  <i className="fas fa-chart-line"></i> {item.trending}
                </span>

                {/* Botón de favoritos similar al de Top10 */}
                <button
                  className={`favorite-icon ${
                    isFavorite(item.id) ? "active" : ""
                  }`}
                  onClick={(e) => handleToggleFavorite(e, item)}
                  aria-label={
                    isFavorite(item.id)
                      ? t("favorites.removeFromFavorites")
                      : t("favorites.addToFavorites")
                  }
                >
                  <i className="fas fa-heart"></i>
                </button>

                {/* Rating stars similar al de Top10 */}
                <div className="rating-stars">{renderStars(item.rating)}</div>

                <div className="trending-overlay">
                  <div className="trending-actions">
                    <button className="play-button">
                      <i className="fas fa-play"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="trending-info">
                <h3>{item.titleKey}</h3>
                <div className="trending-meta">
                  <span className="trending-year">{item.year}</span>
                  <span className="trending-dot">•</span>
                  <span className="trending-genres">
                    {item.genres.map((genre, index) => (
                      <React.Fragment key={genre.key}>
                        {index > 0 && ", "}
                        {t(genre.key)}
                      </React.Fragment>
                    ))}
                  </span>
                  <span
                    className={
                      item.type === "movie" ? "movie-badge" : "series-badge"
                    }
                  >
                    {item.type === "movie"
                      ? t("common.movie")
                      : t("common.series")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Flecha derecha condicional */}
        <button
          className={`trending-arrow arrow-right ${
            showRightArrow ? "visible" : "hidden"
          }`}
          onClick={() => scroll("right")}
          aria-label={t("common.scrollRight")}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </section>
  );
}

export default TrendingNow;
