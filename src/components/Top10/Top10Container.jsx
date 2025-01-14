import React, { useState } from 'react';
import Top10Item from './Top10Item';
import '../../styles/components/top10.css';

// Datos de ejemplo con películas reales
const topMoviesData = [
  { 
    id: 1, 
    ranking: 1, 
    poster: 'https://upload.wikimedia.org/wikipedia/en/8/81/ShawshankRedemptionMoviePoster.jpg', 
    rating: 4.8 
  },
  { 
    id: 2, 
    ranking: 2, 
    poster: 'https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg', 
    rating: 4.7 
  },
  { 
    id: 3, 
    ranking: 3, 
    poster: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg', 
    rating: 4.6 
  },
  { 
    id: 4, 
    ranking: 4, 
    poster: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg', 
    rating: 4.5 
  },
  { 
    id: 5, 
    ranking: 5, 
    poster: 'https://upload.wikimedia.org/wikipedia/en/3/38/Schindler%27s_List_movie.jpg', 
    rating: 4.5 
  },
  { 
    id: 6, 
    ranking: 6, 
    poster: 'https://upload.wikimedia.org/wikipedia/en/f/fc/Fight_Club_poster.jpg', 
    rating: 4.4 
  },
  { 
    id: 7, 
    ranking: 7, 
    poster: 'https://upload.wikimedia.org/wikipedia/en/6/67/Forrest_Gump_poster.jpg', 
    rating: 4.4 
  },
  { 
    id: 8, 
    ranking: 8, 
    poster: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Social_network_film_poster.jpg', 
    rating: 4.3 
  },
  { 
    id: 9, 
    ranking: 9, 
    poster: 'https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg', 
    rating: 4.3 
  },
  { 
    id: 10, 
    ranking: 10, 
    poster: 'https://upload.wikimedia.org/wikipedia/en/7/7b/Goodfellas.jpg', 
    rating: 4.2 
  }
];

function Top10Container() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemWidth = 200; // Ancho aproximado de cada elemento
  const visibleItems = 5; // Número de elementos visibles a la vez
  const maxIndex = topMoviesData.length - visibleItems;

  const handlePrev = () => {
    setCurrentIndex(Math.max(currentIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex(Math.min(currentIndex + 1, maxIndex));
  };

  return (
    <div className="top10-container">
      <div className="slider-arrow arrow-left" id="arrowLeft" onClick={handlePrev}>
        <i className="fas fa-chevron-left"></i>
      </div>

      <div 
        className="top10-slider" 
        id="top10Slider"
        style={{ transform: `translateX(-${currentIndex * itemWidth}px)` }}
      >
        {topMoviesData.map((movie) => (
          <Top10Item 
            key={movie.id}
            ranking={movie.ranking}
            poster={movie.poster}
            rating={movie.rating}
          />
        ))}
      </div>

      <div className="slider-arrow arrow-right" id="arrowRight" onClick={handleNext}>
        <i className="fas fa-chevron-right"></i>
      </div>
    </div>
  );
}

export default Top10Container;