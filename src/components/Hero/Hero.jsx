import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/hero.css';

function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const intervalRef = useRef(null);
  
  // Duración en milisegundos
  const slideDuration = 8000;
  
  // Datos actualizados con enlaces confiables
  const featuredMovies = [
    {
      id: 1,
      title: "Dune: Parte Dos",
      tagline: "Más allá del miedo, el destino aguarda",
      description: "Paul Atreides se une a los Fremen y comienza un viaje espiritual y político para convertirse en Muad'Dib mientras intenta prevenir el terrible futuro que solo él puede predecir.",
      backdrop: "https://images.unsplash.com/photo-1547371637-97302730bc0d?q=80&w=1920&auto=format&fit=crop",
      genre: ["Ciencia Ficción", "Aventura"],
      duration: "166 min",
      releaseYear: "2024",
      rating: "9.4",
      type: "movie",
      trailerUrl: "/movie/1"
    },
    {
      id: 2,
      title: "El Problema de los 3 Cuerpos",
      tagline: "El universo está escuchando",
      description: "Un grupo de científicos se enfrenta a la mayor amenaza de la historia de la humanidad: el contacto con una civilización alienígena al borde del colapso que planea invadir la Tierra.",
      backdrop: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1920&auto=format&fit=crop",
      genre: ["Ciencia Ficción", "Drama"],
      duration: "T1: 8 episodios",
      releaseYear: "2024",
      rating: "8.9",
      type: "series",
      trailerUrl: "/series/2"
    },
    {
      id: 3,
      title: "Oppenheimer",
      tagline: "El mundo cambió para siempre",
      description: "La historia del científico estadounidense J. Robert Oppenheimer y su papel en el desarrollo de la bomba atómica durante la Segunda Guerra Mundial.",
      backdrop: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?q=80&w=1920&auto=format&fit=crop",
      genre: ["Drama", "Biográfico", "Historia"],
      duration: "180 min",
      releaseYear: "2023",
      rating: "9.2",
      type: "movie",
      trailerUrl: "/movie/3"
    }
  ];

  const handleSlideChange = (index) => {
    clearInterval(intervalRef.current);
    setActiveSlide(index);
    setAnimationKey(prev => prev + 1);
    startAutoSlide();
  };

  const handleNextSlide = () => {
    clearInterval(intervalRef.current);
    setActiveSlide((prev) => (prev + 1) % featuredMovies.length);
    setAnimationKey(prev => prev + 1);
    startAutoSlide();
  };

  const handlePrevSlide = () => {
    clearInterval(intervalRef.current);
    setActiveSlide((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
    setAnimationKey(prev => prev + 1);
    startAutoSlide();
  };

  // Función para iniciar el auto-slide
  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredMovies.length);
      setAnimationKey(prev => prev + 1);
    }, slideDuration);
  };

  // Auto-slide con useEffect mejorado
  useEffect(() => {
    startAutoSlide();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const currentMovie = featuredMovies[activeSlide];

  return (
    <section className="hero">
      {/* Slides de fondo con efecto parallax */}
      <div className="hero-slides">
        {featuredMovies.map((movie, index) => (
          <div 
            key={movie.id} 
            className={`hero-slide ${index === activeSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${movie.backdrop})` }}
          >
            <div className="parallax-bg" style={{ backgroundImage: `url(${movie.backdrop})` }}></div>
          </div>
        ))}
      </div>

      {/* Overlay con gradiente */}
      <div className="hero-overlay"></div>

      <div className="hero-content-container">
        <div className="hero-content">
          {/* Título visible en lugar del logo */}
          <h1 className="hero-title">{currentMovie.title}</h1>
          
          <div className="hero-tagline">{currentMovie.tagline}</div>
          
          <div className="hero-meta">
            <span className="hero-rating">
              <i className="fas fa-star"></i> {currentMovie.rating}
            </span>
            <span className="hero-year">{currentMovie.releaseYear}</span>
            <span className="hero-duration">{currentMovie.duration}</span>
            <span className={`content-type ${currentMovie.type === 'movie' ? 'movie' : 'series'}`}>
              {currentMovie.type === 'movie' ? 'Película' : 'Serie'}
            </span>
          </div>
          
          <div className="hero-genres">
            {currentMovie.genre.map((genre, idx) => (
              <span key={idx} className="genre-tag">{genre}</span>
            ))}
          </div>
          
          <p className="hero-description">{currentMovie.description}</p>
          
          <div className="hero-buttons">
            <Link to={currentMovie.trailerUrl} className="btn-watch">
              <i className="fas fa-play"></i> Reproducir
            </Link>
            <Link to={currentMovie.trailerUrl} className="btn-info">
              <i className="fas fa-info-circle"></i> Más información
            </Link>
          </div>
        </div>
      </div>

      {/* Controles de navegación */}
      <div className="hero-controls">
        <button className="hero-arrow prev" onClick={handlePrevSlide} aria-label="Anterior">
          <i className="fas fa-chevron-left"></i>
        </button>
        
        <div className="hero-dots">
          {featuredMovies.map((_, index) => (
            <button 
              key={index} 
              className={`hero-dot ${index === activeSlide ? 'active' : ''}`}
              onClick={() => handleSlideChange(index)}
              aria-label={`Ver slide ${index + 1}`}
            >
              {index === activeSlide && (
                <span className="progress-ring" key={animationKey}>
                  <svg viewBox="0 0 36 36">
                    <circle
                      cx="18" cy="18" r="16"
                      className="progress-ring-circle"
                      strokeDasharray="100"
                      strokeDashoffset="100"
                    />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
        
        <button className="hero-arrow next" onClick={handleNextSlide} aria-label="Siguiente">
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </section>
  );
}

export default Hero;