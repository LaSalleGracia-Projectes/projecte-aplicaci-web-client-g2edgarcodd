import React, { useState, useRef, useEffect } from "react";
import Top10Item from "./Top10Item";
import { useLanguage } from "../../../contexts/LanguageContext";
import "../../../styles/components/top10.css";
import {
  getTopRatedMovies,
  getTopRatedTVShows,
  getImageUrl,
} from "../../../utils/api";

function Top10Container() {
  const [activeCategory, setActiveCategory] = useState("movies");
  const [canScrollLeft, setCanScrollLeft] = useState(true);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [loading, setLoading] = useState(true);
  const [top10Data, setTop10Data] = useState({ movies: [], series: [] });
  const sliderRef = useRef(null);
  const { t } = useLanguage();

  function Top10Container() {
  const [activeCategory, setActiveCategory] = useState("movies");
  
  // Carga y procesa los datos de películas/series mejor valoradas
  useEffect(() => {
    const fetchTop10Data = async () => {
      // Obtiene datos y los procesa para mostrar
    };
    fetchTop10Data();
  }, []);
}

  // Cargar datos de la API
  useEffect(() => {
    const fetchTop10Data = async () => {
      setLoading(true);
      try {
        // Obtener películas y series mejor valoradas
        const [moviesData, seriesData] = await Promise.all([
          getTopRatedMovies(),
          getTopRatedTVShows(),
        ]);

        // Procesar datos de películas
        const processedMovies = moviesData.slice(0, 10).map((movie, index) => ({
          id: movie.id,
          title: movie.title,
          image: getImageUrl(movie.poster_path, "w500"),
          rank: index + 1,
          rating: movie.vote_average,
          trend: getTrendIndicator(movie.vote_average),
          type: "movie",
        }));

        // Procesar datos de series
        const processedSeries = seriesData.slice(0, 10).map((show, index) => ({
          id: show.id,
          title: show.name,
          image: getImageUrl(show.poster_path, "w500"),
          rank: index + 1,
          rating: show.vote_average,
          trend: getTrendIndicator(show.vote_average),
          type: "tv",
        }));

        setTop10Data({
          movies: processedMovies,
          series: processedSeries,
        });
      } catch (error) {
        console.error("Error al cargar datos del Top 10:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTop10Data();
  }, []);

  // Determinar tendencia basada en la calificación
  const getTrendIndicator = (rating) => {
    if (rating >= 8.5) return "up";
    if (rating >= 7.5) return "same";
    return "down";
  };

  useEffect(() => {
    setTimeout(checkScrollability, 500);
    // Añadir evento de redimensionamiento para actualizar la navegabilidad
    window.addEventListener("resize", checkScrollability);
    return () => {
      window.removeEventListener("resize", checkScrollability);
    };
  }, [activeCategory]);

  // Comprobar si es posible desplazarse a la izquierda o a la derecha
  const checkScrollability = () => {
    if (sliderRef.current) {
      const { scrollWidth, clientWidth, scrollLeft } = sliderRef.current;
      setCanScrollLeft(true);
      setCanScrollRight(scrollWidth - (scrollLeft + clientWidth) > 5);
    }
  };

  // Manejar el desplazamiento
  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const { scrollWidth, clientWidth } = sliderRef.current;
      const currentScroll = sliderRef.current.scrollLeft;
      const scrollAmount = 450;

      let newScrollPosition;

      if (direction === "left") {
        newScrollPosition = 0;
      } else {
        const maxScroll = scrollWidth - clientWidth;
        newScrollPosition = Math.min(maxScroll, currentScroll + scrollAmount);
      }

      sliderRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });

      setTimeout(checkScrollability, 600);
    }
  };

  // Manejar el evento de desplazamiento natural
  const handleSliderScroll = () => {
    checkScrollability();
  };

  return (
    <section className="top10-section">
      <div className="section-header">
        <h2>{t("home.top10")}</h2>

        <div className="top10-tabs">
          <button
            className={`top10-tab ${
              activeCategory === "movies" ? "active" : ""
            }`}
            onClick={() => setActiveCategory("movies")}
          >
            {t("navbar.movies")}
          </button>
          <button
            className={`top10-tab ${
              activeCategory === "series" ? "active" : ""
            }`}
            onClick={() => setActiveCategory("series")}
          >
            {t("navbar.series")}
          </button>
        </div>
      </div>

      <div className="top10-outer-container">
        <button
          className="slider-arrow arrow-left visible"
          onClick={() => handleScroll("left")}
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        <div className="top10-container">
          <div
            className="top10-slider"
            ref={sliderRef}
            onScroll={handleSliderScroll}
          >
            {loading ? (
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-pulse fa-3x"></i>
              </div>
            ) : (
              top10Data[activeCategory].map((item, index) => (
                <Top10Item
                  key={item.id}
                  item={item}
                  index={index}
                  type={item.type}
                />
              ))
            )}
          </div>
        </div>

        <button
          className={`slider-arrow arrow-right ${
            canScrollRight ? "visible" : "hidden"
          }`}
          onClick={() => handleScroll("right")}
          disabled={!canScrollRight}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </section>
  );
}

export default Top10Container;
