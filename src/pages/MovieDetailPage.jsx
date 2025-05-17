import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  Suspense,
  lazy,
  useTransition,
} from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useFavorites } from "../contexts/FavoritesContext";
import MainLayout from "../layouts/MainLayout";
import "../styles/components/moviedetail.css";
import { getMovieDetails, getImageUrl, getTVShowDetails } from "../utils/api";

// Componentes con carga diferida para mejorar el rendimiento inicial
const VideoPlayer = lazy(() => import("../components/MovieDetail/VideoPlayer"));
const MovieInfo = lazy(() => import("../components/MovieDetail/MovieInfo"));
const Cast = lazy(() => import("../components/MovieDetail/Cast"));
const Reviews = lazy(() => import("../components/MovieDetail/Reviews"));
const RelatedContent = lazy(() =>
  import("../components/MovieDetail/RelatedContent")
);
const MediaGallery = lazy(() =>
  import("../components/MovieDetail/MediaGallery")
);
const MovieDetailHero = lazy(() =>
  import("../components/MovieDetail/MovieDetailHero")
);

const MovieDetailPage = () => {
  const { t, language } = useLanguage(); // Obtener idioma actual
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Usar el contexto de favoritos
  const { isFavorite, toggleFavorite } = useFavorites();

  // Determinar si estamos viendo una película o una serie
  const isTV = location.pathname.includes("/series/");

  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Referencia para el desplazamiento suave
  const headerRef = useRef(null);
  const castRef = useRef(null);
  const infoRef = useRef(null);
  const videosRef = useRef(null);

  // Cargar los detalles de la película o serie desde la API de TMDB
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let data;

        if (isTV) {
          // Si es una serie, usar getTVShowDetails
          data = await getTVShowDetails(id, language);
        } else {
          // Si es una película, usar getMovieDetails
          data = await getMovieDetails(id, language);
        }

        if (data) {
          // Transformar los datos recibidos de la API para que sean compatibles con nuestros componentes
          const processedData = transformTMDBData(data, isTV);
          setMovie(processedData);
        } else {
          setError(t("errors.movieNotFound"));
        }
      } catch (err) {
        console.error("Error al cargar detalles:", err);
        setError(t("errors.failedToLoad"));
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id, isTV, t, language]); // Añadir language a las dependencias

  // Función para transformar datos de TMDB al formato que esperan nuestros componentes
  const transformTMDBData = (data, isTV) => {
    // Extraer el director (o creador para series)
    let director = "";
    if (isTV && data.created_by && data.created_by.length > 0) {
      director = data.created_by[0].name;
    } else if (data.credits && data.credits.crew) {
      const directorData = data.credits.crew.find(
        (person) => person.job === "Director"
      );
      director = directorData ? directorData.name : "";
    }

    // Obtener URL de imágenes con el tamaño correcto
    const posterPath = data.poster_path
      ? getImageUrl(data.poster_path, "large", "poster")
      : null;
    const backdropPath = data.backdrop_path
      ? getImageUrl(data.backdrop_path, "large", "backdrop")
      : null;

    // Procesar el elenco
    const cast =
      data.credits?.cast?.map((actor) => ({
        id: actor.id,
        name: actor.name,
        character: actor.character || t("common.unknown"),
        photo: actor.profile_path
          ? getImageUrl(actor.profile_path, "medium", "profile")
          : "https://via.placeholder.com/185x278?text=No+Image",
        popularity: actor.popularity,
        order: actor.order,
      })) || [];

    // Procesar el equipo de producción (crew)
    const crew =
      data.credits?.crew?.map((member) => ({
        id: member.id,
        name: member.name,
        job: member.job,
        department: member.department,
        photo: member.profile_path
          ? getImageUrl(member.profile_path, "medium", "profile")
          : null,
      })) || [];

    // Agrupar miembros del equipo por departamento para una mejor organización
    const crewByDepartment = crew.reduce((acc, member) => {
      if (!acc[member.department]) {
        acc[member.department] = [];
      }
      acc[member.department].push(member);
      return acc;
    }, {});

    // Procesar videos
    const videos =
      data.videos?.results?.map((video) => ({
        key: video.key,
        name: video.name,
        type: video.type,
        site: video.site,
        official: video.official,
        published_at: video.published_at,
        thumbnail:
          video.site === "YouTube"
            ? `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`
            : null,
      })) || [];

    // Filtrar por tipo de video para fácil acceso
    const trailers = videos.filter(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );
    const teasers = videos.filter(
      (video) => video.type === "Teaser" && video.site === "YouTube"
    );

    // Procesar imágenes para la galería
    const images =
      data.images?.backdrops?.map((img) => ({
        url: getImageUrl(img.file_path, "large", "backdrop"),
        width: img.width,
        height: img.height,
        aspect_ratio: img.aspect_ratio,
      })) || [];

    // Procesar pósters para la galería
    const posters =
      data.images?.posters?.map((poster) => ({
        url: getImageUrl(poster.file_path, "large", "poster"),
        language: poster.iso_639_1,
        width: poster.width,
        height: poster.height,
        aspect_ratio: poster.aspect_ratio,
      })) || [];

    // Información adicional para series de TV
    const tvInfo = isTV
      ? {
          seasons:
            data.seasons?.map((season) => ({
              id: season.id,
              name: season.name,
              overview: season.overview,
              poster_path: season.poster_path
                ? getImageUrl(season.poster_path, "medium", "poster")
                : null,
              season_number: season.season_number,
              episode_count: season.episode_count,
              air_date: season.air_date,
            })) || [],
          number_of_seasons: data.number_of_seasons,
          number_of_episodes: data.number_of_episodes,
          episode_run_time: data.episode_run_time,
          in_production: data.in_production,
          status: data.status,
          networks:
            data.networks?.map((network) => ({
              id: network.id,
              name: network.name,
              logo: network.logo_path
                ? getImageUrl(network.logo_path, "small", "poster")
                : null,
            })) || [],
          created_by:
            data.created_by?.map((creator) => ({
              id: creator.id,
              name: creator.name,
              profile: creator.profile_path
                ? getImageUrl(creator.profile_path, "medium", "profile")
                : null,
            })) || [],
        }
      : {};

    // Crear objeto con formato compatible con nuestros componentes
    return {
      id: data.id,
      title: isTV ? data.name : data.title,
      originalTitle: isTV ? data.original_name : data.original_title,
      poster_path: posterPath,
      backdrop_path: backdropPath,
      description: data.overview,
      year: isTV
        ? data.first_air_date
          ? new Date(data.first_air_date).getFullYear()
          : ""
        : data.release_date
        ? new Date(data.release_date).getFullYear()
        : "",
      duration: isTV ? data.episode_run_time?.[0] || 0 : data.runtime || 0,
      vote_average: data.vote_average,
      genres: data.genres?.map((genre) => genre.name) || [],
      genre_ids: data.genres?.map((genre) => genre.id) || [],
      director,
      starring:
        data.credits?.cast?.slice(0, 5).map((actor) => actor.name) || [],
      trailer_key: trailers.length > 0 ? trailers[0].key : "",
      cast,
      crew,
      crewByDepartment,
      videos,
      trailers,
      teasers,
      images,
      posters,
      adult: data.adult,
      status: data.status,
      originalLanguage: data.original_language,
      popularity: data.popularity,
      vote_count: data.vote_count,
      revenue: data.revenue ? `$${(data.revenue / 1000000).toFixed(2)} M` : "",
      budget: data.budget ? `$${(data.budget / 1000000).toFixed(2)} M` : "",
      tagline: data.tagline,
      homepage: data.homepage,
      imdb_id: data.imdb_id,
      productionCountries:
        data.production_countries?.map((country) => country.name) || [],
      productionCompanies:
        data.production_companies?.map((company) => ({
          id: company.id,
          name: company.name,
          logo: company.logo_path
            ? getImageUrl(company.logo_path, "small", "poster")
            : null,
          origin_country: company.origin_country,
        })) || [],
      spoken_languages:
        data.spoken_languages?.map((lang) => ({
          iso_639_1: lang.iso_639_1,
          name: lang.name,
          english_name: lang.english_name,
        })) || [],
      ratings: [
        {
          source: "IMDb",
          value: data.vote_average.toFixed(1),
          outOf: "10",
          icon: "fab fa-imdb",
        },
        {
          source: "TMDB",
          value: (data.vote_average * 10).toFixed(0),
          outOf: "100",
          icon: "fas fa-film",
        },
      ],
      media_type: isTV ? "tv" : "movie",
      runtime: data.runtime,
      release_date: data.release_date || data.first_air_date,
      release_dates: data.release_dates, // Información adicional de fechas de estreno
      // Incluir información específica de TV si aplica
      ...tvInfo,
    };
  };

  // Manejar la acción de favoritos
  const handleToggleFavorite = () => {
    if (movie) {
      const favoriteItem = {
        id: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        year: movie.year,
        type: isTV ? "series" : "movie",
        description: movie.description
          ? movie.description.substring(0, 150)
          : "",
      };

      toggleFavorite(favoriteItem);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="movie-detail-loading">
          <div className="movie-detail-loading-animation">
            <div className="movie-detail-circle-pulse"></div>
            <div className="movie-detail-circle-pulse delay-1"></div>
            <div className="movie-detail-circle-pulse delay-2"></div>
          </div>
          <h2 className="movie-detail-loading-text">{t("common.loading")}</h2>
          <p className="movie-detail-loading-subtext">
            {t("movieDetail.preparingExperience")}
          </p>
        </div>
      </MainLayout>
    );
  }

  if (error || !movie) {
    return (
      <MainLayout>
        <div className="movie-detail-not-found">
          <div className="movie-detail-error-icon">
            <i className="fas fa-film"></i>
            <div className="movie-detail-error-x">
              <i className="fas fa-times"></i>
            </div>
          </div>
          <h2>
            {error === "not_found"
              ? t("errors.movieNotFound")
              : t("errors.somethingWentWrong")}
          </h2>
          <p>
            {error === "not_found"
              ? t("errors.movieNotFoundDescription")
              : t("errors.serverErrorDescription")}
          </p>
          <div className="movie-detail-error-actions">
            <Link
              to="/explore"
              className="movie-detail-back-to-home-btn movie-detail-primary-action"
            >
              <i className="fas fa-compass"></i> {t("common.exploreMovies")}
            </Link>
            <Link
              to="/"
              className="movie-detail-back-to-home-btn movie-detail-secondary-action"
            >
              <i className="fas fa-home"></i> {t("errors.goHome")}
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="movie-detail-back-to-home-btn movie-detail-tertiary-action"
            >
              <i className="fas fa-redo"></i> {t("errors.tryAgain")}
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Comprobar si esta película está en favoritos
  const isMovieFavorite = isFavorite(movie.id);

  return (
    <MainLayout>
      <div className="movie-detail-page">
        <Suspense
          fallback={
            <div className="movie-detail-loading-hero">
              {t("common.loading")}...
            </div>
          }
        >
          <MovieDetailHero movie={movie} />
        </Suspense>

        <div className="movie-detail-grid">
          <aside className="movie-detail-sidebar">
            <div className="movie-detail-poster-container">
              <div className="movie-detail-poster-wrapper">
                <div className="movie-detail-poster-shine"></div>
                <img
                  src={movie.poster_path}
                  alt={movie.title}
                  className="movie-detail-poster"
                  loading="lazy"
                />

                {/* Overlay con botón de favoritos dentro del póster */}
                <div className="movie-detail-poster-overlay">
                  <div className="movie-detail-poster-actions">
                    <button
                      className={`movie-detail-poster-action-btn movie-detail-favorite-btn ${
                        isMovieFavorite ? "active" : ""
                      }`}
                      onClick={handleToggleFavorite}
                      aria-label={
                        isMovieFavorite
                          ? t("favorites.removeFromFavorites")
                          : t("favorites.addToFavorites")
                      }
                    >
                      <i
                        className={`fas ${
                          isMovieFavorite ? "fa-heart" : "fa-heart"
                        }`}
                      ></i>
                    </button>

                    {movie.trailer_key && (
                      <button
                        className="movie-detail-poster-action-btn movie-detail-play-btn"
                        onClick={() =>
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                        aria-label={t("common.watchTrailer")}
                      >
                        <i className="fas fa-play"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="movie-detail-badges">
                {movie.vote_average >= 8.5 && (
                  <div className="movie-detail-badge movie-detail-top-rated">
                    <i className="fas fa-award"></i> {t("movieDetail.topRated")}
                  </div>
                )}
                {movie.vote_average >= 7.5 && movie.vote_average < 8.5 && (
                  <div className="movie-detail-badge movie-detail-highly-rated">
                    <i className="fas fa-thumbs-up"></i>{" "}
                    {t("movieDetail.highlyRated")}
                  </div>
                )}
              </div>
            </div>
          </aside>

          <main className="movie-detail-main-content">
            <section className="movie-detail-synopsis-section">
              <div className="movie-detail-section-header">
                <h2 className="movie-detail-section-title">
                  {t("movieDetail.synopsis")}
                </h2>
              </div>

              <p className="movie-detail-synopsis-text">{movie.description}</p>

              <div className="movie-detail-genres-container">
                {movie.genres &&
                  movie.genres.map((genre, index) => (
                    <span key={index} className="movie-detail-genre-pill">
                      {genre}
                    </span>
                  ))}
              </div>
            </section>

            <div className="movie-detail-content-tabs-container">
              <div className="movie-detail-content-tabs">
                <button
                  className="movie-detail-tab-button"
                  aria-label={t("movieDetail.details")}
                >
                  <i className="fas fa-info-circle"></i>{" "}
                  {t("movieDetail.details")}
                </button>
              </div>

              <div className="movie-detail-tab-content">
                <Suspense
                  fallback={
                    <div className="movie-detail-tab-loading">
                      {t("common.loading")}...
                    </div>
                  }
                >
                  <MovieInfo movie={movie} />

                  {/* Ahora pasamos directamente los datos del cast desde la API */}
                  <Cast cast={movie.cast} />

                  {/* Añadimos más componentes para mostrar la información adicional */}
                  {movie.trailers && movie.trailers.length > 0 && (
                    <VideoPlayer
                      videoId={movie.trailers[0].key}
                      thumbnailUrl={movie.trailers[0].thumbnail}
                      title={movie.trailers[0].name}
                    />
                  )}

                  {/* Galería de medios con todas las imágenes y videos */}
                  <MediaGallery movie={movie} />

                  {/* Contenido relacionado usando los géneros de la película */}
                  <RelatedContent
                    movieId={movie.id}
                    movieGenres={movie.genre_ids}
                  />

                  {/* Componente de reseñas */}
                  <Reviews movieId={movie.id} />
                </Suspense>
              </div>
            </div>
          </main>
        </div>
      </div>
    </MainLayout>
  );
};

export default MovieDetailPage;
