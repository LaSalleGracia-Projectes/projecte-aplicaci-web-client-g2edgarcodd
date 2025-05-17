import React, { useState } from "react";
import PropTypes from "prop-types";
import { useLanguage } from "../../contexts/LanguageContext";
import { Link } from "react-router-dom";
import "../../styles/components/tvshow.css";

/**
 * Componente para mostrar las temporadas de una serie
 */
const Seasons = ({ seasons = [], tvShowId, tvShowName }) => {
  const { t } = useLanguage();
  const [expandedSeasons, setExpandedSeasons] = useState({});

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return t("common.unknown");
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Función para expandir/colapsar descripción de temporada
  const toggleSeasonDescription = (seasonId) => {
    setExpandedSeasons((prev) => ({
      ...prev,
      [seasonId]: !prev[seasonId],
    }));
  };

  if (!seasons || seasons.length === 0) {
    return (
      <div className="tv-seasons-empty">
        <i className="fas fa-calendar-times fa-3x"></i>
        <p>{t("tvShow.noSeasonsAvailable")}</p>
      </div>
    );
  }

  return (
    <div className="tv-seasons-container">
      <h3 className="tv-seasons-title">
        <i className="fas fa-layer-group"></i> {t("tvShow.seasons")}
        <span className="tv-seasons-count">({seasons.length})</span>
      </h3>

      <div className="tv-seasons-list">
        {seasons.map((season) => (
          <div key={season.id} className="tv-season-item">
            <div className="tv-season-poster">
              {season.poster_path ? (
                <img
                  src={season.poster_path}
                  alt={season.name}
                  className="tv-season-image"
                  loading="lazy"
                />
              ) : (
                <div className="tv-season-no-poster">
                  <i className="fas fa-film"></i>
                </div>
              )}
            </div>

            <div className="tv-season-details">
              <h3 className="tv-season-name">{season.name}</h3>

              <div className="tv-season-meta">
                <span className="tv-season-year">
                  {season.air_date
                    ? new Date(season.air_date).getFullYear()
                    : t("common.unknown")}
                </span>
                <span className="tv-season-episodes">
                  <i className="fas fa-film"></i> {season.episode_count}{" "}
                  {t("tvShow.episodes")}
                </span>
              </div>

              {season.overview && (
                <div className="tv-season-overview">
                  <p
                    className={`tv-season-description ${
                      expandedSeasons[season.id] ? "expanded" : ""
                    }`}
                  >
                    {season.overview}
                  </p>
                  {season.overview.length > 150 && (
                    <button
                      onClick={() => toggleSeasonDescription(season.id)}
                      className="tv-season-expand-button"
                    >
                      {expandedSeasons[season.id] ? (
                        <>
                          <i className="fas fa-chevron-up"></i>{" "}
                          {t("common.showLess")}
                        </>
                      ) : (
                        <>
                          <i className="fas fa-chevron-down"></i>{" "}
                          {t("common.readMore")}
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              <div className="tv-season-air-date">
                <i className="fas fa-calendar-alt"></i>{" "}
                {formatDate(season.air_date)}
              </div>

              <Link
                to={`/series/${tvShowId}/season/${season.season_number}`}
                className="tv-season-view-button"
              >
                <i className="fas fa-eye"></i> {t("tvShow.viewEpisodes")}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

Seasons.propTypes = {
  seasons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      overview: PropTypes.string,
      poster_path: PropTypes.string,
      season_number: PropTypes.number.isRequired,
      episode_count: PropTypes.number,
      air_date: PropTypes.string,
    })
  ).isRequired,
  tvShowId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  tvShowName: PropTypes.string,
};

export default Seasons;
