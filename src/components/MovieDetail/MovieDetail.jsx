import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatDuration, formatList } from '../../utils/formatters';
import '../../styles/components/moviedetail.css';

function MovieDetail({ movie }) {
  const [expanded, setExpanded] = useState(false);

  if (!movie) {
    return <div className="movie-detail-loading">Cargando información...</div>;
  }
  
  const toggleDescription = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="movie-detail">
      <div className="movie-main-info">
        <div className="movie-poster-container">
          <img 
            src={movie.image} 
            alt={movie.title} 
            className="movie-poster"
          />
          <div className="movie-badge-container">
            {movie.rating >= 8.0 && (
              <span className="movie-badge top-rated">
                <i className="fas fa-award"></i> Top valorada
              </span>
            )}
          </div>
        </div>
        
        <div className="movie-info-container">
          <h1 className="movie-title">{movie.title}</h1>
          
          <div className="movie-meta-info">
            <span className="movie-year">{movie.year}</span>
            <span className="movie-rating">
              <i className="fas fa-star"></i> {movie.rating}/10
            </span>
            <span className="movie-runtime">{movie.runtime}</span>
          </div>
          
          <div className="movie-genres">
            {movie.genres && movie.genres.map((genre, index) => (
              <Link to={`/category/${genre}`} key={index} className="genre-tag">
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </Link>
            ))}
          </div>
          
          <div className={`movie-description ${expanded ? 'expanded' : ''}`}>
            <p>{movie.overview}</p>
            {movie.overview && movie.overview.length > 200 && (
              <button 
                className="expand-button" 
                onClick={toggleDescription}
              >
                {expanded ? 'Menos' : 'Más'} <i className={`fas fa-chevron-${expanded ? 'up' : 'down'}`}></i>
              </button>
            )}
          </div>
          
          <div className="movie-crew">
            <div className="crew-item">
              <span className="crew-label">Director:</span>
              <span className="crew-value">{movie.director || 'N/A'}</span>
            </div>
          </div>
          
          <div className="movie-actions">
            <button className="action-button primary">
              <i className="fas fa-play"></i> Reproducir
            </button>
            <button className="action-button secondary">
              <i className="fas fa-plus"></i> Mi Lista
            </button>
            <button className="action-button secondary">
              <i className="fas fa-thumbs-up"></i> Valorar
            </button>
            <button className="action-button secondary">
              <i className="fas fa-share"></i> Compartir
            </button>
          </div>
        </div>
      </div>
      
      <div className="movie-details-tabs">
        <div className="movie-availability">
          <h3>Disponible en</h3>
          <div className="streaming-platforms">
            <div className="platform">
              <i className="fas fa-tv"></i>
              <span>Premium</span>
            </div>
            <div className="platform">
              <i className="fas fa-mobile-alt"></i>
              <span>Móvil</span>
            </div>
            <div className="platform">
              <i className="fas fa-tablet-alt"></i>
              <span>Tablet</span>
            </div>
          </div>
        </div>
        
        <div className="movie-extras">
          <h3>Extras y características</h3>
          <div className="extras-list">
            <div className="extra-item">
              <i className="fas fa-closed-captioning"></i>
              <span>Subtítulos</span>
            </div>
            <div className="extra-item">
              <i className="fas fa-volume-up"></i>
              <span>Audio descriptivo</span>
            </div>
            {movie.genres.includes('scifi') && (
              <div className="extra-item">
                <i className="fas fa-vr-cardboard"></i>
                <span>Experiencia VR</span>
              </div>
            )}
            {movie.genres.includes('action') && (
              <div className="extra-item">
                <i className="fas fa-film"></i>
                <span>Escenas eliminadas</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

MovieDetail.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string.isRequired,
    overview: PropTypes.string,
    image: PropTypes.string,
    backdropPath: PropTypes.string,
    year: PropTypes.string,
    runtime: PropTypes.string,
    rating: PropTypes.string,
    genres: PropTypes.array,
    director: PropTypes.string,
    cast: PropTypes.array
  })
};

export default MovieDetail;