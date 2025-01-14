// src/components/Hero/HeroSlider.jsx
import React, { useState, useEffect } from 'react';

function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Películas populares con imágenes de alta calidad (enlaces actualizados)
  const slides = [
    { 
      id: 1, 
      backdrop: 'https://wallpapercave.com/wp/wp2162772.jpg'
    },
    { 
      id: 2, 
      backdrop: 'https://wallpapercave.com/wp/wp2555030.jpg'
    },
    { 
      id: 3, 
      backdrop: 'https://wallpapercave.com/wp/wp1917154.jpg'
    }
  ];

  useEffect(() => {
    // Precargar imágenes para evitar parpadeos
    const preloadImages = () => {
      const imagePromises = slides.map(slide => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = slide.backdrop;
          img.onload = resolve;
        });
      });
      
      Promise.all(imagePromises).then(() => {
        setIsLoading(false);
      });
    };
    
    preloadImages();
    
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (isLoading) {
    return <div className="loading-slider">Cargando...</div>;
  }

  return (
    <div className="slider-container">
      <div
        className="slider"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {slides.map(slide => (
          <div
            key={slide.id}
            className="slide"
            style={{
              backgroundImage: `url(${slide.backdrop})`,
            }}
          />
        ))}
      </div>
      
      <div className="slider-controls">
        {slides.map((_, index) => (
          <button 
            key={index} 
            className={`slider-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ver slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroSlider;