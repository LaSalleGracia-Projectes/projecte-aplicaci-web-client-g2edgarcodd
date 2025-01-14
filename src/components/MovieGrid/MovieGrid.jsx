// src/components/MovieGrid/MovieGrid.jsx
import React from 'react';
import MovieCard from './MovieCard';
import '../../styles/components/moviecard.css';
import moviesData from '../../data/movieData'; 

function MovieGrid() {
  return (
    <div className="movie-cards">
      {moviesData.map((movie) => (
        <MovieCard 
          key={movie.id}
          title={movie.title}
          description={movie.description}
          image={movie.image}
        />
      ))}
    </div>
  );
}

export default MovieGrid;