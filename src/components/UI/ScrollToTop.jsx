import React, { useState, useEffect } from 'react';
import '../../styles/components/scrollToTop.css';

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Función optimizada para detectar scroll
  const toggleVisibility = () => {
    const scrolled = window.scrollY;
    if (scrolled > 200) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    // Comprobar posición inicial
    toggleVisibility();
    
    // Usar tanto scroll como touchmove para mejor detección
    window.addEventListener('scroll', toggleVisibility);
    window.addEventListener('touchmove', toggleVisibility);
    
    // Forzar una comprobación después de que la página se cargue completamente
    const timer = setTimeout(() => {
      toggleVisibility();
    }, 500);
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      window.removeEventListener('touchmove', toggleVisibility);
      clearTimeout(timer);
    };
  }, []);

  return (
    <button 
      className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Volver arriba"
    >
      <i className="fas fa-chevron-up"></i>
    </button>
  );
}

export default ScrollToTop;