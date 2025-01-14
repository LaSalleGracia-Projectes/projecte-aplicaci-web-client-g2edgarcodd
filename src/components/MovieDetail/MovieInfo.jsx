import React from 'react';

function MovieInfo({ movie }) {
  return (
    <div className="movie-info">
      <p className="movie-description">{movie.description}</p>
      
      <div className="movie-details">
        <div className="detail-item">
          <h4>Director</h4>
          <p>Christopher Nolan</p>
        </div>
        <div className="detail-item">
          <h4>Guionista</h4>
          <p>Jonathan Nolan</p>
        </div>
        <div className="detail-item">
          <h4>Fecha de estreno</h4>
          <p>15 de julio de 2023</p>
        </div>
        <div className="detail-item">
          <h4>Idioma original</h4>
          <p>Inglés</p>
        </div>
      </div>
      
      <div className="movie-awards">
        <h4>Premios</h4>
        <div className="awards-list">
          <span className="award-tag">
            <i className="fas fa-award"></i> Oscar Mejor Dirección
          </span>
          <span className="award-tag">
            <i className="fas fa-trophy"></i> Globo de Oro Mejor Película
          </span>
          <span className="award-tag">
            <i className="fas fa-star"></i> BAFTA Mejor Guion
          </span>
        </div>
      </div>
      
      <div className="movie-availability">
        <h4>Disponible en</h4>
        <div className="platforms-list">
          <span className="platform-tag">
            <i className="fas fa-tv"></i> Streaming HD
          </span>
          <span className="platform-tag">
            <i className="fas fa-mobile-alt"></i> Móvil
          </span>
          <span className="platform-tag">
            <i className="fas fa-tablet-alt"></i> Tablet
          </span>
        </div>
      </div>
    </div>
  );
}

export default MovieInfo;