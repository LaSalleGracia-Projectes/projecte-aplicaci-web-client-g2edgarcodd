import React, { useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import Hero from '../components/Hero/Hero';
import NewReleases from '../components/Home/NewReleases';
import ContinueWatching from '../components/Home/ContinueWatching';
import Top10Container from '../components/Top10/Top10Container';
import FeaturedCategories from '../components/Home/FeaturedCategories';
import TrendingNow from '../components/Home/TrendingNow';
import AwardsShowcase from '../components/Home/AwardsShowcase';
import Subscription from '../components/Subscription/Subscription';
import '../styles/components/homepage.css';

function HomePage() {
  // Hook para manejar animaciones al hacer scroll
  useEffect(() => {
    const handleScrollAnimations = () => {
      const sections = document.querySelectorAll('.animated-section');
      
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.85) {
          section.classList.add('visible');
        }
      });
    };
    
    window.addEventListener('scroll', handleScrollAnimations);
    // Trigger once on load
    handleScrollAnimations();
    
    return () => window.removeEventListener('scroll', handleScrollAnimations);
  }, []);
  
  return (
    
      <div className="homepage-container">
        {/* Hero Banner con Slider - NO incluye header */}
        <Hero />
        
        <div className="content-wrapper">
          {/* Sección "Continuar Viendo" */}
          <section className="animated-section">
            <ContinueWatching />
          </section>
          
          {/* Sección "Nuevos Lanzamientos" */}
          <section className="animated-section">
            <NewReleases />
          </section>
          
          {/* Sección "Top 10 Películas" */}
          <section className="animated-section">
            <Top10Container />
          </section>
          
          {/* Nueva sección "En Tendencia" */}
          <section className="animated-section">
            <TrendingNow />
          </section>
          
          {/* Nueva sección "Premiados y Aclamados" */}
          <section className="animated-section">
            <AwardsShowcase />
          </section>
          
          {/* Sección de Categorías Destacadas */}
          <section className="animated-section">
            <FeaturedCategories />
          </section>
          
          {/* Banner de Suscripción */}
          <section className="animated-section">
            <Subscription />
          </section>
        </div>
      </div>
    
  );
}

export default HomePage;