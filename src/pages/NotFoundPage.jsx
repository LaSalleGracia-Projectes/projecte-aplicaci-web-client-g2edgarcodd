import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import MainLayout from "../layouts/MainLayout";
import "../styles/components/notFound.css";

const NotFoundPage = () => {
  const [counter, setCounter] = useState(10);
  const [showParticles, setShowParticles] = useState(false);
  const { t } = useLanguage();

  // Efecto para crear partículas decorativas con retraso
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowParticles(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Cuenta regresiva para redirección automática
  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (counter === 0) {
      window.location.href = "/";
    }
  }, [counter]);

  // Generar estrellas/partículas aleatorias
  const renderParticles = () => {
    const particles = [];

    if (showParticles) {
      for (let i = 0; i < 40; i++) {
        const style = {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${Math.random() * 3 + 2}s`,
        };
        particles.push(
          <div key={i} className="error-particle" style={style}></div>
        );
      }
    }

    return particles;
  };

  return (
    <MainLayout>
      <div className="not-found-container">
        {renderParticles()}

        <div className="error-universe">
          <div className="error-planet"></div>
          <div className="error-orbit">
            <div className="error-satellite"></div>
          </div>
        </div>

        <div className="not-found-content">
          <div className="glitch-container">
            <h1 className="not-found-title glitch" data-text="404">
              404
            </h1>
          </div>

          <h2 className="not-found-subtitle">
            {t("errors.pageNotFoundTitle")}
          </h2>

          <p className="not-found-text">
            {t("errors.pageNotFoundDescription")}
            <br />
            {t("errors.redirectCountdown", { seconds: counter })}
          </p>

          <div className="not-found-actions">
            <Link to="/" className="btn-primary back-home pulse-button">
              <i className="fas fa-rocket"></i> {t("errors.goHome")}
            </Link>

            <Link to="/explore" className="btn-secondary explore-button">
              <i className="fas fa-search"></i> {t("explore.title")}
            </Link>
          </div>

          <div className="error-suggestions">
            <h3>{t("errors.lookingForThese")}</h3>
            <div className="suggestion-links">
              <Link to="/movie/popular">
                <i className="fas fa-film"></i> {t("explore.popularMovies")}
              </Link>
              <Link to="/series/featured">
                <i className="fas fa-tv"></i> {t("explore.featuredSeries")}
              </Link>
              <Link to="/blog">
                <i className="fas fa-blog"></i> {t("blog.recentPosts")}
              </Link>
              <Link to="/forum">
                <i className="fas fa-comments"></i> {t("forum.topics")}
              </Link>
            </div>
          </div>
        </div>

        <div className="space-footer">
          <div className="error-code">
            <span>{t("errors.errorCode")}: </span>
            <span className="typewriter">PAGE_NOT_FOUND_EXCEPTION</span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFoundPage;
