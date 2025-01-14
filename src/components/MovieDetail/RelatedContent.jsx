import React from 'react';
import { Link } from 'react-router-dom';

function RelatedContent({ genreIds, currentMovieId }) {
  // Datos simulados de películas relacionadas
  const relatedMovies = [
    {
      id: 201,
      title: "Dune: Parte Dos",
      image: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
      year: "2024",
      rating: 8.5
    },
    {
      id: 202,
      title: "Oppenheimer",
      image: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      year: "2023",
      rating: 8.2
    },
    {
      id: 203,
      title: "Pobres Criaturas",
      image: "https://image.tmdb.org/t/p/w500/kKxk0qTTm3kdBBwUkYEGSvNoLl4.jpg",
      year: "2023",
      rating: 7.8
    },
    {
      id: 204,
      title: "The Creator",
      image: "https://image.tmdb.org/t/p/w500/vBZ0qvaRxqEhZwl6LWmruJqWE8Z.jpg",
      year: "2023",
      rating: 7.0
    }
  ];
  
  return (
    <div className="related-content">
      <h2>Contenido relacionado</h2>
      <div className="related-grid">
        {relatedMovies.map(movie => (
          <Link to={`/movie/${movie.id}`} key={movie.id} className="related-item">
            <div className="related-poster">
              <img src={movie.image} alt={movie.title} />
              <div className="related-overlay">
                <i className="fas fa-play-circle"></i>
              </div>
            </div>
            <div className="related-info">
              <h3 className="related-title">{movie.title}</h3>
              <div className="related-meta">
                <span>{movie.year}</span>
                <span>
                  <i className="fas fa-star"></i> {movie.rating}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RelatedContent;