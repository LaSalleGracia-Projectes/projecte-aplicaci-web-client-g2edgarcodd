// API para obtener datos meteorológicos usando OpenWeatherMap
// Esta API se puede utilizar para recomendar películas según el clima
// o simplemente mostrar información meteorológica en la aplicación

import movies, { genres } from "../data/movieData";

// Configuración de la API OpenWeatherMap
const WEATHER_API_KEY = "4bb66e7a3f7c77e197dbe1248782985e";
const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";
const WEATHER_ICONS_URL = "https://openweathermap.org/img/wn";

// Función auxiliar para hacer peticiones a la API
const fetchFromWeatherAPI = async (endpoint, params = "") => {
  try {
    const response = await fetch(
      `${WEATHER_BASE_URL}${endpoint}?appid=${WEATHER_API_KEY}${params}`
    );

    if (!response.ok) {
      throw new Error(`Error en la petición meteorológica: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener datos meteorológicos:", error);
    throw error;
  }
};

// Formatear los datos del clima para un uso más fácil en la aplicación
const formatWeatherData = (data) => {
  // Determinar si es de día o de noche basado en el icono y comparando con sunrise/sunset
  const currentTime = new Date().getTime() / 1000; // Tiempo actual en segundos
  const isDayIcon = data.weather[0].icon.endsWith("d"); // Los iconos terminados en 'd' son de día

  // Comparar el tiempo actual con la salida y puesta del sol
  // Si no hay datos de sunrise/sunset, confiar solo en el icono
  let isDayTime = isDayIcon;

  // Si tenemos datos de sunrise/sunset, verificar si estamos entre esos tiempos
  if (data.sys && data.sys.sunrise && data.sys.sunset) {
    isDayTime =
      currentTime >= data.sys.sunrise && currentTime <= data.sys.sunset;
  }

  // Para depuración
  console.log("Hora actual: ", new Date().toLocaleTimeString());
  console.log(
    "Amanecer: ",
    new Date(data.sys.sunrise * 1000).toLocaleTimeString()
  );
  console.log(
    "Atardecer: ",
    new Date(data.sys.sunset * 1000).toLocaleTimeString()
  );
  console.log("¿Es de día según el tiempo? ", isDayTime);
  console.log("¿Es de día según el icono? ", isDayIcon);

  // Corregir el icono si no coincide con la hora real del día
  let weatherIcon = data.weather[0].icon;
  // Si el icono muestra día pero es de noche realmente, cambiar a icono de noche
  if (isDayIcon && !isDayTime) {
    weatherIcon = weatherIcon.replace("d", "n");
  }
  // Si el icono muestra noche pero es de día realmente, cambiar a icono de día
  else if (!isDayIcon && isDayTime) {
    weatherIcon = weatherIcon.replace("n", "d");
  }

  return {
    location: {
      city: data.name,
      country: data.sys.country,
      coordinates: {
        lat: data.coord.lat,
        lon: data.coord.lon,
      },
    },
    weather: {
      main: data.weather[0].main,
      description: data.weather[0].description,
      icon: `${WEATHER_ICONS_URL}/${weatherIcon}@2x.png`,
      id: data.weather[0].id,
      isDayTime: isDayTime,
      isDayIcon: isDayIcon,
    },
    temperature: {
      current: Math.round(data.main.temp - 273.15), // Convertir de Kelvin a Celsius
      feelsLike: Math.round(data.main.feels_like - 273.15),
      min: Math.round(data.main.temp_min - 273.15),
      max: Math.round(data.main.temp_max - 273.15),
      unit: "°C",
    },
    details: {
      humidity: data.main.humidity, // En porcentaje
      pressure: data.main.pressure, // En hPa
      visibility: data.visibility / 1000, // Convertir de metros a km
      windSpeed: data.wind.speed, // En m/s
      windDirection: data.wind.deg, // En grados
      clouds: data.clouds.all, // Cobertura de nubes en porcentaje
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
      sunriseTimestamp: data.sys.sunrise,
      sunsetTimestamp: data.sys.sunset,
    },
    timestamp: new Date(data.dt * 1000).toLocaleString(),
  };
};

/**
 * Obtiene el clima actual basado en la ubicación del usuario (por coordenadas)
 * @param {number} latitude - Latitud de la ubicación
 * @param {number} longitude - Longitud de la ubicación
 * @returns {Promise<Object>} - Datos meteorológicos formateados
 */
export const getCurrentWeatherByCoords = async (latitude, longitude) => {
  try {
    const data = await fetchFromWeatherAPI(
      "/weather",
      `&lat=${latitude}&lon=${longitude}&lang=es`
    );
    return formatWeatherData(data);
  } catch (error) {
    console.warn("Error al obtener el clima por coordenadas:", error);
    return getFallbackWeatherData();
  }
};

/**
 * Obtiene el clima actual por nombre de ciudad
 * @param {string} city - Nombre de la ciudad
 * @returns {Promise<Object>} - Datos meteorológicos formateados
 */
export const getCurrentWeatherByCity = async (city) => {
  try {
    const data = await fetchFromWeatherAPI(
      "/weather",
      `&q=${encodeURIComponent(city)}&lang=es`
    );
    return formatWeatherData(data);
  } catch (error) {
    console.warn("Error al obtener el clima por ciudad:", error);
    return getFallbackWeatherData();
  }
};

/**
 * Obtiene el pronóstico del tiempo para los próximos días
 * @param {number} latitude - Latitud de la ubicación
 * @param {number} longitude - Longitud de la ubicación
 * @param {number} days - Número de días para el pronóstico (máx 5)
 * @returns {Promise<Array>} - Array con datos de pronóstico para cada día
 */
export const getWeatherForecast = async (latitude, longitude, days = 5) => {
  try {
    const data = await fetchFromWeatherAPI(
      "/forecast",
      `&lat=${latitude}&lon=${longitude}&lang=es`
    );

    // La API devuelve pronósticos cada 3 horas, agrupamos por día
    const forecasts = data.list;
    const dailyForecasts = [];
    const today = new Date().setHours(0, 0, 0, 0);

    // Agrupar pronósticos por día
    let currentDay = null;
    let currentDayForecasts = [];

    forecasts.forEach((forecast) => {
      const forecastDate = new Date(forecast.dt * 1000);
      const forecastDay = forecastDate.setHours(0, 0, 0, 0);

      // Saltar hoy
      if (forecastDay === today) return;

      if (currentDay === null) {
        currentDay = forecastDay;
      }

      if (forecastDay !== currentDay) {
        // Procesar el día anterior
        if (currentDayForecasts.length > 0) {
          dailyForecasts.push(
            processDayForecast(currentDayForecasts, currentDay)
          );

          // Salir si ya tenemos suficientes días
          if (dailyForecasts.length >= days) {
            return;
          }
        }

        currentDay = forecastDay;
        currentDayForecasts = [];
      }

      currentDayForecasts.push(forecast);
    });

    // Procesar el último día si no se ha procesado
    if (currentDayForecasts.length > 0 && dailyForecasts.length < days) {
      dailyForecasts.push(processDayForecast(currentDayForecasts, currentDay));
    }

    return dailyForecasts;
  } catch (error) {
    console.warn("Error al obtener el pronóstico del tiempo:", error);
    return getFallbackForecastData();
  }
};

/**
 * Procesa los pronósticos de un día para obtener un resumen
 * @param {Array} forecasts - Lista de pronósticos para un día
 * @param {number} day - Timestamp del día
 * @returns {Object} - Resumen del pronóstico para el día
 */
const processDayForecast = (forecasts, day) => {
  // Encontrar valores min/max y el pronóstico más común del día
  let minTemp = Infinity;
  let maxTemp = -Infinity;
  let totalHumidity = 0;

  // Contar ocurrencias de cada tipo de clima
  const weatherCounts = {};

  forecasts.forEach((forecast) => {
    // Temperatura (convertir de Kelvin a Celsius)
    const temp = forecast.main.temp - 273.15;
    minTemp = Math.min(minTemp, temp);
    maxTemp = Math.max(maxTemp, temp);

    // Humedad
    totalHumidity += forecast.main.humidity;

    // Clima
    const weatherMain = forecast.weather[0].main;
    if (!weatherCounts[weatherMain]) {
      weatherCounts[weatherMain] = 0;
    }
    weatherCounts[weatherMain]++;
  });

  // Encontrar el clima más común
  let commonWeather = null;
  let maxCount = 0;

  for (const [weather, count] of Object.entries(weatherCounts)) {
    if (count > maxCount) {
      commonWeather = weather;
      maxCount = count;
    }
  }

  // Buscar el pronóstico con ese clima para obtener detalles
  const representativeForecast =
    forecasts.find((f) => f.weather[0].main === commonWeather) || forecasts[0];

  // Usar la misma lógica de día/noche que en formatWeatherData
  const currentTime = new Date().getTime() / 1000; // Tiempo actual en segundos
  const weatherIcon = representativeForecast.weather[0].icon;
  const isDayIcon = weatherIcon.endsWith("d");

  // Obtener los tiempos de amanecer/anochecer del primer pronóstico del día
  // Si no está disponible, usar una estimación razonable (6AM-8PM)
  let isDayTime = isDayIcon;

  // Intentar obtener los datos de sunrise/sunset si están disponibles en el forecast
  if (forecasts[0].sys && forecasts[0].sys.sunrise && forecasts[0].sys.sunset) {
    isDayTime =
      currentTime >= forecasts[0].sys.sunrise &&
      currentTime <= forecasts[0].sys.sunset;
  } else {
    // Estimación basada en la hora (6 AM - 8 PM)
    const hours = new Date().getHours();
    isDayTime = hours >= 6 && hours < 20;
  }

  // Corregir el icono si no coincide con la hora real del día
  let correctedIcon = weatherIcon;
  if (isDayIcon && !isDayTime) {
    correctedIcon = weatherIcon.replace("d", "n");
  } else if (!isDayIcon && isDayTime) {
    correctedIcon = weatherIcon.replace("n", "d");
  }

  return {
    date: new Date(day).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    timestamp: day,
    weather: {
      main: representativeForecast.weather[0].main,
      description: representativeForecast.weather[0].description,
      icon: `${WEATHER_ICONS_URL}/${correctedIcon}@2x.png`,
      id: representativeForecast.weather[0].id,
    },
    temperature: {
      min: Math.round(minTemp),
      max: Math.round(maxTemp),
      unit: "°C",
    },
    humidity: Math.round(totalHumidity / forecasts.length),
  };
};

/**
 * Obtiene películas recomendadas basadas en el clima actual
 * @param {Object} weatherData - Datos meteorológicos
 * @returns {Promise<Object>} - Recomendaciones basadas en el clima
 */
export const getWeatherBasedRecommendations = async (weatherData) => {
  // Determina el tipo de clima y la estación
  const { weather, temperature } = weatherData;
  const weatherType = weather.main.toLowerCase();
  const isWarm = temperature.current > 20;
  const isCold = temperature.current < 10;

  // Genera títulos y mensajes personalizados
  let title = "Nuestras recomendaciones para hoy";
  let message = "Películas que podrían gustarte";
  let genreIds = []; // IDs de géneros para filtrar películas

  // Personaliza las recomendaciones según el clima
  if (weatherType.includes("rain") || weatherType.includes("drizzle")) {
    title = "Perfecto para ver con lluvia";
    message = "La lluvia cae fuera, ¡disfruta de estas películas en casa!";
    genreIds = [3, 9]; // Drama, Misterio
  } else if (weatherType.includes("snow")) {
    title = "Recomendaciones para un día nevado";
    message = "Ponte cómodo con estas películas mientras nieva afuera";
    genreIds = [1, 4]; // Fantasía, Aventura
  } else if (weatherType.includes("clear")) {
    if (isWarm) {
      title = "Día soleado y cálido";
      message = "¿Por qué no una película de aventuras o acción?";
      genreIds = [2, 4]; // Acción, Aventura
    } else {
      title = "Día claro y fresco";
      message = "Disfruta estas recomendaciones para un día como hoy";
      genreIds = [8, 3]; // Comedia, Drama
    }
  } else if (weatherType.includes("cloud")) {
    title = "Para un día nublado";
    message = "Estas películas combinan perfectamente con el día de hoy";
    genreIds = [12, 6]; // Ciencia ficción, Thriller
  } else if (weatherType.includes("storm") || weatherType.includes("thunder")) {
    title = "Perfecto para una tormenta";
    message =
      "Mientras hay tormenta fuera, disfruta de estas películas intensas";
    genreIds = [5, 6]; // Terror, Thriller
  } else {
    // Recomendaciones generales si no coincide ninguno de los anteriores
    genreIds = [2, 3, 8, 12]; // Acción, Drama, Comedia, Ciencia Ficción
  }

  // Filtrar películas por géneros
  const recommendedMovies = movies.filter((movie) => {
    // Verificar si la película tiene al menos uno de los géneros recomendados
    return movie.genres.some((genreId) => genreIds.includes(genreId));
  });

  // Limitar a 6 películas y aleatorizar el orden
  const shuffled = [...recommendedMovies].sort(() => 0.5 - Math.random());
  const selectedMovies = shuffled.slice(0, 6);

  // Obtener los nombres de los géneros para mostrar
  const genreNames = genreIds
    .map((id) => {
      const genre = genres.find((g) => g.id === id);
      return genre ? genre.name : "";
    })
    .filter((name) => name !== "");

  return {
    title,
    message,
    genreIds,
    genreNames,
    weatherSummary: {
      condition: weather.description,
      temperature: `${temperature.current}${temperature.unit}`,
      icon: weather.icon,
    },
    recommendedMovies: selectedMovies,
  };
};

/**
 * Datos de respaldo en caso de que la API no responda
 * @returns {Object} - Datos meteorológicos de respaldo
 */
const getFallbackWeatherData = () => {
  return {
    location: {
      city: "Barcelona",
      country: "ES",
      coordinates: {
        lat: 41.39,
        lon: 2.17,
      },
    },
    weather: {
      main: "Clear",
      description: "cielo despejado",
      icon: `${WEATHER_ICONS_URL}/01d@2x.png`,
      id: 800,
    },
    temperature: {
      current: 22,
      feelsLike: 21,
      min: 19,
      max: 24,
      unit: "°C",
    },
    details: {
      humidity: 65,
      pressure: 1015,
      visibility: 10,
      windSpeed: 3.6,
      windDirection: 230,
      clouds: 0,
      sunrise: "07:15",
      sunset: "20:45",
    },
    timestamp: new Date().toLocaleString(),
  };
};

/**
 * Datos de pronóstico de respaldo
 * @returns {Array} - Datos de pronóstico de respaldo
 */
const getFallbackForecastData = () => {
  const days = [];
  const today = new Date();

  for (let i = 1; i <= 5; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);

    days.push({
      date: date.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      timestamp: date.getTime(),
      weather: {
        main: "Clear",
        description: "cielo despejado",
        icon: `${WEATHER_ICONS_URL}/01d@2x.png`,
        id: 800,
      },
      temperature: {
        min: 18 + Math.floor(Math.random() * 3),
        max: 23 + Math.floor(Math.random() * 5),
        unit: "°C",
      },
      humidity: 60 + Math.floor(Math.random() * 20),
    });
  }

  return days;
};

/**
 * Obtiene la ubicación del usuario utilizando la API de geolocalización del navegador
 * @returns {Promise<Object>} - Coordenadas del usuario {latitude, longitude}
 */
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(
        new Error("La geolocalización no está disponible en este navegador")
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.warn("Error obteniendo la geolocalización:", error);
        // Coordenadas por defecto (Barcelona)
        resolve({
          latitude: 41.390205,
          longitude: 2.154007,
        });
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
};

/**
 * Obtiene ciudades que coinciden con un texto para autocompletado
 * @param {string} query - Texto a buscar
 * @returns {Promise<Array>} - Lista de ciudades que coinciden
 */
export const getLocationSuggestions = async (query) => {
  if (!query || query.length < 3) return [];

  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        query
      )}&limit=5&appid=${WEATHER_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(
        `Error en la búsqueda de ubicaciones: ${response.status}`
      );
    }

    const data = await response.json();

    return data.map((location) => ({
      name: location.name,
      country: location.country,
      state: location.state,
      lat: location.lat,
      lon: location.lon,
      displayName: location.state
        ? `${location.name}, ${location.state}, ${location.country}`
        : `${location.name}, ${location.country}`,
    }));
  } catch (error) {
    console.warn("Error al obtener sugerencias de ubicación:", error);
    return [];
  }
};
