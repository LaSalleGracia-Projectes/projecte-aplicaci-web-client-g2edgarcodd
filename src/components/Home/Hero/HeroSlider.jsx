// src/components/Hero/HeroSlider.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../../contexts/LanguageContext";
import "../../../styles/components/hero.css";

function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef(null);
  const timeoutRef = useRef(null);
  const { t } = useLanguage();

  // Datos con URLs de imágenes locales
  const slides = [
    {
      id: 1,
      title: "Dune: Parte Dos",
      description:
        "Paul Atreides se une a los Fremen para reclamar su venganza contra los conspiradores que destruyeron a su familia.",
      backdrop: "/src/assets/heroes/dune.jpg",
      fallbackColor: "#261c17",
      rating: "9.4",
      year: "2024",
      genres: ["Ciencia Ficción", "Aventura"],
      link: "/movie/1",
    },
    {
      id: 2,
      title: "El Problema de los 3 Cuerpos",
      description:
        "Un grupo de científicos enfrenta la mayor amenaza de la humanidad: el contacto con una civilización alienígena.",
      backdrop: "/src/assets/heroes/3body.jpg",
      fallbackColor: "#0a1a2a",
      rating: "8.9",
      year: "2024",
      genres: ["Ciencia Ficción", "Drama"],
      link: "/series/2",
    },
    {
      id: 3,
      title: "Oppenheimer",
      description:
        "La historia del científico J. Robert Oppenheimer y su papel en el desarrollo de la bomba atómica.",
      backdrop: "/src/assets/heroes/oppenheimer.jpg",
      fallbackColor: "#1a1a1a",
      rating: "9.2",
      year: "2023",
      genres: ["Drama", "Biográfico"],
      link: "/movie/3",
    },
  ];

  // Función mejorada para manejar la transición automática
  const startAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 7000);
  };

  useEffect(() => {
    // Timeout para evitar carga infinita
    timeoutRef.current = setTimeout(() => {
      console.log(
        "⏱️ Timeout en carga de imágenes del slider - forzando renderizado"
      );
      setIsLoading(false);
      startAutoPlay();
    }, 5000); // 5 segundos de timeout

    // Precargar imágenes para evitar parpadeos
    const preloadImages = () => {
      const imagePromises = slides.map((slide) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = () => {
            console.warn(`⚠️ Error cargando imagen: ${slide.backdrop}`);
            resolve(); // Resolvemos incluso con error
          };
          img.src = slide.backdrop;
        });
      });

      Promise.all(imagePromises)
        .then(() => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          setIsLoading(false);
          startAutoPlay();
        })
        .catch((err) => {
          console.error("Error en carga de imágenes:", err);
          setIsLoading(false);
          startAutoPlay();
        });
    };

    preloadImages();

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Pausar/Reanudar autoplay al pasar el mouse
  useEffect(() => {
    if (isHovered && autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    } else if (!isHovered && !isLoading) {
      startAutoPlay();
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isHovered, isLoading]);

  const goToSlide = (index) => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    setCurrentIndex(index);
    if (!isHovered) {
      startAutoPlay();
    }
  };

  const handleNextSlide = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    if (!isHovered) {
      startAutoPlay();
    }
  };

  const handlePrevSlide = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
    if (!isHovered) {
      startAutoPlay();
    }
  };

  if (isLoading) {
    return (
      <div className="loading-slider">
        <div className="spinner"></div>
        <p>{t("common.loading") || "Cargando..."}</p>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <section
      className="hero-slider"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="hero-slides">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${index === currentIndex ? "active" : ""}`}
          >
            <div
              className="parallax-bg"
              style={{
                backgroundImage: `url(${slide.backdrop})`,
                backgroundColor: slide.fallbackColor || "#121212", // Color de fallback
              }}
            ></div>
          </div>
        ))}
      </div>

      {/* Overlay con gradiente */}
      <div className="hero-overlay"></div>

      <div className="hero-content-container">
        <div className="hero-content">
          <h1 className="hero-title">{currentSlide.title}</h1>

          <div className="hero-meta">
            <span className="hero-rating">
              <i className="fas fa-star"></i> {currentSlide.rating}
            </span>
            <span className="hero-year">{currentSlide.year}</span>

            <div className="hero-genres">
              {currentSlide.genres.map((genre, idx) => (
                <span key={idx} className="genre-tag">
                  {genre}
                </span>
              ))}
            </div>
          </div>

          <p className="hero-description">{currentSlide.description}</p>

          <div className="hero-buttons">
            <Link to={currentSlide.link} className="btn-watch">
              <i className="fas fa-play"></i>{" "}
              {t("movieDetail.watchNow") || "Ver ahora"}
            </Link>
            <Link to={currentSlide.link} className="btn-info">
              <i className="fas fa-info-circle"></i>{" "}
              {t("common.seeMore") || "Más información"}
            </Link>
          </div>
        </div>
      </div>

      {/* Controles de navegación */}
      <div className="hero-controls">
        <button
          className="hero-arrow prev"
          onClick={handlePrevSlide}
          aria-label={t("common.previous") || "Anterior"}
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        <div className="hero-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`${t("common.view") || "Ver"} ${index + 1}`}
            ></button>
          ))}
        </div>

        <button
          className="hero-arrow next"
          onClick={handleNextSlide}
          aria-label={t("common.next") || "Siguiente"}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </section>
  );
}

export default HeroSlider;
