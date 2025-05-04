import React, { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import PropTypes from "prop-types";

function MovieInfo({ movie }) {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState("synopsis");

  if (!movie) return null;

  // Calcular porcentaje de puntuación para gráficos visuales
  const calculateScorePercentage = (score, max) => {
    return (parseFloat(score) / parseFloat(max)) * 100;
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
        {movie.trivia && movie.trivia.length > 0 && (
          <button
            className={`movie-detail-info-nav-item ${
              activeSection === "trivia" ? "active" : ""
            }`}
            onClick={() => setActiveSection("trivia")}
          >
            <i className="fas fa-lightbulb"></i> {t("movieDetail.trivia")}
          </button>
        )}
      </div>

      <div className="movie-detail-info-content movie-detail-animate-fade-in">
        {activeSection === "synopsis" && (
          <div className="movie-detail-synopsis-section">
            <p className="movie-detail-movie-full-description">
              {movie.description}
            </p>

            {/* Palabras clave */}
            {movie.keywords && movie.keywords.length > 0 && (
              <div className="movie-detail-movie-keywords">
                <h4 className="movie-detail-keywords-title">
                  <i className="fas fa-tags"></i> {t("movieDetail.keywords")}
                </h4>
                <div className="movie-detail-keyword-list">
                  {movie.keywords.map((keyword, index) => (
                    <span key={index} className="movie-detail-keyword-tag">
                      {t(`keywords.${keyword.toLowerCase()}`) || keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
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
                  <h4>{t("movieDetail.releaseYear")}</h4>
                  <p>{movie.year}</p>
                </div>
              </div>

              <div className="movie-detail-detail-item">
                <div className="movie-detail-detail-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="movie-detail-detail-content">
                  <h4>{t("movieDetail.duration")}</h4>
                  <p>{movie.duration || t("common.notAvailable")}</p>
                </div>
              </div>

              {movie.originalLanguage && (
                <div className="movie-detail-detail-item">
                  <div className="movie-detail-detail-icon">
                    <i className="fas fa-language"></i>
                  </div>
                  <div className="movie-detail-detail-content">
                    <h4>{t("movieDetail.originalLanguage")}</h4>
                    <p>
                      {t(`languages.${movie.originalLanguage}`) ||
                        movie.originalLanguage}
                    </p>
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
            {movie.crew && movie.crew.length > 0 ? (
              <div className="movie-detail-crew-grid">
                {movie.crew.map((member, index) => (
                  <div key={index} className="movie-detail-crew-member">
                    <div className="movie-detail-crew-member-icon">
                      <i
                        className={
                          member.job === "Director"
                            ? "fas fa-video"
                            : member.job === "Guionista"
                            ? "fas fa-pen-fancy"
                            : member.job === "Fotografía"
                            ? "fas fa-camera"
                            : member.job === "Música"
                            ? "fas fa-music"
                            : "fas fa-user-tie"
                        }
                      ></i>
                    </div>
                    <div className="movie-detail-crew-member-details">
                      <h4 className="movie-detail-crew-job">
                        {t(`crew.${member.job.toLowerCase()}`) || member.job}
                      </h4>
                      <p className="movie-detail-crew-name">{member.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="movie-detail-no-crew-info">
                <i className="fas fa-exclamation-circle"></i>
                <p>{t("movieDetail.noCrew")}</p>
              </div>
            )}
          </div>
        )}

        {activeSection === "trivia" && movie.trivia && (
          <div className="movie-detail-trivia-section">
            <h4 className="movie-detail-trivia-title">
              <i className="fas fa-lightbulb"></i>{" "}
              {t("movieDetail.interesting")} {t("movieDetail.facts")}
            </h4>
            <ul className="movie-detail-trivia-list">
              {movie.trivia.map((item, index) => (
                <li key={index} className="movie-detail-trivia-item">
                  <div className="movie-detail-trivia-icon">
                    <i className="fas fa-info-circle"></i>
                  </div>
                  <p>{item}</p>
                </li>
              ))}
            </ul>
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
