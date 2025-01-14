import React from 'react';

function Cast({ movieId, castData }) {
  // Filtrar el reparto por el ID de la película
  const movieCast = castData.filter(actor => actor.movieId === movieId);
  
  return (
    <div className="movie-cast">
      {movieCast.length > 0 ? (
        <div className="cast-grid">
          {movieCast.map(actor => (
            <div key={actor.id} className="cast-member">
              <div className="cast-photo-container">
                <img 
                  src={actor.photo} 
                  alt={actor.name} 
                  className="cast-photo" 
                />
              </div>
              <h4 className="actor-name">{actor.name}</h4>
              <p className="character-name">{actor.character}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-cast-info">
          <p>No hay información de reparto disponible para esta película.</p>
        </div>
      )}
    </div>
  );
}

export default Cast;