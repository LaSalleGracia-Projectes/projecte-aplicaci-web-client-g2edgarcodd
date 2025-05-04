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
import castData from "../data/castData";

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
  const { t } = useLanguage();
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
          data = await getTVShowDetails(id);
        } else {
          // Si es una película, usar getMovieDetails
          data = await getMovieDetails(id);
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
  }, [id, isTV, t]);

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
        movieId: data.id,
        name: actor.name,
        character: actor.character,
        photo: actor.profile_path
          ? getImageUrl(actor.profile_path, "medium", "profile")
          : "https://via.placeholder.com/185x278?text=No+Image",
      })) || [];

    // Procesar videos
    const videos =
      data.videos?.results?.map((video) => ({
        key: video.key,
        name: video.name,
        type: video.type,
      })) || [];

    // Procesar imágenes para la galería
    const images =
      data.images?.backdrops?.slice(0, 10).map((img) => ({
        url: getImageUrl(img.file_path, "large", "backdrop"),
      })) || [];

    // Procesar pósters para la galería
    const posters =
      data.images?.posters?.slice(0, 10).map((poster) => ({
        url: getImageUrl(poster.file_path, "large", "poster"),
        language: poster.iso_639_1,
      })) || [];

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
      director,
      starring:
        data.credits?.cast?.slice(0, 5).map((actor) => actor.name) || [],
      trailer_key: videos.find((video) => video.type === "Trailer")?.key || "",
      cast,
      videos,
      images,
      posters,
      status: data.status,
      originalLanguage: data.original_language,
      revenue: data.revenue ? `$${(data.revenue / 1000000).toFixed(2)} M` : "",
      budget: data.budget ? `$${(data.budget / 1000000).toFixed(2)} M` : "",
      productionCountries:
        data.production_countries?.map((country) => country.name) || [],
      productionCompanies:
        data.production_companies?.map((company) => ({
          id: company.id,
          name: company.name,
          logo: company.logo_path
            ? getImageUrl(company.logo_path, "small", "poster")
            : null,
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
          <MovieDetailHero
            movie={{
              title: movie.title,
              backdrop_path: movie.backdrop_path,
              tagline: movie.tagline,
              overview: movie.description,
              vote_average: movie.vote_average,
              release_date: movie.year?.toString(),
              runtime: parseInt(movie.duration),
              genres: movie.genres,
              director: movie.director,
              starring: movie.starring,
              trailer_key: movie.trailer_key,
              awards: movie.awards,
              poster_path: movie.poster_path,
            }}
          />
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

              {/* Botón de favoritos */}
              <div className="movie-detail-actions">
                <button
                  className={`movie-detail-action-btn ${
                    isMovieFavorite ? "active" : ""
                  }`}
                  onClick={handleToggleFavorite}
                >
                  <i className="fas fa-heart"></i>
                  <span>
                    {isMovieFavorite
                      ? t("favorites.removeFromFavorites")
                      : t("favorites.addToFavorites")}
                  </span>
                </button>
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
