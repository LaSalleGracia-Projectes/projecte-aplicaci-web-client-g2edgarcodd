import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { Link } from "react-router-dom";
import {
  getCurrentWeatherByCoords,
  getUserLocation,
  getWeatherBasedRecommendations,
} from "../../utils/weatherApi";
import {
  getContentByGenres,
  getImageUrl,
  LANGUAGE_MAPPING,
} from "../../utils/api";
import "../../styles/components/WeatherWidget.css";

// Clave para almacenar datos en localStorage
const WEATHER_CACHE_KEY = "streamhub_weather_cache";
// Clave para almacenar las recomendaciones de películas
const WEATHER_MOVIES_CACHE_KEY = "streamhub_weather_movies_cache";
// Tiempo de expiración de la caché en milisegundos (30 minutos)
const CACHE_EXPIRATION = 30 * 60 * 1000;

const WeatherWidget = ({
  onRecommendationsGenerated,
  onWeatherDataReceived,
}) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [movieRecommendations, setMovieRecommendations] = useState([]);

  // Función para corregir el icono según la hora del día
  const fixIconForTimeOfDay = (iconUrl, isDayTime) => {
    // Si es de noche y el icono termina con 'd@2x.png', cambiarlo a 'n@2x.png'
    if (!isDayTime && iconUrl.includes("d@2x.png")) {
      return iconUrl.replace("d@2x.png", "n@2x.png");
    }
    // Si es de día y el icono termina con 'n@2x.png', cambiarlo a 'd@2x.png'
    if (isDayTime && iconUrl.includes("n@2x.png")) {
      return iconUrl.replace("n@2x.png", "d@2x.png");
    }
    return iconUrl;
  };

  // Función para obtener géneros de películas basados en el clima
  const getGenresBasedOnWeather = (weatherType, temperature, isDayTime) => {
    // Asignar géneros según el clima y la hora del día
    if (weatherType.includes("rain") || weatherType.includes("drizzle")) {
      return isDayTime ? [18, 10751] : [9648, 27]; // Drama, Familia (día) / Misterio, Terror (noche)
    } else if (weatherType.includes("snow")) {
      return isDayTime ? [10751, 14] : [14, 878]; // Familia, Fantasía (día) / Fantasía, Ciencia ficción (noche)
    } else if (weatherType.includes("clear")) {
      if (temperature > 25) {
        // Caluroso
        return isDayTime ? [12, 28] : [10749, 53]; // Aventura, Acción (día) / Romance, Thriller (noche)
      } else {
        return isDayTime ? [35, 12] : [9648, 80]; // Comedia, Aventura (día) / Misterio, Crimen (noche)
      }
    } else if (weatherType.includes("cloud")) {
      return isDayTime ? [18, 36] : [878, 53]; // Drama, Historia (día) / Ciencia ficción, Thriller (noche)
    } else if (
      weatherType.includes("storm") ||
      weatherType.includes("thunder")
    ) {
      return isDayTime ? [28, 53] : [27, 9648]; // Acción, Thriller (día) / Terror, Misterio (noche)
    } else if (weatherType.includes("fog") || weatherType.includes("mist")) {
      return isDayTime ? [9648, 36] : [27, 53]; // Misterio, Historia (día) / Terror, Thriller (noche)
    }

    // Géneros por defecto
    return isDayTime ? [35, 12] : [878, 9648]; // Comedia, Aventura (día) / Ciencia ficción, Misterio (noche)
  };

  // Obtener películas recomendadas desde TMDB según el clima
  const fetchWeatherBasedMovies = async (weatherData) => {
    try {
      // Verificar si hay datos en caché
      const cachedMovies = localStorage.getItem(WEATHER_MOVIES_CACHE_KEY);
      if (cachedMovies) {
        const { timestamp, movies } = JSON.parse(cachedMovies);
        if (Date.now() - timestamp < CACHE_EXPIRATION) {
          setMovieRecommendations(movies);
          return;
        }
      }

      if (!weatherData || !weatherData.weather) return;

      const { weather, temperature } = weatherData;
      const isDayTime = weather.isDayTime;
      const weatherType = weather.main.toLowerCase();

      // Obtener géneros apropiados según el clima y hora
      const genreIds = getGenresBasedOnWeather(
        weatherType,
        temperature.current,
        isDayTime
      );

      // Obtener idioma actual
      const currentLanguage = document.documentElement.lang || "es";

      // Obtener películas de TMDB por géneros
      const movies = await getContentByGenres(
        genreIds,
        "movie",
        1,
        currentLanguage
      );

      // Seleccionar 2 películas aleatoriamente
      const randomMovies = movies
        .sort(() => 0.5 - Math.random())
        .slice(0, 2)
        .map((movie) => ({
          id: movie.id,
          title: movie.title,
          poster_path: getImageUrl(movie.poster_path, "medium", "poster"),
          genre_ids: movie.genre_ids,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
        }));

      setMovieRecommendations(randomMovies);

      // Guardar en caché
      localStorage.setItem(
        WEATHER_MOVIES_CACHE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          movies: randomMovies,
        })
      );
    } catch (error) {
      console.error(
        "Error al obtener películas recomendadas por clima:",
        error
      );
      setMovieRecommendations([]);
    }
  };

  useEffect(() => {
    // Función para verificar si hay datos en caché y si son válidos
    const getWeatherFromCache = () => {
      try {
        const cachedData = localStorage.getItem(WEATHER_CACHE_KEY);
        if (cachedData) {
          const { timestamp, weather, recommendations } =
            JSON.parse(cachedData);

          // Verificar si los datos en caché aún son válidos (menos de 30 minutos)
          if (Date.now() - timestamp < CACHE_EXPIRATION) {
            return { weather, recommendations, fromCache: true };
          }
        }
      } catch (err) {
        console.warn(t("weather.cacheFetchError"), err);
      }
      return { weather: null, recommendations: null, fromCache: false };
    };

    // Función para guardar datos en caché
    const saveWeatherToCache = (weatherData, recommendationsData) => {
      try {
        const cacheData = {
          timestamp: Date.now(),
          weather: weatherData,
          recommendations: recommendationsData,
        };
        localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(cacheData));
      } catch (err) {
        console.warn(t("weather.cacheSaveError"), err);
      }
    };

    // Función para obtener datos del clima
    const fetchWeatherData = async (force = false) => {
      try {
        // Si no es una actualización forzada, intentar obtener datos de la caché
        if (!force) {
          const cachedData = getWeatherFromCache();

          if (
            cachedData.fromCache &&
            cachedData.weather &&
            cachedData.recommendations
          ) {
            // Corregir icono según hora del día antes de usar caché
            const currentHour = new Date().getHours();
            const isDayTime = currentHour >= 6 && currentHour < 20;

            // Actualizar URL del icono si es necesario
            if (cachedData.weather && cachedData.weather.weather) {
              cachedData.weather.weather.icon = fixIconForTimeOfDay(
                cachedData.weather.weather.icon,
                isDayTime
              );
              cachedData.weather.weather.isDayTime = isDayTime;
            }

            setWeatherData(cachedData.weather);
            setRecommendations(cachedData.recommendations);

            // Pasar las recomendaciones al componente padre
            if (onRecommendationsGenerated) {
              onRecommendationsGenerated(cachedData.recommendations);
            }

            // Pasar los datos meteorológicos al componente padre
            if (onWeatherDataReceived) {
              onWeatherDataReceived(cachedData.weather);
            }

            // Obtener recomendaciones de películas para el clima en caché
            fetchWeatherBasedMovies(cachedData.weather);

            setLoading(false);
            return; // Usar datos en caché, no continuar con la petición
          }
        }

        setLoading(true);

        // Obtener la ubicación del usuario
        const location = await getUserLocation();

        // Obtener datos del clima para esa ubicación
        const weather = await getCurrentWeatherByCoords(
          location.latitude,
          location.longitude
        );

        // Determinar si es de día o de noche según la hora actual
        const currentHour = new Date().getHours();
        const isDayTime = currentHour >= 6 && currentHour < 20;

        // Actualizar el icono y la bandera isDayTime
        if (weather && weather.weather) {
          weather.weather.icon = fixIconForTimeOfDay(
            weather.weather.icon,
            isDayTime
          );
          weather.weather.isDayTime = isDayTime;
        }

        setWeatherData(weather);

        // Generar recomendaciones basadas en el clima
        const weatherRecs = await getWeatherBasedRecommendations(weather);
        setRecommendations(weatherRecs);

        // Guardar en caché
        saveWeatherToCache(weather, weatherRecs);

        // Pasar las recomendaciones al componente padre
        if (onRecommendationsGenerated) {
          onRecommendationsGenerated(weatherRecs);
        }

        // Pasar los datos meteorológicos al componente padre
        if (onWeatherDataReceived) {
          onWeatherDataReceived(weather);
        }

        // Obtener recomendaciones de películas para el clima
        fetchWeatherBasedMovies(weather);

        setLoading(false);
      } catch (err) {
        console.error(t("weather.fetchError"), err);
        setError(t("weather.loadError"));
        setLoading(false);
      }
    };

    // Realizar la primera carga de datos (intentar caché primero)
    fetchWeatherData(false);

    // Actualizar los datos cada 30 minutos, pero forzando una nueva petición
    const interval = setInterval(() => {
      fetchWeatherData(true);
    }, CACHE_EXPIRATION);

    return () => clearInterval(interval);
  }, [onRecommendationsGenerated, onWeatherDataReceived, t]);

  // Función para obtener la clase de tema basada en el clima y hora del día
  const getThemeClass = () => {
    if (!weatherData) return "";

    const { weather } = weatherData;
    const isDayTime = weather.isDayTime;
    const weatherType = weather.main.toLowerCase();

    // Base: día o noche
    let themeClass = isDayTime ? "day-theme" : "night-theme";

    // Añadir clase específica para el tipo de clima
    if (weatherType.includes("rain") || weatherType.includes("drizzle")) {
      themeClass += " rain-theme";
    } else if (weatherType.includes("snow")) {
      themeClass += " snow-theme";
    } else if (weatherType.includes("cloud")) {
      themeClass += " cloud-theme";
    } else if (weatherType.includes("clear")) {
      themeClass += " clear-theme";
    } else if (
      weatherType.includes("thunder") ||
      weatherType.includes("storm")
    ) {
      themeClass += " storm-theme";
    } else if (weatherType.includes("fog") || weatherType.includes("mist")) {
      themeClass += " fog-theme";
    }

    return themeClass;
  };

  if (loading) {
    return (
      <div className="weather-widget weather-loading">
        <div className="weather-loader"></div>
        <p>{t("weather.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-widget weather-error">
        <p>{error}</p>
      </div>
    );
  }

  if (!weatherData) return null;

  const { location, weather, temperature, details } = weatherData;
  const themeClass = getThemeClass();
  const isDayTime = weather.isDayTime;

  return (
    <div className={`weather-widget ${themeClass}`}>
      {/* Decoraciones temáticas */}
      <div className="weather-decorations">
        {isDayTime && <div className="sun-decoration"></div>}
        {!isDayTime && <div className="moon-decoration"></div>}
        {weather.main.toLowerCase().includes("rain") && (
          <div className="rain-decoration">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="raindrop"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              ></div>
            ))}
          </div>
        )}
        {weather.main.toLowerCase().includes("snow") && (
          <div className="snow-decoration">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="snowflake"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              ></div>
            ))}
          </div>
        )}
      </div>

      <div className="weather-header">
        <img
          src={weather.icon}
          alt={weather.description}
          className="weather-icon"
        />
        <div className="weather-info">
          <h3 className="weather-location">
            {location.city}, {location.country}
          </h3>
          <div className="weather-temp">
            {temperature.current}
            {temperature.unit}
            <span className="weather-description">{weather.description}</span>
          </div>
        </div>
      </div>

      <div className="weather-details">
        <div className="weather-detail-item">
          <span className="detail-label">{t("weather.feelsLike")}:</span>
          <span className="detail-value">
            {temperature.feelsLike}
            {temperature.unit}
          </span>
        </div>
        <div className="weather-detail-item">
          <span className="detail-label">{t("weather.humidity")}:</span>
          <span className="detail-value">{details.humidity}%</span>
        </div>
        <div className="weather-detail-item">
          <span className="detail-label">{t("weather.wind")}:</span>
          <span className="detail-value">{details.windSpeed} m/s</span>
        </div>
      </div>

      <div className="weather-sun-times">
        <div className="sun-time-item">
          <i className="fas fa-sunrise"></i>
          <span>{details.sunrise}</span>
        </div>
        <div className="sun-time-item">
          <i className="fas fa-sunset"></i>
          <span>{details.sunset}</span>
        </div>
      </div>

      {/* Sección de películas recomendadas por el clima */}
      {movieRecommendations.length > 0 && (
        <div className="weather-movie-recommendations">
          <h4>
            {t("weather.movieRecommendations") || "Películas recomendadas"}
          </h4>
          <div className="movie-recommendations-container">
            {movieRecommendations.map((movie) => (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className="movie-recommendation-card"
              >
                <img
                  src={movie.poster_path}
                  alt={movie.title}
                  className="movie-poster"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/150x225?text=Sin+imagen";
                  }}
                />
                <div className="movie-info">
                  <h5>{movie.title}</h5>
                  <div className="movie-rating">
                    <i className="fas fa-star"></i>
                    <span>
                      {movie.vote_average
                        ? Number(movie.vote_average).toFixed(1)
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
