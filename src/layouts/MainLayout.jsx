import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ScrollToTop from '../components/UI/ScrollToTop';

/**
 * Layout principal de la aplicación con animaciones de transición y scroll-to-top
 */
function MainLayout({ children }) {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Animación de transición entre páginas
  useEffect(() => {
    // Inicio de la transición
    setIsLoading(true);
    document.body.style.opacity = '0.8';

    // Scroll al inicio
    window.scrollTo(0, 0);
    
    // Fin de la transición
    const timer = setTimeout(() => {
      document.body.style.opacity = '1';
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="main-layout">
      
      {isLoading && (
        <div className="page-transition-overlay">
          <div className="loader"></div>
        </div>
      )}
      
      <Header />
      
      <main className="main-content">
        {children}
      </main>
      
      <Footer />
      
      <ScrollToTop />
    </div>
  );
}

export default MainLayout;