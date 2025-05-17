import React, { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import PropTypes from "prop-types";
import "../../styles/components/moviedetail-enhanced.css";

function MovieInfo({ movie }) {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState("synopsis");

  if (!movie) return null;

  // Calcular porcentaje de puntuación para gráficos visuales
  const calculateScorePercentage = (score, max) => {
    return (parseFloat(score) / parseFloat(max)) * 100;
  };

  // Formatear fecha para mostrarla
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="movie-detail-info">
      <div className="movie-detail-info-navigation">
        <button
          className={`movie-detail-info-nav-item ${
            activeSection === "synopsis" ? "active" : ""
          }`}
          onClick={() => setActiveSection("synopsis")}
        >
          <i className="fas fa-align-left"></i> {t("movieDetail.synopsis")}
        </button>
        <button
          className={`movie-detail-info-nav-item ${
            activeSection === "details" ? "active" : ""
          }`}
          onClick={() => setActiveSection("details")}
        >
          <i className="fas fa-info-circle"></i> {t("movieDetail.details")}
        </button>
        <button
          className={`movie-detail-info-nav-item ${
            activeSection === "crew" ? "active" : ""
          }`}
          onClick={() => setActiveSection("crew")}
        >
          <i className="fas fa-user-tie"></i> {t("movieDetail.crew")}
        </button>
        {movie.media_type === "tv" && (
          <button
            className={`movie-detail-info-nav-item ${
              activeSection === "seasons" ? "active" : ""
            }`}
            onClick={() => setActiveSection("seasons")}
          >
            <i className="fas fa-list-ol"></i> {t("movieDetail.seasons")}
          </button>
        )}
      </div>

      <div className="movie-detail-info-content movie-detail-animate-fade-in">
        {activeSection === "synopsis" && (
          <div className="movie-detail-synopsis-section">
            <p className="movie-detail-movie-full-description">
              {movie.description || t("movieDetail.noDescriptionAvailable")}
            </p>

            {/* Mostrar tagline si existe */}
            {movie.tagline && (
              <div className="movie-detail-tagline">
                <i className="fas fa-quote-left"></i> {movie.tagline}{" "}
                <i className="fas fa-quote-right"></i>
              </div>
            )}

            {/* Enlaces externos */}
            <div className="movie-detail-external-links">
              {movie.homepage && (
                <a
                  href={movie.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="movie-detail-external-link"
                >
                  <i className="fas fa-globe"></i>{" "}
                  {t("movieDetail.officialWebsite")}
                </a>
              )}

              {movie.imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${movie.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="movie-detail-external-link imdb"
                >
                  <i className="fab fa-imdb"></i> IMDb
                </a>
              )}
            </div>
          </div>
        )}

        {activeSection === "details" && (
          <div className="movie-detail-details-section">
            <div className="movie-detail-movie-details-grid">
              {movie.budget && (
                <div className="movie-detail-detail-item">
                  <div className="movie-detail-detail-icon">
                    <i className="fas fa-money-bill-wave"></i>
                  </div>
                  <div className="movie-detail-detail-content">
                    <h4>{t("movieDetail.budget")}</h4>
                    <p>{movie.budget}</p>
                  </div>
                </div>
              )}

              {movie.revenue && (
                <div className="movie-detail-detail-item">
                  <div className="movie-detail-detail-icon">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <div className="movie-detail-detail-content">
                    <h4>{t("movieDetail.revenue")}</h4>
                    <p>{movie.revenue}</p>
                  </div>
                </div>
              )}

              <div className="movie-detail-detail-item">
                <div className="movie-detail-detail-icon">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <div className="movie-detail-detail-content">
                  <h4>{t("movieDetail.releaseDate")}</h4>
                  <p>{formatDate(movie.release_date)}</p>
                </div>
              </div>

              <div className="movie-detail-detail-item">
                <div className="movie-detail-detail-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="movie-detail-detail-content">
                  <h4>{t("movieDetail.duration")}</h4>
                  <p>
                    {movie.media_type === "tv"
                      ? `${movie.duration} ${t("common.minutes")} ${t(
                          "common.perEpisode"
                        )}`
                      : `${Math.floor(movie.duration / 60)}h ${
                          movie.duration % 60
                        }min`}
                  </p>
                </div>
              </div>

              {movie.originalLanguage && (
                <div className="movie-detail-detail-item">
                  <div className="movie-detail-detail-icon">
                    <i className="fas fa-language"></i>
                  </div>
                  <div className="movie-detail-detail-content">
                    <h4>{t("movieDetail.originalLanguage")}</h4>
                    <p>{movie.originalLanguage}</p>
                  </div>
                </div>
              )}

              {movie.status && (
                <div className="movie-detail-detail-item">
                  <div className="movie-detail-detail-icon">
                    <i className="fas fa-info-circle"></i>
                  </div>
                  <div className="movie-detail-detail-content">
                    <h4>{t("movieDetail.status")}</h4>
                    <p>{movie.status}</p>
                    {movie.in_production && (
                      <span className="movie-detail-production-badge">
                        {t("movieDetail.inProduction")}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {movie.popularity && (
                <div className="movie-detail-detail-item">
                  <div className="movie-detail-detail-icon">
                    <i className="fas fa-fire"></i>
                  </div>
                  <div className="movie-detail-detail-content">
                    <h4>{t("movieDetail.popularity")}</h4>
                    <p>{movie.popularity.toFixed(1)}</p>
                  </div>
                </div>
              )}

              {movie.vote_count && (
                <div className="movie-detail-detail-item">
                  <div className="movie-detail-detail-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="movie-detail-detail-content">
                    <h4>{t("movieDetail.votes")}</h4>
                    <p>{movie.vote_count.toLocaleString()}</p>
                  </div>
                </div>
              )}

              {movie.productionCountries &&
                movie.productionCountries.length > 0 && (
                  <div className="movie-detail-detail-item">
                    <div className="movie-detail-detail-icon">
                      <i className="fas fa-globe-americas"></i>
                    </div>
                    <div className="movie-detail-detail-content">
                      <h4>{t("movieDetail.productionCountries")}</h4>
                      <p>{movie.productionCountries.join(", ")}</p>
                    </div>
                  </div>
                )}

              {/* Información específica de series */}
              {movie.media_type === "tv" && movie.number_of_seasons && (
                <div className="movie-detail-detail-item">
                  <div className="movie-detail-detail-icon">
                    <i className="fas fa-layer-group"></i>
                  </div>
                  <div className="movie-detail-detail-content">
                    <h4>{t("movieDetail.seasons")}</h4>
                    <p>{movie.number_of_seasons}</p>
                  </div>
                </div>
              )}

              {movie.media_type === "tv" && movie.number_of_episodes && (
                <div className="movie-detail-detail-item">
                  <div className="movie-detail-detail-icon">
                    <i className="fas fa-film"></i>
                  </div>
                  <div className="movie-detail-detail-content">
                    <h4>{t("movieDetail.episodes")}</h4>
                    <p>{movie.number_of_episodes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Compañías de producción */}
            {movie.productionCompanies &&
              movie.productionCompanies.length > 0 && (
                <div className="movie-detail-production-companies">
                  <h4 className="movie-detail-section-subtitle">
                    <i className="fas fa-building"></i>{" "}
                    {t("movieDetail.productionCompanies")}
                  </h4>
                  <div className="movie-detail-companies-list">
                    {movie.productionCompanies.map((company, index) => (
                      <div key={index} className="movie-detail-company-item">
                        {company.logo && (
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="movie-detail-company-logo"
                          />
                        )}
                        <span className="movie-detail-company-name">
                          {company.name}
                          {company.origin_country && (
                            <small className="movie-detail-company-country">
                              ({company.origin_country})
                            </small>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Redes (Networks) para series de TV */}
            {movie.media_type === "tv" &&
              movie.networks &&
              movie.networks.length > 0 && (
                <div className="movie-detail-networks">
                  <h4 className="movie-detail-section-subtitle">
                    <i className="fas fa-broadcast-tower"></i>{" "}
                    {t("movieDetail.networks")}
                  </h4>
                  <div className="movie-detail-networks-list">
                    {movie.networks.map((network, index) => (
                      <div key={index} className="movie-detail-network-item">
                        {network.logo && (
                          <img
                            src={network.logo}
                            alt={network.name}
                            className="movie-detail-network-logo"
                          />
                        )}
                        <span className="movie-detail-network-name">
                          {network.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Calificaciones */}
            {movie.ratings && movie.ratings.length > 0 && (
              <div className="movie-detail-movie-ratings">
                <h4 className="movie-detail-section-subtitle">
                  <i className="fas fa-star-half-alt"></i>{" "}
                  {t("movieDetail.ratings")}
                </h4>
                <div className="movie-detail-ratings-list">
                  {movie.ratings.map((rating, index) => (
                    <div key={index} className="movie-detail-rating-item">
                      <div className="movie-detail-rating-header">
                        <i className={rating.icon}></i>
                        <span className="movie-detail-rating-source">
                          {rating.source}
                        </span>
                      </div>
                      <div className="movie-detail-rating-bar-container">
                        <div
                          className="movie-detail-rating-bar"
                          style={{
                            width: `${calculateScorePercentage(
                              rating.value,
                              rating.outOf
                            )}%`,
                            background:
                              rating.source === "IMDb"
                                ? "#f5c518"
                                : rating.source === "Rotten Tomatoes"
                                ? "#fa320a"
                                : "#66cc33",
                          }}
                        ></div>
                      </div>
                      <div className="movie-detail-rating-score">
                        <span className="movie-detail-score">
                          {rating.value}
                        </span>
                        <span className="movie-detail-total">
                          /{rating.outOf}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === "crew" && (
          <div className="movie-detail-crew-section">
            {movie.crew &&
            Object.keys(movie.crewByDepartment || {}).length > 0 ? (
              <div className="movie-detail-crew-departments">
                {Object.keys(movie.crewByDepartment || {}).map((department) => (
                  <div
                    key={department}
                    className="movie-detail-crew-department"
                  >
                    <h4 className="movie-detail-department-title">
                      {department}
                    </h4>
                    <div className="movie-detail-crew-list">
                      {movie.crewByDepartment[department].map(
                        (member, index) => (
                          <div key={index} className="movie-detail-crew-member">
                            <div className="movie-detail-crew-member-icon">
                              <i
                                className={
                                  member.job === "Director"
                                    ? "fas fa-video"
                                    : member.job === "Writer" ||
                                      member.job === "Screenplay"
                                    ? "fas fa-pen-fancy"
                                    : member.job ===
                                        "Director of Photography" ||
                                      member.job === "Cinematography"
                                    ? "fas fa-camera"
                                    : member.job === "Music" ||
                                      member.job === "Original Music Composer"
                                    ? "fas fa-music"
                                    : member.job === "Producer"
                                    ? "fas fa-money-bill"
                                    : "fas fa-user-tie"
                                }
                              ></i>
                            </div>
                            <div className="movie-detail-crew-member-details">
                              <p className="movie-detail-crew-name">
                                {member.name}
                              </p>
                              <h5 className="movie-detail-crew-job">
                                {member.job}
                              </h5>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="movie-detail-no-crew-info">
                <i className="fas fa-user-slash fa-3x"></i>
                <p>{t("movieDetail.noCrewAvailable")}</p>
              </div>
            )}
          </div>
        )}

        {activeSection === "seasons" && movie.media_type === "tv" && (
          <div className="movie-detail-seasons-section">
            {movie.seasons && movie.seasons.length > 0 ? (
              <div className="movie-detail-seasons-list">
                {movie.seasons.map((season) => (
                  <div key={season.id} className="movie-detail-season-item">
                    <div className="movie-detail-season-poster">
                      {season.poster_path ? (
                        <img
                          src={season.poster_path}
                          alt={season.name}
                          className="movie-detail-season-img"
                        />
                      ) : (
                        <div className="movie-detail-season-no-image">
                          <i className="fas fa-film"></i>
                        </div>
                      )}
                    </div>
                    <div className="movie-detail-season-info">
                      <h4 className="movie-detail-season-name">
                        {season.name}
                      </h4>
                      <div className="movie-detail-season-meta">
                        <span className="movie-detail-season-date">
                          {season.air_date
                            ? formatDate(season.air_date)
                            : t("common.unknown")}
                        </span>
                        <span className="movie-detail-episode-count">
                          {season.episode_count}{" "}
                          {season.episode_count === 1
                            ? t("movieDetail.episode")
                            : t("movieDetail.episodes")}
                        </span>
                      </div>
                      {season.overview && (
                        <p className="movie-detail-season-overview">
                          {season.overview}
                        </p>
                      )}
                      <button className="movie-detail-season-details-btn">
                        <i className="fas fa-info-circle"></i>{" "}
                        {t("movieDetail.seasonDetails")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="movie-detail-no-seasons-info">
                <i className="fas fa-calendar-times fa-3x"></i>
                <p>{t("movieDetail.noSeasonsAvailable")}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

MovieInfo.propTypes = {
  movie: PropTypes.object.isRequired,
};

export default MovieInfo;
