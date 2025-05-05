import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../../contexts/LanguageContext";
import "../../../styles/components/hero.css";
import HeroParticles from "./HeroParticles";
import { AnimatePresence, motion } from "framer-motion";
import {
  getMovieDetails,
  getTVShowDetails,
  getImageUrl,
} from "../../../utils/api";

// Importación de imágenes de respaldo
import duneImage from "../../../assets/heroes/dune2.webp";
import duneFallbackImage from "../../../assets/heroes/dune.jpg";
import threeBodyImage from "../../../assets/heroes/three-bodies.webp";
import oppenheimerImage from "../../../assets/heroes/oppenheimer.webp";

function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(true);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState({});
  const [heroContent, setHeroContent] = useState([]);

  const heroRef = useRef(null);
  const intervalRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const videoRefs = useRef({});

  const { t, language } = useLanguage();

  const slideDuration = 12000;
  const progressUpdateInterval = 100;
  const loadingTimeout = 5000;

  // Los ID fijos de TMDB para las películas en el orden deseado
  const contentIDs = [
    { id: 693134, type: "movie" }, // Dune: Part II
    { id: 108545, type: "tv" }, // The Three-Body Problem
    { id: 872585, type: "movie" }, // Oppenheimer
  ];

  // Datos de traducción para títulos y taglines
  const translationKeys = {
    // Dune 2
    693134: {
      titleKey: "hero.dune.title",
      titleDefault: "Dune: Parte Dos",
      taglineKey: "hero.dune.tagline",
      taglineDefault: "Más allá del miedo, el destino aguarda",
      descriptionKey: "hero.dune.description",
      descriptionDefault:
        "Paul Atreides se une a los Fremen y comienza un viaje espiritual y político para convertirse en Muad'Dib mientras intenta prevenir el terrible futuro que solo él puede predecir.",
    },
    // El Problema de los 3 Cuerpos
    108545: {
      titleKey: "hero.threebody.title",
      titleDefault: "El Problema de los 3 Cuerpos",
      taglineKey: "hero.threebody.tagline",
      taglineDefault: "El universo está escuchando",
      descriptionKey: "hero.threebody.description",
      descriptionDefault:
        "Un grupo de científicos se enfrenta a la mayor amenaza de la historia de la humanidad: el contacto con una civilización alienígena al borde del colapso que planea invadir la Tierra.",
    },
    // Oppenheimer
    872585: {
      titleKey: "hero.oppenheimer.title",
      titleDefault: "Oppenheimer",
      taglineKey: "hero.oppenheimer.tagline",
      taglineDefault: "El mundo cambió para siempre",
      descriptionKey: "hero.oppenheimer.description",
      descriptionDefault:
        "La historia del científico estadounidense J. Robert Oppenheimer y su papel en el desarrollo de la bomba atómica durante la Segunda Guerra Mundial.",
    },
  };

  // Función para cargar los datos desde la API de TMDB
  const fetchContentDetails = async () => {
    try {
      setIsLoading(true);
      console.log("Cargando datos de TMDB para el Hero...");

      const contentPromises = contentIDs.map(async (item) => {
        try {
          let contentData;
          if (item.type === "movie") {
            contentData = await getMovieDetails(item.id);
          } else {
            contentData = await getTVShowDetails(item.id);
          }

          // Encontrar videos para obtener el trailer
          let trailerKey = "";
          if (contentData.videos && contentData.videos.results) {
            const trailer = contentData.videos.results.find(
              (video) => video.type === "Trailer" && video.site === "YouTube"
            );
            if (trailer) {
              trailerKey = trailer.key;
            }
          }

          // Obtener el director o creadores
          let director = "";
          if (
            item.type === "movie" &&
            contentData.credits &&
            contentData.credits.crew
          ) {
            const directorData = contentData.credits.crew.find(
              (person) => person.job === "Director"
            );
            director = directorData ? directorData.name : "";
          } else if (
            item.type === "tv" &&
            contentData.created_by &&
            contentData.created_by.length > 0
          ) {
            director = contentData.created_by
              .map((creator) => creator.name)
              .join(", ");
          }

          // Obtener actores principales
          const starring =
            contentData.credits && contentData.credits.cast
              ? contentData.credits.cast.slice(0, 3).map((actor) => actor.name)
              : [];

          // Obtener las claves de traducción para este contenido
          const translationData = translationKeys[item.id] || {};

          // Construir objeto de datos
          return {
            id: contentData.id,
            titleKey: translationData.titleKey || "",
            title: item.type === "movie" ? contentData.title : contentData.name,
            taglineKey: translationData.taglineKey || "",
            tagline: contentData.tagline || "",
            descriptionKey: translationData.descriptionKey || "",
            description: contentData.overview || "",
            backdrop: contentData.backdrop_path
              ? getImageUrl(contentData.backdrop_path, "original", "backdrop")
              : item.id === 693134
              ? duneImage
              : item.id === 108545
              ? threeBodyImage
              : oppenheimerImage,
            fallbackBackdrop:
              item.id === 693134
                ? duneFallbackImage
                : item.id === 108545
                ? threeBodyImage
                : oppenheimerImage,
            trailer: trailerKey
              ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${trailerKey}&enablejsapi=1&origin=http://localhost:5173`
              : "",
            fallbackColor:
              item.id === 693134
                ? "#261c17"
                : item.id === 108545
                ? "#0a1a2a"
                : "#1a1a1a",
            genreKeys: contentData.genres
              ? contentData.genres.map((g) =>
                  g.name.toLowerCase().replace(/\s/g, "")
                )
              : [],
            genre: contentData.genres
              ? contentData.genres.map((g) => g.name)
              : [],
            duration:
              item.type === "movie"
                ? `${contentData.runtime} min`
                : `T1: ${contentData.number_of_episodes || "?"} episodios`,
            releaseYear:
              item.type === "movie"
                ? new Date(contentData.release_date).getFullYear()
                : new Date(contentData.first_air_date).getFullYear(),
            rating: contentData.vote_average.toFixed(1),
            type: item.type,
            trailerUrl: `/${item.type}/${contentData.id}`,
            director,
            starring,
            awards:
              item.id === 693134
                ? [
                    "6 Premios Oscar",
                    "Mejor Fotografía",
                    "Mejor Efectos Visuales",
                  ]
                : item.id === 108545
                ? [
                    "4 Nominaciones Emmy",
                    "Mejor Serie Dramática",
                    "Efectos Especiales",
                  ]
                : ["7 Premios Oscar", "Mejor Actor", "Mejor Director"],
            awardKeys:
              item.id === 693134
                ? [
                    "hero.dune.awards.main",
                    "hero.dune.awards.photography",
                    "hero.dune.awards.visualEffects",
                  ]
                : item.id === 108545
                ? [
                    "hero.threebody.awards.main",
                    "hero.threebody.awards.drama",
                    "hero.threebody.awards.effects",
                  ]
                : [
                    "hero.oppenheimer.awards.main",
                    "hero.oppenheimer.awards.actor",
                    "hero.oppenheimer.awards.director",
                  ],
          };
        } catch (error) {
          console.error(
            `Error al cargar datos para el contenido ID ${item.id}:`,
            error
          );

          // Usar datos de respaldo en caso de error
          const translationData = translationKeys[item.id] || {};

          // Datos de respaldo con las claves de traducción correctas
          const fallbackData = {
            id: item.id,
            titleKey: translationData.titleKey || "",
            title: translationData.titleDefault || `Película ID ${item.id}`,
            taglineKey: translationData.taglineKey || "",
            tagline: translationData.taglineDefault || "",
            descriptionKey: translationData.descriptionKey || "",
            description: translationData.descriptionDefault || "",
            backdrop:
              item.id === 693134
                ? duneImage
                : item.id === 108545
                ? threeBodyImage
                : oppenheimerImage,
            fallbackBackdrop:
              item.id === 693134
                ? duneFallbackImage
                : item.id === 108545
                ? threeBodyImage
                : oppenheimerImage,
            fallbackColor:
              item.id === 693134
                ? "#261c17"
                : item.id === 108545
                ? "#0a1a2a"
                : "#1a1a1a",
            genre:
              item.id === 693134
                ? ["Ciencia Ficción", "Aventura", "Drama"]
                : item.id === 108545
                ? ["Ciencia Ficción", "Drama", "Thriller"]
                : ["Drama", "Biográfico", "Historia"],
            genreKeys:
              item.id === 693134
                ? ["scifi", "adventure", "drama"]
                : item.id === 108545
                ? ["scifi", "drama", "thriller"]
                : ["drama", "biography", "history"],
            duration:
              item.id === 693134
                ? "166 min"
                : item.id === 108545
                ? "T1: 8 episodios"
                : "180 min",
            releaseYear:
              item.id === 693134
                ? "2024"
                : item.id === 108545
                ? "2024"
                : "2023",
            rating:
              item.id === 693134 ? "9.4" : item.id === 108545 ? "8.9" : "9.2",
            type: item.type,
            trailerUrl: `/${item.type}/${item.id}`,
            director:
              item.id === 693134
                ? "Denis Villeneuve"
                : item.id === 108545
                ? "D. Benioff & D.B. Weiss"
                : "Christopher Nolan",
            starring:
              item.id === 693134
                ? ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"]
                : item.id === 108545
                ? ["Eiza González", "Benedict Wong", "Jovan Adepo"]
                : ["Cillian Murphy", "Emily Blunt", "Robert Downey Jr."],
            awards:
              item.id === 693134
                ? [
                    "6 Premios Oscar",
                    "Mejor Fotografía",
                    "Mejor Efectos Visuales",
                  ]
                : item.id === 108545
                ? [
                    "4 Nominaciones Emmy",
                    "Mejor Serie Dramática",
                    "Efectos Especiales",
                  ]
                : ["7 Premios Oscar", "Mejor Actor", "Mejor Director"],
            awardKeys:
              item.id === 693134
                ? [
                    "hero.dune.awards.main",
                    "hero.dune.awards.photography",
                    "hero.dune.awards.visualEffects",
                  ]
                : item.id === 108545
                ? [
                    "hero.threebody.awards.main",
                    "hero.threebody.awards.drama",
                    "hero.threebody.awards.effects",
                  ]
                : [
                    "hero.oppenheimer.awards.main",
                    "hero.oppenheimer.awards.actor",
                    "hero.oppenheimer.awards.director",
                  ],
          };
          return fallbackData;
        }
      });

      const contentData = await Promise.all(contentPromises);
      setHeroContent(contentData);
      setIsLoading(false);
      startAutoSlide();
      startProgressAnimation();
    } catch (error) {
      console.error("Error al cargar contenido para el Hero:", error);
      setIsLoading(false);

      // Usar contenido de respaldo en caso de error con las claves de traducción correctas
      const backupContent = contentIDs.map((item) => {
        const translationData = translationKeys[item.id] || {};

        return {
          id: item.id,
          titleKey: translationData.titleKey || "",
          title: translationData.titleDefault || `Película ID ${item.id}`,
          taglineKey: translationData.taglineKey || "",
          tagline: translationData.taglineDefault || "",
          descriptionKey: translationData.descriptionKey || "",
          description: translationData.descriptionDefault || "",
          backdrop:
            item.id === 693134
              ? duneImage
              : item.id === 108545
              ? threeBodyImage
              : oppenheimerImage,
          fallbackBackdrop:
            item.id === 693134
              ? duneFallbackImage
              : item.id === 108545
              ? threeBodyImage
              : oppenheimerImage,
          trailer: "",
          fallbackColor:
            item.id === 693134
              ? "#261c17"
              : item.id === 108545
              ? "#0a1a2a"
              : "#1a1a1a",
          genreKeys:
            item.id === 693134
              ? ["scifi", "adventure", "drama"]
              : item.id === 108545
              ? ["scifi", "drama", "thriller"]
              : ["drama", "biography", "history"],
          genre:
            item.id === 693134
              ? ["Ciencia Ficción", "Aventura", "Drama"]
              : item.id === 108545
              ? ["Ciencia Ficción", "Drama", "Thriller"]
              : ["Drama", "Biográfico", "Historia"],
          duration:
            item.id === 693134
              ? "166 min"
              : item.id === 108545
              ? "T1: 8 episodios"
              : "180 min",
          releaseYear:
            item.id === 693134 ? "2024" : item.id === 108545 ? "2024" : "2023",
          rating:
            item.id === 693134 ? "9.4" : item.id === 108545 ? "8.9" : "9.2",
          type: item.type,
          trailerUrl: `/${item.type}/${item.id}`,
          director:
            item.id === 693134
              ? "Denis Villeneuve"
              : item.id === 108545
              ? "D. Benioff & D.B. Weiss"
              : "Christopher Nolan",
          starring:
            item.id === 693134
              ? ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"]
              : item.id === 108545
              ? ["Eiza González", "Benedict Wong", "Jovan Adepo"]
              : ["Cillian Murphy", "Emily Blunt", "Robert Downey Jr."],
          awards:
            item.id === 693134
              ? [
                  "6 Premios Oscar",
                  "Mejor Fotografía",
                  "Mejor Efectos Visuales",
                ]
              : item.id === 108545
              ? [
                  "4 Nominaciones Emmy",
                  "Mejor Serie Dramática",
                  "Efectos Especiales",
                ]
              : ["7 Premios Oscar", "Mejor Actor", "Mejor Director"],
          awardKeys:
            item.id === 693134
              ? [
                  "hero.dune.awards.main",
                  "hero.dune.awards.photography",
                  "hero.dune.awards.visualEffects",
                ]
              : item.id === 108545
              ? [
                  "hero.threebody.awards.main",
                  "hero.threebody.awards.drama",
                  "hero.threebody.awards.effects",
                ]
              : [
                  "hero.oppenheimer.awards.main",
                  "hero.oppenheimer.awards.actor",
                  "hero.oppenheimer.awards.director",
                ],
        };
      });

      setHeroContent(backupContent);
      startAutoSlide();
      startProgressAnimation();
    }
  };

  // Función para obtener contenido localizado
  const getLocalizedContent = () => {
    return heroContent.map((item) => {
      // Traducir título si hay una clave disponible
      const title =
        item.titleKey && t(item.titleKey) ? t(item.titleKey) : item.title;

      // Traducir tagline si hay una clave disponible
      const tagline =
        item.taglineKey && t(item.taglineKey)
          ? t(item.taglineKey)
          : item.tagline;

      // Traducir descripción si hay una clave disponible
      const description =
        item.descriptionKey && t(item.descriptionKey)
          ? t(item.descriptionKey)
          : item.description;

      // Traducir géneros
      const translatedGenres = item.genreKeys.map((genreKey, index) => {
        // Intenta traducir primero con la clave completa, luego con genérica
        const genreTranslation = t(`genres.${genreKey}`);
        return genreTranslation !== `genres.${genreKey}`
          ? genreTranslation
          : item.genre[index];
      });

      // Traducir premios
      const translatedAwards = item.awardKeys
        ? item.awardKeys.map((awardKey, index) => {
            const awardTranslation = t(awardKey);
            return awardTranslation !== awardKey
              ? awardTranslation
              : item.awards[index];
          })
        : item.awards;

      return {
        ...item,
        title,
        tagline,
        description,
        genre: translatedGenres,
        awards: translatedAwards,
      };
    });
  };

  // Memorizar el contenido localizado para evitar recálculos innecesarios
  const localizedContent = useMemo(
    () => getLocalizedContent(),
    [heroContent, t, language]
  );

  // Efectos para iniciar la carga de datos y configurar la interacción
  useEffect(() => {
    const heroRefCurrent = heroRef.current;
    fetchContentDetails();

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isInView = entry.isIntersecting;
        if (!isInView && showTrailer) {
          setShowTrailer(false);
        }
      },
      { threshold: 0.3 }
    );

    if (heroRefCurrent) {
      observer.observe(heroRefCurrent);
    }

    return () => {
      if (heroRefCurrent) {
        observer.unobserve(heroRefCurrent);
      }
      clearAllIntervals();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [showTrailer]);

  // Efecto para precargar imágenes
  useEffect(() => {
    console.log("Iniciando carga de imágenes del hero");

    if (heroContent.length === 0) return;

    timeoutRef.current = setTimeout(() => {
      console.log(
        "🚨 Timeout en carga de imágenes del hero - forzando renderizado"
      );
      setIsLoading(false);
      startAutoSlide();
      startProgressAnimation();
    }, loadingTimeout);

    const preloadImages = () => {
      const imagePromises = heroContent.map((item, index) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            console.log(`✅ Imagen ${index + 1} cargada correctamente`);
            resolve();
          };
          img.onerror = () => {
            console.warn(`❌ Error al cargar la imagen: ${item.backdrop}`);
            setImageLoadErrors((prev) => ({ ...prev, [index]: true }));
            resolve();
          };
          img.src = item.backdrop;
        });
      });

      Promise.all(imagePromises)
        .then(() => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          console.log("✅ Todas las imágenes cargadas correctamente");
          setIsLoading(false);
          startAutoSlide();
          startProgressAnimation();
        })
        .catch((error) => {
          console.error("Error en la carga de imágenes:", error);
          setIsLoading(false);
          startAutoSlide();
          startProgressAnimation();
        });
    };

    preloadImages();

    return () => {
      clearAllIntervals();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [heroContent]);

  const clearAllIntervals = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  const startProgressAnimation = () => {
    setAnimationProgress(0);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    const stepSize = 100 / (slideDuration / progressUpdateInterval);
    progressIntervalRef.current = setInterval(() => {
      if (!isPaused) {
        setAnimationProgress((prev) => {
          if (prev + stepSize >= 100) {
            return 0;
          }
          return prev + stepSize;
        });
      }
    }, progressUpdateInterval);
  };

  const handleSlideChange = (index) => {
    clearAllIntervals();
    setActiveSlide(index);
    setAnimationProgress(0);
    startAutoSlide();
    startProgressAnimation();
  };

  const handleNextSlide = () => {
    clearAllIntervals();
    setActiveSlide((prev) => (prev + 1) % heroContent.length);
    setAnimationProgress(0);
    startAutoSlide();
    startProgressAnimation();
  };

  const handlePrevSlide = () => {
    clearAllIntervals();
    setActiveSlide(
      (prev) => (prev - 1 + heroContent.length) % heroContent.length
    );
    setAnimationProgress(0);
    startAutoSlide();
    startProgressAnimation();
  };

  const startAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isAutoPlayEnabled) {
      intervalRef.current = setInterval(() => {
        if (!isPaused) {
          setActiveSlide((prev) => (prev + 1) % heroContent.length);
          setAnimationProgress(0);
        }
      }, slideDuration);
    }
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const handleTrailerLoad = (index) => {
    console.log(`✅ Trailer ${index} cargado`);
  };

  const handleTrailerToggle = () => {
    console.log("Toggle trailer:", !showTrailer);
    setShowTrailer(!showTrailer);

    if (showTrailer) {
      Object.keys(videoRefs.current).forEach((key) => {
        if (videoRefs.current[key]) {
          try {
            videoRefs.current[key].contentWindow.postMessage(
              '{"event":"command","func":"pauseVideo","args":""}',
              "*"
            );
          } catch (error) {
            console.error(`Error al pausar video ${key}:`, error);
          }
        }
      });
    } else {
      setTimeout(() => {
        if (videoRefs.current[activeSlide]) {
          try {
            videoRefs.current[activeSlide].contentWindow.postMessage(
              '{"event":"command","func":"playVideo","args":""}',
              "*"
            );
            console.log("▶️ Reproduciendo video:", activeSlide);
          } catch (error) {
            console.error(`Error al reproducir video ${activeSlide}:`, error);
          }
        }
      }, 1000);
    }
  };

  const handleSlideClick = () => {
    setIsAutoPlayEnabled(false);
    console.log("Reproducción automática desactivada por clic del usuario");

    clearAllIntervals();
  };

  if (heroContent.length === 0 || isLoading) {
    return (
      <div className="hero-loading">
        <div className="hero-spinner"></div>
        <p className="loading-text">{t("hero.loading") || "Cargando..."}</p>
      </div>
    );
  }

  const currentContent = localizedContent[activeSlide];

  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    }),
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <section
      ref={heroRef}
      className={`hero ${showTrailer ? "trailer-active" : ""} no-overflow`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: "relative", minHeight: "500px" }}
    >
      <HeroParticles activeSlide={activeSlide} />

      <div className="hero-slides" style={{ display: "block" }}>
        {heroContent.map((item, index) => (
          <div
            key={item.id}
            className={`hero-slide ${index === activeSlide ? "active" : ""}`}
            style={{
              opacity: index === activeSlide ? 1 : 0,
              transition: "opacity 0.5s ease-in-out",
            }}
            onClick={handleSlideClick}
          >
            <div
              className={`parallax-bg ${
                showTrailer && index === activeSlide ? "dimmed" : ""
              }`}
              style={{
                backgroundImage: `url(${
                  imageLoadErrors[index] ? item.fallbackBackdrop : item.backdrop
                })`,
                backgroundColor: item.fallbackColor || "#121212",
                backgroundSize: "cover",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
                height: "100%",
                width: "100%",
                position: "absolute",
                zIndex: 1,
              }}
            >
              {/* Imagen directa como respaldo si hay errores en la carga del background */}
              {imageLoadErrors[index] && (
                <img
                  src={
                    imageLoadErrors[index]
                      ? item.fallbackBackdrop
                      : item.backdrop
                  }
                  alt={localizedContent[index].title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center center",
                  }}
                />
              )}
            </div>

            {item.trailer && (
              <div
                className={`trailer-container ${
                  showTrailer && index === activeSlide ? "active" : ""
                }`}
                style={{
                  opacity: showTrailer && index === activeSlide ? 1 : 0,
                  pointerEvents:
                    showTrailer && index === activeSlide ? "auto" : "none",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 2,
                }}
              >
                <iframe
                  key={`trailer-${item.id}`}
                  ref={(ref) => {
                    videoRefs.current[index] = ref;
                  }}
                  className="trailer-frame"
                  src={item.trailer}
                  title={`${localizedContent[index].title} trailer`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  onLoad={() => handleTrailerLoad(index)}
                  style={{ width: "100%", height: "100%" }}
                ></iframe>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={`hero-overlay ${showTrailer ? "transparent" : ""}`}></div>

      <AnimatePresence mode="wait">
        <div className="hero-content-container" key={activeSlide}>
          <div
            className={`hero-content ${showTrailer ? "content-hidden" : ""}`}
          >
            <motion.div
              className="hero-content-inner"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
                exit: { opacity: 0 },
              }}
            >
              {currentContent.awards &&
                currentContent.awards.length > 0 &&
                !showTrailer && (
                  <motion.div
                    className="award-badge"
                    custom={0}
                    variants={contentVariants}
                  >
                    <i className="fas fa-award"></i>
                    <span>{currentContent.awards[0]}</span>
                  </motion.div>
                )}

              <motion.h1
                className="hero-title"
                custom={1}
                variants={contentVariants}
              >
                {currentContent.title}
              </motion.h1>

              {!showTrailer && (
                <>
                  <motion.div
                    className="hero-tagline"
                    custom={2}
                    variants={contentVariants}
                  >
                    {currentContent.tagline}
                  </motion.div>

                  <motion.div
                    className="hero-meta"
                    custom={3}
                    variants={contentVariants}
                  >
                    <span className="hero-rating">
                      <i className="fas fa-star"></i> {currentContent.rating}
                    </span>
                    <span className="hero-year">
                      {currentContent.releaseYear}
                    </span>
                    <span className="hero-duration">
                      {currentContent.duration}
                    </span>
                    <span
                      className={`content-type ${
                        currentContent.type === "movie" ? "movie" : "series"
                      }`}
                    >
                      {currentContent.type === "movie"
                        ? t("common.movie")
                        : t("common.series")}
                    </span>
                  </motion.div>

                  <motion.div
                    className="hero-creators"
                    custom={4}
                    variants={contentVariants}
                  >
                    {currentContent.director && (
                      <div className="hero-director">
                        <span className="director-label">
                          {t("common.director")}:
                        </span>
                        <span className="director-name">
                          {currentContent.director}
                        </span>
                      </div>
                    )}

                    {currentContent.starring &&
                      currentContent.starring.length > 0 && (
                        <div className="hero-starring">
                          <span className="starring-label">
                            {t("common.starring")}:
                          </span>
                          <span className="starring-names">
                            {currentContent.starring.slice(0, 3).join(", ")}
                          </span>
                        </div>
                      )}
                  </motion.div>

                  <motion.div
                    className="hero-genres"
                    custom={5}
                    variants={contentVariants}
                  >
                    {currentContent.genre.map((genre, idx) => (
                      <span key={idx} className="genre-tag">
                        {genre}
                      </span>
                    ))}
                  </motion.div>
                </>
              )}

              <motion.div
                className="hero-buttons"
                custom={6}
                variants={contentVariants}
              >
                <button
                  className={`btn-trailer ${showTrailer ? "active" : ""}`}
                  onClick={handleTrailerToggle}
                  aria-label={
                    showTrailer ? t("hero.hideTrailer") : t("hero.trailer")
                  }
                >
                  <i
                    className={`fas ${showTrailer ? "fa-times" : "fa-film"}`}
                  ></i>
                  {!showTrailer && <span>{t("hero.trailer")}</span>}
                </button>

                {!showTrailer && (
                  <Link
                    to={`/${currentContent.type}/${currentContent.id}`}
                    className="btn-info"
                  >
                    <i className="fas fa-info-circle"></i>
                    {t("hero.more")}
                  </Link>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </AnimatePresence>

      <div className={`hero-controls ${showTrailer ? "hidden" : ""}`}>
        <button
          className="hero-arrow prev"
          onClick={handlePrevSlide}
          aria-label={t("common.previous")}
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        <div className="hero-dots">
          {heroContent.map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${index === activeSlide ? "active" : ""}`}
              onClick={() => handleSlideChange(index)}
              aria-label={`${t("common.view")} ${index + 1}`}
            >
              {index === activeSlide && (
                <span
                  className="progress-ring"
                  style={{
                    background: `conic-gradient(
                      rgba(251, 197, 0, 8) ${animationProgress}%,
                      rgba(255, 255, 255, 0.2) 0%
                    )`,
                  }}
                ></span>
              )}
            </button>
          ))}
        </div>

        <button
          className="hero-arrow next"
          onClick={handleNextSlide}
          aria-label={t("common.next")}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </section>
  );
}

export default Hero;
