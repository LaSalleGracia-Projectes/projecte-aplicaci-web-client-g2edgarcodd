// src/components/Top10/Top10Item.jsx
import React, { useState } from 'react';

function Top10Item({ ranking, poster, rating }) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Genera estrellas basadas en la calificación
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Estrellas completas
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }
    
    // Media estrella si es necesario
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    
    // Estrellas vacías hasta completar 5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="top10-item">
      <span className="ranking-number">{ranking}</span>
      <div className="card">
        <img src={poster} alt={`Poster ${ranking}`} className="poster" />
        <i 
          className="fas fa-bookmark bookmark-icon" 
          data-active={isBookmarked} 
          onClick={toggleBookmark}
        ></i>
        <div className="rating-stars">
          {renderStars(rating)}
        </div>
      </div>
    </div>
  );
}

export default Top10Item;
