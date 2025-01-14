// src/components/MovieGrid/MovieCard.jsx
import React, { useState, useRef } from 'react';

function MovieCard({ title, description, image }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const favoriteIconRef = useRef(null);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    
    // Agregar y quitar la clase de animación
    if (favoriteIconRef.current) {
      favoriteIconRef.current.classList.add('beat');
      favoriteIconRef.current.addEventListener(
        'animationend',
        () => {
          if (favoriteIconRef.current) {
            favoriteIconRef.current.classList.remove('beat');
          }
        },
        { once: true }
      );
    }
  };

  return (
    <div className="movie-card">
      <img 
        src={image} 
        alt={title} 
        className={`movie-image ${imageLoaded ? 'loaded' : ''}`} 
        onLoad={handleImageLoad}
      />
      <div className="movie-info">
        <h3 className="movie-title">{title}</h3>
        <p className="movie-description">{description}</p>
        <span 
          ref={favoriteIconRef}
          className={`favorite-icon ${isFavorite ? 'active' : ''}`} 
          onClick={toggleFavorite}
        >
          <i className="fas fa-heart"></i>
        </span>
      </div>
    </div>
  );
}

export default MovieCard;