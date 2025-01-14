import movieData from '../data/movieData';

// Simulación de API para obtener datos
export const getMovieById = async (id) => {
  return new Promise((resolve) => {
    // Simulamos una petición de red
    setTimeout(() => {
      const numId = parseInt(id);
      const movie = movieData.find(m => m.id === numId);
      resolve(movie);
    }, 800);
  });
};

export const getMoviesByGenre = async (genreId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredMovies = movieData.filter(movie => movie.genres.includes(genreId));
      resolve(filteredMovies);
    }, 800);
  });
};

export const searchMovies = async (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const searchResults = movieData.filter(movie => 
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