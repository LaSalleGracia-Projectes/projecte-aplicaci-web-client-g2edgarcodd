import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { useFavorites } from "../../contexts/FavoritesContext";
import "../../styles/components/newreleases.css";

function NewReleases({ content = { movies: [], series: [] }, language }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Procesar todas las películas y series
  const processedContent = useMemo(() => {
    const currentYear = new Date().getFullYear();

    // Procesar películas
    const processedMovies = content.movies.map((movie) => {
      // Extraer el año de release_date
      const releaseYear = movie.release_date
        ? parseInt(movie.release_date.substring(0, 4))
        : 0;

      // Determinar si es un lanzamiento nuevo
      const isNew = releaseYear >= currentYear - 1;

      // Mapear los ids de géneros a claves de traducción
      const genreKey =
        movie.genre_ids && movie.genre_ids.length > 0
          ? mapGenreIdToKey(movie.genre_ids[0])
          : "genres.other";

      return {
        id: movie.id,
        titleKey: movie.title,
        image: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        year: movie.release_date ? movie.release_date.substring(0, 4) : "",
        rating: movie.vote_average
          ? parseFloat(movie.vote_average).toFixed(1)
          : "0.0",
        genreKey: genreKey,
        category: "movies",
        isNew: isNew,
        mediaType: movie.media_type || "movie",
      };
    });

    // Procesar series
    const processedSeries = content.series.map((show) => {
      // Extraer el año de first_air_date
      const releaseYear = show.first_air_date
        ? parseInt(show.first_air_date.substring(0, 4))
        : 0;

      // Determinar si es un lanzamiento nuevo
      const isNew = releaseYear >= currentYear - 1;

      // Mapear los ids de géneros a claves de traducción
      const genreKey =
        show.genre_ids && show.genre_ids.length > 0
          ? mapGenreIdToKey(show.genre_ids[0])
          : "genres.other";

      return {
        id: show.id,
        titleKey: show.name,
        image: show.poster_path
          ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
          : "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        year: show.first_air_date ? show.first_air_date.substring(0, 4) : "",
        rating: show.vote_average
          ? parseFloat(show.vote_average).toFixed(1)
          : "0.0",
        genreKey: genreKey,
        category: "series",
        isNew: isNew,
        mediaType: "tv",
      };
    });

    return [...processedMovies, ...processedSeries];
  }, [content]);

  // Función para mapear IDs de género a claves de traducción
  function mapGenreIdToKey(genreId) {
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
      // IDs de géneros de series
      10759: "genres.action",
      10762: "genres.kids",
      10763: "genres.news",
      10764: "genres.reality",
      10765: "genres.scifi",
      10766: "genres.soap",
      10767: "genres.talk",
      10768: "genres.war",
    };
    return genreMap[genreId] || "genres.other";
  }

  // Filtrar por categoría
  const filteredReleases =
    activeCategory === "all"
      ? processedContent
      : processedContent.filter((item) => item.category === activeCategory);

  // Comprobar si es posible desplazarse a la izquierda o a la derecha
  const checkScrollability = () => {
    if (sliderRef.current) {
      const { scrollWidth, clientWidth, scrollLeft } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollWidth - (scrollLeft + clientWidth) > 5);
    }
  };

  // Configurar detección de desplazamiento
  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      checkScrollability();
      slider.addEventListener("scroll", handleSliderScroll);
      window.addEventListener("resize", checkScrollability);
    }

    return () => {
      if (slider) {
        slider.removeEventListener("scroll", handleSliderScroll);
      }
      window.removeEventListener("resize", checkScrollability);
    };
  }, [activeCategory, filteredReleases]);

  // Manejar el desplazamiento con botones
  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -500 : 500; // Ajustar para mejor UX
      const currentScroll = sliderRef.current.scrollLeft;

      sliderRef.current.scrollTo({
        left: currentScroll + scrollAmount,
        behavior: "smooth",
      });

      // Actualizar después del desplazamiento
      setTimeout(checkScrollability, 600);
    }
  };

  // Manejar el evento de desplazamiento natural
  const handleSliderScroll = () => {
    checkScrollability();
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

  // Función para manejar favoritos
  const handleToggleFavorite = (e, item) => {
    e.preventDefault(); // Prevenir navegación
    e.stopPropagation(); // Prevenir propagación del evento

    const favoriteItem = {
      id: item.id,
      title: item.titleKey,
      posterPath: item.image,
      year: item.year,
      type: item.mediaType === "tv" ? "series" : "movie",
      rating: item.rating,
    };

    toggleFavorite(favoriteItem);
  };

  return (
    <section className="new-releases-section">
      <div className="section-header">
        <h2>{t("home.newReleases")}</h2>

        <div className="filter-tabs">
          <button
            className={`filter-tab ${activeCategory === "all" ? "active" : ""}`}
            onClick={() => setActiveCategory("all")}
          >
            {t("common.all")}
          </button>
          <button
            className={`filter-tab ${
              activeCategory === "movies" ? "active" : ""
            }`}
            onClick={() => setActiveCategory("movies")}
          >
            {t("navbar.movies")}
          </button>
          <button
            className={`filter-tab ${
              activeCategory === "series" ? "active" : ""
            }`}
            onClick={() => setActiveCategory("series")}
          >
            {t("navbar.series")}
          </button>
        </div>
      </div>

      <div className="new-releases-outer-container">
        {/* Flecha izquierda */}
        <button
          className={`releases-arrow arrow-left ${
            canScrollLeft ? "visible" : "hidden"
          }`}
          onClick={() => handleScroll("left")}
          aria-label={t("common.scrollLeft")}
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        <div className="new-releases-slider-container">
          {filteredReleases.length > 0 ? (
            <div
              className="new-releases-slider"
              ref={sliderRef}
              onScroll={handleSliderScroll}
            >
              {filteredReleases.map((item) => (
                <Link
                  to={`/${item.mediaType === "tv" ? "series" : "movie"}/${
                    item.id
                  }`}
                  className="release-item"
                  key={`${item.mediaType}-${item.id}`}
                >
                  <div className="release-image-container">
                    <img
                      src={item.image}
                      alt={item.titleKey}
                      className="release-image"
                      loading="lazy"
                    />

                    {item.isNew && (
                      <span className="new-badge">{t("common.new")}</span>
                    )}

                    {/* Reemplazar FavoriteButton con botón nativo similar a los otros componentes */}
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

                    {/* Rating stars */}
                    <div className="rating-stars">
                      {renderStars(parseFloat(item.rating))}
                    </div>

                    <div className="release-overlay">
                      <div className="release-actions">
                        <button className="play-now-btn">
                          <i className="fas fa-play"></i>
                        </button>
                      </div>

                      <div className="release-meta">
                        <span className="release-year">{item.year}</span>
                      </div>
                    </div>
                  </div>

                  <div className="release-info">
                    <h3 className="release-title" title={item.titleKey}>
                      {item.titleKey}
                    </h3>
                    <div className="release-category-info">
                      <span className="release-genre">{t(item.genreKey)}</span>
                      <span className={`media-type-badge ${item.mediaType}`}>
                        {item.mediaType === "tv"
                          ? t("common.series")
                          : t("common.movie")}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-content-message">
              <p>{t("home.noContentAvailable")}</p>
            </div>
          )}
        </div>

        {/* Flecha derecha */}
        <button
          className={`releases-arrow arrow-right ${
            canScrollRight ? "visible" : "hidden"
          }`}
          onClick={() => handleScroll("right")}
          aria-label={t("common.scrollRight")}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </section>
  );
}

export default NewReleases;
