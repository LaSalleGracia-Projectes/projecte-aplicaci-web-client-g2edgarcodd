import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/trendingnow.css';

function TrendingNow() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const sliderRef = useRef(null);
  const maxScroll = useRef(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Datos simulados para trending
  const trendingContent = [
    {
      id: 1,
      title: "Arrakis Chronicles",
      image: "https://images.unsplash.com/photo-1627873649417-c67f701f1949?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      genres: ["Sci-Fi", "Drama"],
      year: "2024",
      trending: "+128%",
      type: "movie"
    },
    {
      id: 2,
      title: "Temporal Paradox",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      genres: ["Thriller", "Mystery"],
      year: "2024",
      trending: "+92%",
      type: "movie"
    },
    {
      id: 3,
      title: "Midnight Chronicles",
      image: "https://images.unsplash.com/photo-1604975701397-6365ccbd028a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      genres: ["Fantasy", "Adventure"],
      year: "2023",
      trending: "+87%",
      type: "series"
    },
    {
      id: 4,
      title: "City of Dreams",
      image: "https://images.unsplash.com/photo-1515634928627-2a4e0dae3ddf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      genres: ["Drama", "Crime"],
      year: "2024",
      trending: "+81%",
      type: "series"
    },
    {
      id: 5,
      title: "Beyond the Horizon",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      genres: ["Documentary", "Nature"],
      year: "2023",
      trending: "+76%",
      type: "movie"
    },
    {
      id: 6,
      title: "Quantum Protocol",
      image: "https://images.unsplash.com/photo-1538370965046-79c0d6907d47?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      genres: ["Sci-Fi", "Action"],
      year: "2024",
      trending: "+70%",
      type: "movie"
    }
  ];

  // Actualizar maxScroll cuando cambie el tamaño
  useEffect(() => {
    const updateMaxScroll = () => {
      if (sliderRef.current) {
        maxScroll.current = sliderRef.current.scrollWidth - sliderRef.current.clientWidth;
        updateArrowVisibility(sliderRef.current.scrollLeft);
      }
    };

    updateMaxScroll();
    window.addEventListener('resize', updateMaxScroll);
    
    sliderRef.current?.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', updateMaxScroll);
      sliderRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const updateArrowVisibility = (position) => {
    setShowLeftArrow(position > 0);
    setShowRightArrow(position < maxScroll.current - 10);
  };

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      
      sliderRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      setScrollPosition(sliderRef.current.scrollLeft);
      updateArrowVisibility(sliderRef.current.scrollLeft);
    }
  };

  return (
    <section className="trending-section">
      <div className="section-header">
        <h2>En tendencia ahora</h2>
        <p className="section-description">Lo más visto en la plataforma esta semana</p>
      </div>

      <div className="trending-container">
        {showLeftArrow && (
          <button 
            className="trending-arrow arrow-left" 
            onClick={() => scroll('left')}
            aria-label="Desplazar a la izquierda"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
        )}
        
        <div 
          className="trending-slider" 
          ref={sliderRef}
        >
          {trendingContent.map((item) => (
            <Link to={`/${item.type}/${item.id}`} className="trending-item" key={item.id}>
              <div className="trending-image-container">
                <img src={item.image} alt={item.title} />
                <span className="trending-badge">
                  <i className="fas fa-chart-line"></i> {item.trending}
                </span>
                <div className="trending-overlay">
                  <button className="play-button">
                    <i className="fas fa-play"></i>
                  </button>
                </div>
              </div>
              <div className="trending-info">
                <h3>{item.title}</h3>
                <div className="trending-meta">
                  <span className="trending-year">{item.year}</span>
                  <span className="trending-dot">•</span>
                  <span className="trending-genres">{item.genres.join(', ')}</span>
                  <span className={item.type === 'movie' ? 'movie-badge' : 'series-badge'}>
                    {item.type === 'movie' ? 'Película' : 'Serie'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {showRightArrow && (
          <button 
            className="trending-arrow arrow-right" 
            onClick={() => scroll('right')}
            aria-label="Desplazar a la derecha"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        )}
      </div>
    </section>
  );
}

export default TrendingNow;