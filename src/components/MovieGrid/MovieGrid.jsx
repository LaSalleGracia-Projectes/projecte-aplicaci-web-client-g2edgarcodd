// src/components/MovieGrid/MovieGrid.jsx
import React from "react";
import MovieCard from "./MovieCard";
import "../../styles/components/moviecard.css";
import moviesData from "../../data/movieData";

function MovieGrid() {
  return (
    <div className="movie-cards">
      {moviesData.map((movie) => (
        <MovieCard
          key={movie.id}
          id={movie.id}
          title={movie.title}
          description={movie.description}
          image={movie.posterPath || movie.image}
          contentType={movie.type === "movie" ? "film" : "series"}
          rating={parseFloat(movie.rating)}
          year={movie.year}
          popularity={0.8} // Valor por defecto para movies sin popularidad definida
        />
      ))}
    </div>
  );
}

export default MovieGrid;
