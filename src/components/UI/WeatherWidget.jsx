import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  getCurrentWeatherByCoords,
  getUserLocation,
  getWeatherBasedRecommendations,
} from "../../utils/weatherApi";
import "../../styles/components/WeatherWidget.css";

// Clave para almacenar datos en localStorage
const WEATHER_CACHE_KEY = "streamhub_weather_cache";
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

      {recommendations && (
        <div className="weather-recommendations">
          <h4>
            {isDayTime
              ? t("weather.dayRecommendations")
              : t("weather.nightRecommendations")}
          </h4>
          <p>
            {isDayTime
              ? `${recommendations.message} ${t("weather.dayTip")}`
              : `${recommendations.message} ${t("weather.nightTip")}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
