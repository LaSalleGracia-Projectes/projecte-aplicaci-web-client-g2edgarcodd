import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../components/MovieDetail/VideoPlayer';
import MovieInfo from '../components/MovieDetail/MovieInfo';
import Cast from '../components/MovieDetail/Cast';
import Reviews from '../components/MovieDetail/Reviews';
import RelatedContent from '../components/MovieDetail/RelatedContent';
import '../styles/components/moviedetail.css';
import { getMovieById } from '../utils/api';
import castData from '../data/castData';

function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    async function fetchMovieData() {
      try {
        // En un caso real, esto sería una llamada API
        // Aquí simulamos obteniendo datos desde nuestros datos locales
        const data = await getMovieById(id);
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMovieData();
  }, [id]);

  if (loading) {
    return (
      <div className="movie-detail-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!movie) {
    return <div className="movie-not-found">Película o serie no encontrada</div>;
  }

  return (
    <div className="movie-detail-page">
      <div className="movie-hero">
        <VideoPlayer videoUrl={movie.trailerUrl} posterImage={movie.backdropPath} />
      </div>
      
      <div className="movie-detail-container">
        <div className="movie-detail-header">
          <h1>{movie.title}</h1>
          <div className="movie-meta">
            <span className="movie-year">{movie.year}</span>
            <span className="movie-rating">{movie.rating}</span>
            <span className="movie-duration">{movie.runtime}</span>
          </div>
        </div>

        <div className="movie-tabs">
          <button 
            className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            Información
          </button>
          <button 
            className={`tab-button ${activeTab === 'cast' ? 'active' : ''}`}
            onClick={() => setActiveTab('cast')}
          >
            Reparto
          </button>
          <button 
            className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reseñas
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'info' && <MovieInfo movie={movie} />}
          {activeTab === 'cast' && <Cast movieId={id} castData={castData} />}
          {activeTab === 'reviews' && <Reviews movieId={id} />}
        </div>
      </div>

      <RelatedContent genreIds={movie.genres} currentMovieId={id} />
    </div>
  );
}

export default MovieDetailPage;