import movieData from "../data/movieData";
import { TMDB_API_KEY, APP_CONFIG } from "./config";

// Constantes de la API de TMDB
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = APP_CONFIG.imageBaseUrl;

// API Key de TMDB desde el archivo de configuración
const API_KEY = TMDB_API_KEY;

// Opciones de fetch para la API de TMDB
const TMDB_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};

// Tamaños de imagen comunes
export const IMAGE_SIZES = {
  poster: {
    small: "w185",
    medium: "w342",
    large: "w500",
    original: "original",
  },
  backdrop: {
    small: "w300",
    medium: "w780",
    large: "w1280",
    original: "original",
  },
  profile: {
    small: "w45",
    medium: "w185",
    large: "h632",
    original: "original",
  },
};

// Función para construir URLs de imagen
export const getImageUrl = (path, size = "original", type = "poster") => {
  if (!path) return null;
  const sizeKey = IMAGE_SIZES[type]?.[size] || size;
  return `${TMDB_IMAGE_BASE_URL}/${sizeKey}${path}`;
};

// Simulación de API para obtener datos (esta parte permanece para compatibilidad con el código existente)
export const getMovieById = async (id) => {
  console.log(`Buscando película con ID: ${id}, tipo: ${typeof id}`); // Para depuración

  return new Promise((resolve) => {
    // Simulamos una petición de red con tiempo menor para mejorar la UX
    setTimeout(() => {
      // Convertir el ID a string y a número para comparar de ambas formas
      const idStr = String(id);
      const idNum = Number(id);

      // Buscar por cualquier tipo de coincidencia
      const movie = movieData.find(
        (m) =>
          m.id === id ||
          m.id === idStr ||
          m.id === idNum ||
          String(m.id) === idStr ||
          Number(m.id) === idNum
      );

      console.log(`Película encontrada:`, movie); // Para depuración
      resolve(movie);
    }, 400);
  });
};

// Funciones existentes (pero ahora pueden llamar a TMDB)
export const getMoviesByGenre = async (genreId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredMovies = movieData.filter((movie) =>
        movie.genres.includes(genreId)
      );
      resolve(filteredMovies);
    }, 800);
  });
};

export const searchMovies = async (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const searchResults = movieData.filter(
        (movie) =>
          movie.title.toLowerCase().includes(query.toLowerCase()) ||
          movie.description.toLowerCase().includes(query.toLowerCase())
      );
      resolve(searchResults);
    }, 800);
  });
};

export const getTrendingMovies = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Aquí simplemente devolveríamos los primeros 10 por ejemplo
      const trending = movieData.slice(0, 10);
      resolve(trending);
    }, 800);
  });
};

// NUEVAS FUNCIONES PARA CONECTAR CON TMDB API

/**
 * Obtiene todas las películas populares de TMDB
 * @param {number} page - Número de página (1-1000)
 * @returns {Promise<Array>} - Array de películas
 */
export const getAllMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?language=es-ES&page=${page}&api_key=${API_KEY}`,
      TMDB_OPTIONS
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error al obtener las películas:", error);
    throw error;
  }
};

/**
 * Obtiene detalles de una película específica
 * @param {number} movieId - ID de la película en TMDB
 * @returns {Promise<Object>} - Datos de la película
 */
export const getMovieDetails = async (movieId) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?language=es-ES&append_to_response=credits,videos,images&api_key=${API_KEY}`,
      TMDB_OPTIONS
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(
      `Error al obtener detalles de la película ${movieId}:`,
      error
    );
    throw error;
  }
};

/**
 * Busca películas por término de búsqueda
 * @param {string} searchTerm - Término de búsqueda
 * @param {number} page - Número de página
 * @returns {Promise<Array>} - Resultados de búsqueda
 */
export const searchTMDBMovies = async (searchTerm, page = 1) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(
        searchTerm
      )}&language=es-ES&page=${page}&api_key=${API_KEY}`,
      TMDB_OPTIONS
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error al buscar películas:", error);
    throw error;
  }
};

/**
 * Obtiene películas por género
 * @param {number} genreId - ID del género en TMDB
 * @param {number} page - Número de página
 * @returns {Promise<Array>} - Películas del género especificado
 */
export const getTMDBMoviesByGenre = async (genreId, page = 1) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/movie?with_genres=${genreId}&language=es-ES&page=${page}&api_key=${API_KEY}`,
      TMDB_OPTIONS
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(`Error al obtener películas del género ${genreId}:`, error);
    throw error;
  }
};

/**
 * Obtiene películas en tendencia
 * @param {string} timeWindow - Ventana de tiempo ('day' o 'week')
 * @returns {Promise<Array>} - Películas en tendencia
 */
export const getTMDBTrendingMovies = async (timeWindow = "week") => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/movie/${timeWindow}?language=es-ES&api_key=${API_KEY}`,
      TMDB_OPTIONS
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error al obtener películas en tendencia:", error);
    throw error;
  }
};

/**
 * Obtiene las películas mejor valoradas
 * @param {number} page - Número de página
 * @returns {Promise<Array>} - Películas mejor valoradas
 */
export const getTopRatedMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/top_rated?language=es-ES&page=${page}&api_key=${API_KEY}`,
      TMDB_OPTIONS
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error al obtener películas mejor valoradas:", error);
    throw error;
  }
};

/**
 * Obtiene los géneros de películas disponibles
 * @returns {Promise<Array>} - Lista de géneros
 */
export const getMovieGenres = async () => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/movie/list?language=es-ES&api_key=${API_KEY}`,
      TMDB_OPTIONS
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error("Error al obtener géneros de películas:", error);
    throw error;
  }
};

/**
 * Obtiene películas que se estrenarán próximamente
 * @param {number} page - Número de página
 * @returns {Promise<Array>} - Películas próximas
 */
export const getUpcomingMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/upcoming?language=es-ES&page=${page}&api_key=${API_KEY}`,
      TMDB_OPTIONS
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error al obtener próximos estrenos:", error);
    throw error;
  }
};

// FUNCIONES PARA OBTENER SERIES DE TMDB

/**
 * Obtiene series populares de TMDB
 * @param {number} page - Número de página (1-1000)
 * @returns {Promise<Array>} - Array de series
 */
export const getPopularTVShows = async (page = 1) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/popular?language=es-ES&page=${page}&api_key=${API_KEY}`,
      TMDB_OPTIONS
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    // Añadimos un campo para identificar que son series
    const processedShows = data.results.map((show) => ({
      ...show,
      media_type: "tv", // Añadir tipo de medio
    }));
    return processedShows;
  } catch (error) {
    console.error("Error al obtener las series populares:", error);
    throw error;
  }
};

/**
 * Obtiene series en emisión actualmente
 * @param {number} page - Número de página
 * @returns {Promise<Array>} - Series en emisión
 */
export const getOnTheAirTVShows = async (page = 1) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/on_the_air?language=es-ES&page=${page}&api_key=${API_KEY}`,
      TMDB_OPTIONS
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    // Añadimos un campo para identificar que son series
    const processedShows = data.results.map((show) => ({
      ...show,
      media_type: "tv", // Añadir tipo de medio
    }));
    return processedShows;
  } catch (error) {
    console.error("Error al obtener las series en emisión:", error);
    throw error;
  }
};

/**
 * Obtiene detalles de una serie específica
 * @param {number} tvId - ID de la serie en TMDB
 * @returns {Promise<Object>} - Datos de la serie
 */
export const getTVShowDetails = async (tvId) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${tvId}?language=es-ES&append_to_response=credits,videos,images,seasons&api_key=${API_KEY}`,
      TMDB_OPTIONS
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return {
      ...data,
      media_type: "tv",
    };
  } catch (error) {
    console.error(`Error al obtener detalles de la serie ${tvId}:`, error);
    throw error;
  }
};

/**
 * Obtiene series mejor valoradas
 * @param {number} page - Número de página
 * @returns {Promise<Array>} - Series mejor valoradas
 */
export const getTopRatedTVShows = async (page = 1) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/top_rated?language=es-ES&page=${page}&api_key=${API_KEY}`,
      TMDB_OPTIONS
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    // Añadimos un campo para identificar que son series
    const processedShows = data.results.map((show) => ({
      ...show,
      media_type: "tv", // Añadir tipo de medio
    }));
    return processedShows;
  } catch (error) {
    console.error("Error al obtener series mejor valoradas:", error);
    throw error;
  }
};

/**
 * Busca series por término de búsqueda
 * @param {string} searchTerm - Término de búsqueda
 * @param {number} page - Número de página
 * @returns {Promise<Array>} - Resultados de búsqueda
 */
export const searchTMDBTVShows = async (searchTerm, page = 1) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/tv?query=${encodeURIComponent(
        searchTerm
      )}&language=es-ES&page=${page}&api_key=${API_KEY}`,
      TMDB_OPTIONS
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    // Añadimos un campo para identificar que son series
    const processedShows = data.results.map((show) => ({
      ...show,
      media_type: "tv", // Añadir tipo de medio
    }));
    return processedShows;
  } catch (error) {
    console.error("Error al buscar series:", error);
    throw error;
  }
};
