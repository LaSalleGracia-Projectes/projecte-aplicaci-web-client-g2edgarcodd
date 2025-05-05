import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  useSearchParams,
  useNavigate,
  useLocation,
  NavLink,
} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ExploreFilters from "../components/Explore/ExploreFilters";
import GenreSelector from "../components/Explore/GenreSelector";
import MovieCard from "../components/MovieGrid/MovieCard";
import { useLanguage } from "../contexts/LanguageContext";
import "../styles/components/explorepage.css";
import {
  getMovieGenres,
  getAllMovies,
  getPopularTVShows,
  getTMDBMoviesByGenre,
  getTopRatedMovies,
  getTopRatedTVShows,
} from "../utils/api";

function ExplorePage() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeGenre, setActiveGenre] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' o 'list'
  const [contentType, setContentType] = useState("all"); // 'all', 'films', 'series'
  const [genres, setGenres] = useState([]);
  const exploreSectionRef = useRef(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreContent, setHasMoreContent] = useState(true);
  const loadingRef = useRef(null);

  // Referencia para indicar si hay una carga en curso
  const isLoadingRef = useRef(false);

  // Detectar el tipo de contenido según la URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/films")) {
      setContentType("films");
    } else if (path.includes("/series")) {
      setContentType("series");
    } else {
      setContentType("all");
    }
    // Reiniciar el estado cuando cambia el tipo de contenido
    setMovies([]);
    setFilteredMovies([]);
    setCurrentPage(1);
    setHasMoreContent(true);
  }, [location.pathname]);

  // Cargar géneros desde la API
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreData = await getMovieGenres();

        // Añadir opción "Todos" al inicio
        const allGenresOption = [
          { id: "all", name: t("explore.genreNames.all") || "Todos" },
        ];

        // Transformar los géneros de la API para que coincidan con el formato esperado
        const formattedGenres = genreData.map((genre) => ({
          id: genre.id.toString(),
          name: genre.name,
        }));

        setGenres([...allGenresOption, ...formattedGenres]);
      } catch (err) {
        console.error("Error al obtener géneros:", err);
        setError("Error al cargar los géneros");
      }
    };

    fetchGenres();
  }, [t]);

  // Función para cargar contenido
  const fetchContent = useCallback(
    async (page = 1, shouldReplace = true) => {
      if (isLoadingRef.current) return;

      try {
        isLoadingRef.current = true;

        if (page === 1) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        setError(null);

        // Verificar parámetros de URL
        const genre = searchParams.get("genre") || "all";
        const sort = searchParams.get("sort") || "popular";

        if (shouldReplace) {
          setActiveGenre(genre);
          setSortBy(sort);
        }

        let contentData = [];

        // Obtener el contenido según el tipo
        try {
          switch (contentType) {
            case "films":
              if (genre === "all") {
                // Para películas sin filtro de género
                if (sort === "rating") {
                  contentData = await getTopRatedMovies(page);
                } else {
                  contentData = await getAllMovies(page);
                }
              } else {
                // Para películas con filtro de género
                contentData = await getTMDBMoviesByGenre(genre, page);
              }
              // Marcar contenido como películas
              contentData = contentData.map((item) => ({
                ...item,
                type: "film",
              }));
              break;

            case "series":
              // Para series
              if (sort === "rating") {
                contentData = await getTopRatedTVShows(page);
              } else {
                contentData = await getPopularTVShows(page);
              }
              // Marcar contenido como series
              contentData = contentData.map((item) => ({
                ...item,
                type: "series",
              }));
              break;

            default:
              // Para todos (películas y series)
              const [moviesData, seriesData] = await Promise.all([
                getAllMovies(page),
                getPopularTVShows(page),
              ]);

              // Combinar y marcar ambos tipos
              const markedMovies = moviesData.map((movie) => ({
                ...movie,
                type: "film",
              }));
              const markedSeries = seriesData.map((show) => ({
                ...show,
                type: "series",
              }));

              contentData = [...markedMovies, ...markedSeries];
              break;
          }
        } catch (error) {
          console.error("Error al obtener datos:", error);
          contentData = [];
        }

        // Verificar si hay más contenido para cargar
        if (contentData.length < 20) {
          setHasMoreContent(false);
        }

        // Procesar los datos para que sean compatibles con el componente MovieCard
        const processedContent = contentData.map((item) => ({
          id: item.id,
          title: item.title || item.name, // Las series usan 'name' en lugar de 'title'
          description: item.overview,
          image: item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image",
          contentType: item.type,
          rating: item.vote_average,
          year: (item.release_date || item.first_air_date || "").substring(
            0,
            4
          ),
          popularity: item.popularity / 10, // Normalizar popularidad
          genre_ids: item.genre_ids,
        }));

        if (shouldReplace) {
          setMovies(processedContent);
          setFilteredMovies(processedContent);
        } else if (processedContent.length > 0) {
          // Agregar nuevo contenido al existente, evitando duplicados
          const existingIds = new Set(movies.map((m) => m.id));
          const newContent = processedContent.filter(
            (item) => !existingIds.has(item.id)
          );

          if (newContent.length > 0) {
            setMovies((prevMovies) => [...prevMovies, ...newContent]);
            setFilteredMovies((prevFilteredMovies) => [
              ...prevFilteredMovies,
              ...newContent,
            ]);
          } else {
            // Si no hay nuevo contenido después de filtrar duplicados,
            // marcamos que no hay más contenido para cargar
            setHasMoreContent(false);
          }
        } else {
          // Si no hay nuevo contenido en absoluto
          setHasMoreContent(false);
        }
      } catch (err) {
        console.error("Error al cargar contenido:", err);
        setError("Error al cargar el contenido");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
        isLoadingRef.current = false;
      }
    },
    [searchParams, contentType, movies]
  );

  // Cargar contenido inicial
  useEffect(() => {
    const initialLoad = async () => {
      // Reiniciar estado cuando cambian los parámetros
      setMovies([]);
      setFilteredMovies([]);
      setCurrentPage(1);
      setHasMoreContent(true);

      // Llamada directa en lugar de a través de fetchContent para mejor control
      try {
        setIsLoading(true);

        const genre = searchParams.get("genre") || "all";
        const sort = searchParams.get("sort") || "popular";

        setActiveGenre(genre);
        setSortBy(sort);

        let initialData = [];

        try {
          // Obtener la primera página de contenido
          switch (contentType) {
            case "films":
              if (genre === "all") {
                initialData =
                  sort === "rating"
                    ? await getTopRatedMovies(1)
                    : await getAllMovies(1);
              } else {
                initialData = await getTMDBMoviesByGenre(genre, 1);
              }
              // Marcar como películas
              initialData = initialData.map((item) => ({
                ...item,
                type: "film",
              }));
              break;

            case "series":
              initialData =
                sort === "rating"
                  ? await getTopRatedTVShows(1)
                  : await getPopularTVShows(1);
              // Marcar como series
              initialData = initialData.map((item) => ({
                ...item,
                type: "series",
              }));
              break;

            default:
              // Cargamos películas y series
              const [moviesData, seriesData] = await Promise.all([
                getAllMovies(1),
                getPopularTVShows(1),
              ]);

              const markedMovies = moviesData.map((movie) => ({
                ...movie,
                type: "film",
              }));
              const markedSeries = seriesData.map((show) => ({
                ...show,
                type: "series",
              }));

              initialData = [...markedMovies, ...markedSeries];
              break;
          }
        } catch (err) {
          console.error("Error al cargar datos iniciales:", err);
          initialData = [];
        }

        // Procesar el contenido inicial
        const processedContent = initialData.map((item) => ({
          id: item.id,
          title: item.title || item.name,
          description: item.overview,
          image: item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image",
          contentType: item.type,
          rating: item.vote_average,
          year: (item.release_date || item.first_air_date || "").substring(
            0,
            4
          ),
          popularity: item.popularity / 10,
          genre_ids: item.genre_ids,
        }));

        setMovies(processedContent);
        setFilteredMovies(processedContent);
        setHasMoreContent(initialData.length >= 20);
      } catch (err) {
        console.error("Error al cargar contenido inicial:", err);
        setError("Error al cargar el contenido");
      } finally {
        setIsLoading(false);
      }
    };

    initialLoad();

    // Efecto de aparición al cargar
    document.querySelectorAll(".fade-in-element").forEach((el, index) => {
      setTimeout(() => {
        el.classList.add("visible");
      }, 100 * index);
    });
  }, [searchParams, contentType]);

  // Configurar Intersection Observer para detección de scroll infinito
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          !isLoadingMore &&
          hasMoreContent
        ) {
          const nextPage = currentPage + 1;
          setCurrentPage(nextPage);
          fetchContent(nextPage, false);
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    if (loadingRef.current && !isLoading && hasMoreContent) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [isLoading, isLoadingMore, hasMoreContent, fetchContent, currentPage]);

  // Efecto para el filtrado
  useEffect(() => {
    if (movies.length === 0) return;

    let result = [...movies];

    // Filtrar por género (solo si no hemos filtrado ya por género en la petición a la API)
    if (activeGenre !== "all" && contentType === "all") {
      result = result.filter(
        (movie) =>
          movie.genre_ids && movie.genre_ids.includes(parseInt(activeGenre))
      );
    }

    // Ordenar contenido
    switch (sortBy) {
      case "recent":
        result.sort((a, b) => {
          const dateA = a.year ? parseInt(a.year) : 0;
          const dateB = b.year ? parseInt(b.year) : 0;
          return dateB - dateA;
        });
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "a-z":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default: // 'popular' por defecto
        result.sort((a, b) => b.popularity - a.popularity);
    }

    // Actualizar URL
    setSearchParams({
      genre: activeGenre,
      sort: sortBy,
    });

    setFilteredMovies(result);
  }, [activeGenre, sortBy, movies, setSearchParams, contentType]);

  const handleGenreChange = (genreId) => {
    if (genreId === activeGenre) return;

    setActiveGenre(genreId);
    setMovies([]);
    setFilteredMovies([]);
    setCurrentPage(1);
    setHasMoreContent(true);
    setError(null);

    // Actualizar URL y dejar que el efecto se encargue de la carga
    setSearchParams({
      genre: genreId,
      sort: sortBy,
    });

    exploreSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSortChange = (sortId) => {
    if (sortId === sortBy) return;

    setSortBy(sortId);
    setMovies([]);
    setFilteredMovies([]);
    setCurrentPage(1);
    setHasMoreContent(true);
    setError(null);

    // Actualizar URL y dejar que el efecto se encargue de la carga
    setSearchParams({
      genre: activeGenre,
      sort: sortId,
    });
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  };

  // Cambiar entre tipo de contenido
  const handleContentTypeChange = (type) => {
    const basePath = "/explore";
    let path;

    switch (type) {
      case "films":
        path = `${basePath}/films`;
        break;
      case "series":
        path = `${basePath}/series`;
        break;
      default:
        path = basePath;
    }

    navigate(path + location.search);
  };

  // Obtener el título y subtítulo según el tipo de contenido
  const getPageTitle = () => {
    switch (contentType) {
      case "films":
        return t("explore.filmsTitle");
      case "series":
        return t("explore.seriesTitle");
      default:
        return t("explore.title");
    }
  };

  const getPageSubtitle = () => {
    switch (contentType) {
      case "films":
        return t("explore.filmsSubtitle");
      case "series":
        return t("explore.seriesSubtitle");
      default:
        return t("explore.subtitle");
    }
  };

  // Obtener la imagen de fondo según el tipo de contenido
  const getBackgroundImage = () => {
    switch (contentType) {
      case "films":
        return "https://www.themoviedb.org/t/p/original/8pjWz2lt29KkuuvpF8rG8Ec5nKZ.jpg";
      case "series":
        return "https://www.themoviedb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg";
      default:
        return "https://www.themoviedb.org/t/p/original/7tCVM57Z57fV5nFAmm2nDyfdWFZ.jpg";
    }
  };

  return (
    <MainLayout>
      <div className="explore-page">
        {/* Sección Hero con efecto parallax */}
        <section className="explore-hero">
          <div
            className="parallax-bg"
            style={{ backgroundImage: `url('${getBackgroundImage()}')` }}
          ></div>
          <div className="hero-content">
            <h1 className="fade-in-element">{getPageTitle()}</h1>
            <p className="fade-in-element">{getPageSubtitle()}</p>
          </div>
        </section>

        {/* Tabs para navegar entre tipos de contenido */}
        <section className="content-type-tabs fade-in-element">
          <div className="content-tabs-container">
            <NavLink
              to="/explore"
              className={({ isActive }) =>
                `content-tab ${
                  isActive && location.pathname === "/explore" ? "active" : ""
                }`
              }
              end
            >
              <div className="tab-icon-wrapper">
                <i className="fas fa-th"></i>
              </div>
              <span>{t("explore.allContent")}</span>
            </NavLink>
            <NavLink
              to="/explore/films"
              className={({ isActive }) =>
                `content-tab ${isActive ? "active" : ""}`
              }
            >
              <div className="tab-icon-wrapper">
                <i className="fas fa-film"></i>
              </div>
              <span>{t("explore.films")}</span>
            </NavLink>
            <NavLink
              to="/explore/series"
              className={({ isActive }) =>
                `content-tab ${isActive ? "active" : ""}`
              }
            >
              <div className="tab-icon-wrapper">
                <i className="fas fa-tv"></i>
              </div>
              <span>{t("explore.series")}</span>
            </NavLink>
          </div>
        </section>

        {/* Filtros y selector de géneros */}
        <section className="explore-main" ref={exploreSectionRef}>
          <div className="explore-filters-container fade-in-element">
            <ExploreFilters
              sortOptions={sortOptions.map((option) => ({
                ...option,
                name: t(`explore.sortOptions.${option.name}`),
              }))}
              currentSort={sortBy}
              onSortChange={handleSortChange}
              viewMode={viewMode}
              onViewModeChange={toggleViewMode}
            />
          </div>

          <div className="explore-content-container">
            <aside className="genre-sidebar fade-in-element">
              <GenreSelector
                genres={genres}
                activeGenre={activeGenre}
                onGenreSelect={handleGenreChange}
              />
            </aside>

            <div className="explore-results">
              {isLoading ? (
                <div className="loading-container fade-in-element">
                  <div className="spinner"></div>
                  <p>{t("common.loading")}</p>
                </div>
              ) : error ? (
                <div className="no-results fade-in-element">
                  <i className="fas fa-exclamation-triangle"></i>
                  <h3>{t("common.error") || "Error"}</h3>
                  <p>{error}</p>
                </div>
              ) : (
                <>
                  <div className="results-info fade-in-element">
                    <p>
                      {t("explore.showing") || "Mostrando"}{" "}
                      <span>{filteredMovies.length}</span>{" "}
                      {filteredMovies.length === 1
                        ? t("explore.title")
                        : t("explore.titles")}
                    </p>
                  </div>

                  <div className={`movies-container ${viewMode}`}>
                    {filteredMovies.length > 0 ? (
                      filteredMovies.map((movie, index) => (
                        <div
                          key={`${movie.id}-${index}`}
                          className="movie-card-container fade-in-element"
                          style={{
                            animationDelay: `${Math.min(index * 0.05, 1)}s`,
                          }}
                        >
                          <MovieCard
                            title={movie.title}
                            description={movie.description}
                            image={movie.image}
                            contentType={movie.contentType}
                            id={movie.id}
                            rating={movie.rating}
                            year={movie.year}
                            popularity={movie.popularity}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="no-results fade-in-element">
                        <i className="fas fa-search-minus"></i>
                        <h3>
                          {t("explore.noResultsFound") ||
                            "No se encontraron resultados"}
                        </h3>
                        <p>
                          {t("explore.tryModifyingFilters") ||
                            "Intenta modificar los filtros"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Indicador de carga para scroll infinito */}
                  {filteredMovies.length > 0 && (
                    <div
                      ref={loadingRef}
                      className={`load-more-container ${
                        !hasMoreContent ? "hidden" : ""
                      }`}
                    >
                      {isLoadingMore && (
                        <div className="loading-more">
                          <div className="spinner-small"></div>
                          <p>{t("explore.loadingMore") || "Cargando más..."}</p>
                        </div>
                      )}
                      {!hasMoreContent && !isLoading && !isLoadingMore && (
                        <div className="no-more-content">
                          <p>
                            {t("explore.noMoreContent") ||
                              "No hay más contenido disponible"}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

// Opciones para ordenar
const sortOptions = [
  { id: "popular", name: "popular" },
  { id: "recent", name: "recent" },
  { id: "rating", name: "rating" },
  { id: "a-z", name: "a-z" },
];

export default ExplorePage;
