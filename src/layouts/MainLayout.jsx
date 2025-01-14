import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

/**
 * Layout principal de la aplicación
 * Este componente envuelve las diferentes páginas de la aplicación
 * proporcionando la estructura común (header y footer)
 */
function MainLayout({ children }) {
  const location = useLocation();

  // Scroll al inicio cuando cambia la ruta
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.opacity = '1';
  }, [location.pathname]);

  return (
    <div className="main-layout">
      {/* El header solo debe aparecer una vez en toda la aplicación */}
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;