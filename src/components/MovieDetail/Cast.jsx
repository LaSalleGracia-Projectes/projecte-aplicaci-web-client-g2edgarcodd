import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import PropTypes from "prop-types";
import "../../styles/components/moviedetail-enhanced.css";

function Cast({ movieId, castData }) {
  const { t } = useLanguage();
  const [activeCastMembers, setActiveCastMembers] = useState([]);
  const [visibleItems, setVisibleItems] = useState({});
  const [expanded, setExpanded] = useState(false);
  const imageObserverRef = useRef(null);
  const imagesRef = useRef({});

  // Inicializar el Intersection Observer para cargar imágenes de forma optimizada
  useEffect(() => {
    imageObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const actorId = entry.target.dataset.actorid;
          if (entry.isIntersecting) {
            setVisibleItems((prev) => ({
              ...prev,
              [actorId]: true,
            }));
          }
        });
      },
      { rootMargin: "100px 0px", threshold: 0.1 }
    );

    return () => {
      if (imageObserverRef.current) {
        imageObserverRef.current.disconnect();
      }
    };
  }, []);

  // Filtrar el reparto por el ID de la película y cargar imágenes
  useEffect(() => {
    const movieCast = castData.filter((actor) => actor.movieId === movieId);
    setActiveCastMembers(movieCast);

    // Resetear el estado de elementos visibles con nuevos datos
    setVisibleItems({});

    // Programar la observación de elementos después del renderizado
    setTimeout(() => {
      if (imageObserverRef.current) {
        imageObserverRef.current.disconnect();

        Object.values(imagesRef.current).forEach((el) => {
          if (el) {
            imageObserverRef.current.observe(el);
          }
        });
      }
    }, 100);

    return () => {
      if (imageObserverRef.current) {
        imageObserverRef.current.disconnect();
      }
    };
  }, [movieId, castData]);

  // Determinar cuántos actores mostrar según el estado de expansión
  const displayedMembers = expanded
    ? activeCastMembers
    : activeCastMembers.slice(0, 8);

  // Manejar la expansión/contracción del reparto
  const toggleExpand = () => {
    setExpanded(!expanded);

    // Si se está expandiendo, asegurarse de observar las nuevas imágenes
    if (!expanded) {
      setTimeout(() => {
        if (imageObserverRef.current) {
          Object.values(imagesRef.current).forEach((el) => {
            if (el) {
              imageObserverRef.current.observe(el);
            }
          });
        }
      }, 100);
    }
  };

  return (
    <div className="movie-detail-cast">
      <div className="movie-detail-cast-header">
        <h3 className="movie-detail-cast-title">
          <i className="fas fa-user-friends"></i>
          {t("movieDetail.cast")}
        </h3>
      </div>

      {activeCastMembers.length > 0 ? (
        <>
          <div className="movie-detail-cast-grid">
            {displayedMembers.map((actor, index) => (
              <div
                key={actor.id}
                className="movie-detail-cast-member"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className="movie-detail-cast-photo-container"
                  ref={(el) => {
                    imagesRef.current[actor.id] = el;
                  }}
                  data-actorid={actor.id}
                >
                  {visibleItems[actor.id] ? (
                    <img
                      src={actor.photo}
                      alt={actor.name}
                      className="movie-detail-cast-photo"
                      loading="lazy"
                    />
                  ) : (
                    <div className="movie-detail-cast-photo-placeholder">
                      <div className="movie-detail-loading-spinner"></div>
                    </div>
                  )}
                </div>
                <h4 className="movie-detail-actor-name">{actor.name}</h4>
                <p className="movie-detail-character-name">{actor.character}</p>
              </div>
            ))}
          </div>

          {activeCastMembers.length > 8 && (
            <button
              className={`movie-detail-cast-toggle ${
                expanded ? "expanded" : ""
              }`}
              onClick={toggleExpand}
            >
              {expanded ? (
                <>
                  <span>{t("movieDetail.showLess")}</span>
                  <i className="fas fa-chevron-up"></i>
                </>
              ) : (
                <>
                  <span>{t("movieDetail.showAllCast")}</span>
                  <i className="fas fa-chevron-down"></i>
                </>
              )}
            </button>
          )}
        </>
      ) : (
        <div className="movie-detail-no-cast-info">
          <i className="fas fa-user-slash fa-3x"></i>
          <p>{t("movieDetail.noCastAvailable")}</p>
        </div>
      )}
    </div>
  );
}

Cast.propTypes = {
  movieId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  castData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      movieId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      name: PropTypes.string.isRequired,
      character: PropTypes.string.isRequired,
      photo: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Cast;
