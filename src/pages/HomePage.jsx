import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Hero from "../components/Home/Hero/Hero";
import NewReleases from "../components/Home/NewReleases";
import Top10Container from "../components/Home/Top10/Top10Container";
import FeaturedCategories from "../components/Home/FeaturedCategories";
import TrendingNow from "../components/Home/TrendingNow";
import AwardsShowcase from "../components/Home/AwardsShowcase";
import Subscription from "../components/Home/Subscription/Subscription";
import ScrollToTop from "../components/UI/ScrollToTop";
import WeatherButton from "../components/UI/WeatherButton";
import { useLanguage } from "../contexts/LanguageContext";
import {
  getAllMovies,
  getTMDBTrendingMovies,
  getTopRatedMovies,
  getMovieGenres,
  getUpcomingMovies,
  getPopularTVShows,
  getOnTheAirTVShows,
  getTopRatedTVShows,
} from "../utils/api";
import "../styles/components/homepage.css";

function HomePage() {
  const { t, language } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [popularMovies, setPopularMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [popularTVShows, setPopularTVShows] = useState([]);
  const [onAirTVShows, setOnAirTVShows] = useState([]);
  const [topRatedTVShows, setTopRatedTVShows] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar todos los datos necesarios
  const fetchAllMovieData = async () => {
    try {
      setLoading(true);

      // Cargar los datos en paralelo para mejor rendimiento, incluyendo el parámetro de idioma
      const [
        popularData,
        trendingData,
        topRatedData,
        genresData,
        upcomingData,
        popularTV,
        onAirTV,
        topRatedTV,
      ] = await Promise.all([
        getAllMovies(1, language),
        getTMDBTrendingMovies("week", language),
        getTopRatedMovies(1, language),
        getMovieGenres(language),
        getUpcomingMovies(1, language),
        getPopularTVShows(1, language),
        getOnTheAirTVShows(1, language),
        getTopRatedTVShows(1, language),
      ]);

      // Procesar películas para agregar el tipo de medio
      const processedMovies = popularData.map((movie) => ({
        ...movie,
        media_type: "movie",
      }));

      const processedTrendingMovies = trendingData.map((movie) => ({
        ...movie,
        media_type: "movie",
      }));

      const processedTopRatedMovies = topRatedData.map((movie) => ({
        ...movie,
        media_type: "movie",
      }));

      const processedUpcomingMovies = upcomingData.map((movie) => ({
        ...movie,
        media_type: "movie",
      }));

      setPopularMovies(processedMovies);
      setTrendingMovies(processedTrendingMovies);
      setTopRatedMovies(processedTopRatedMovies);
      setGenres(genresData || []);
      setUpcomingMovies(processedUpcomingMovies);

      // Guardar datos de series
      setPopularTVShows(popularTV);
      setOnAirTVShows(onAirTV);
      setTopRatedTVShows(topRatedTV);

      setLoading(false);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchAllMovieData();
  }, []);

  // Recargar datos cuando cambia el idioma
  useEffect(() => {
    fetchAllMovieData();
  }, [language]);

  // Hook para manejar animaciones al hacer scroll
  useEffect(() => {
    const handleScrollAnimations = () => {
      const sections = document.querySelectorAll(".animated-section");

      // Calcular la altura de 25vh
      const scrollThreshold = window.innerHeight * 0.25;

      // Comprobar si hemos pasado el umbral de 25vh
      const hasPassedThreshold = window.scrollY > scrollThreshold;

      // Actualizar el estado de scroll solo si ha cambiado
      if (hasPassedThreshold !== scrolled) {
        setScrolled(hasPassedThreshold);
      }

      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight * 0.85) {
          section.classList.add("visible");
        }
      });
    };

    window.addEventListener("scroll", handleScrollAnimations);
    // Trigger once on load
    handleScrollAnimations();

    return () => window.removeEventListener("scroll", handleScrollAnimations);
  }, [scrolled]);

  // Mostrar mensaje de carga o error
  if (loading) {
    return (
      <MainLayout>
        <div className="loading-container">
          <p>{t("common.loading")}</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="error-container">
          <h2>{t("common.error")}</h2>
          <p>{error}</p>
          <button onClick={() => fetchAllMovieData()} className="retry-button">
            {t("common.retry")}
          </button>
        </div>
      </MainLayout>
    );
  }

  // Preparar datos para el Hero (películas destacadas con imágenes de fondo)
  const heroMovies = popularMovies
    .filter((movie) => movie.backdrop_path && movie.popularity > 50)
    .slice(0, 5);

  // Combinar películas y series para la sección de nuevos lanzamientos
  const newReleases = {
    movies: upcomingMovies,
    series: onAirTVShows,
  };

  // Combinar todos los datos de películas y series para la sección de categorías
  const allMediaItems = [
    ...popularMovies,
    ...trendingMovies,
    ...topRatedMovies,
    ...upcomingMovies,
    ...popularTVShows,
    ...onAirTVShows,
    ...topRatedTVShows,
  ];

  // Eliminar duplicados basados en el ID y el tipo de medio
  const uniqueMediaItems = Array.from(
    new Map(
      allMediaItems.map((item) => [
        `${item.media_type || "movie"}-${item.id}`,
        item,
      ])
    ).values()
  );

  return (
    <MainLayout>
      <div className="homepage-container">
        {/* Hero Banner con Slider */}
        <Hero movies={heroMovies} language={language} />

        <div className="content-wrapper">
          {/* Sección "Nuevos Lanzamientos" */}
          <section className="animated-section">
            <NewReleases content={newReleases} language={language} />
          </section>

          {/* Sección "Top 10 Películas" */}
          <section className="animated-section">
            <Top10Container
              movies={topRatedMovies}
              tvShows={topRatedTVShows}
              language={language}
            />
          </section>

          {/* Sección "En Tendencia" */}
          <section className="animated-section">
            <TrendingNow
              movies={trendingMovies}
              tvShows={popularTVShows}
              language={language}
            />
          </section>

          {/* Sección "Premiados y Aclamados" */}
          <section className="animated-section">
            <AwardsShowcase
              movies={topRatedMovies}
              tvShows={topRatedTVShows}
              language={language}
            />
          </section>

          {/* Sección de Categorías Destacadas */}
          <section className="animated-section">
            <FeaturedCategories
              movies={uniqueMediaItems}
              genres={genres}
              language={language}
            />
          </section>

          {/* Banner de Suscripción */}
          <section className="animated-section">
            <Subscription />
          </section>
        </div>

        {/* Botones flotantes */}
        <ScrollToTop />
        <WeatherButton />
      </div>
    </MainLayout>
  );
}

export default HomePage;
