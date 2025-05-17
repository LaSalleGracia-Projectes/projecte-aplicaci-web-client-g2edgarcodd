import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";

function AccountSummary({ userData }) {
  const { t, currentLanguage } = useLanguage();

  // Formatear la fecha en formato legible
  const formatDate = (dateString) => {
    if (!dateString) return "-";

    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(
      currentLanguage === "es"
        ? "es-ES"
        : currentLanguage === "ca"
        ? "ca-ES"
        : "en-US",
      options
    );
  };

  // Calcular días restantes hasta expiración de la suscripción
  const calculateRemainingDays = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = Math.abs(expiry - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Función para obtener color según el género
  const getGenreColor = (genre, alpha = 1) => {
    const colors = {
      [t("action")]: `rgba(229, 57, 53, ${alpha})`,
      [t("scienceFiction")]: `rgba(25, 118, 210, ${alpha})`,
      [t("thriller")]: `rgba(142, 36, 170, ${alpha})`,
      [t("drama")]: `rgba(255, 179, 0, ${alpha})`,
      [t("comedy")]: `rgba(67, 160, 71, ${alpha})`,
      [t("horror")]: `rgba(109, 76, 65, ${alpha})`,
      [t("adventure")]: `rgba(0, 137, 123, ${alpha})`,
      [t("animation")]: `rgba(251, 140, 0, ${alpha})`,
      [t("fantasy")]: `rgba(124, 179, 66, ${alpha})`,
    };

    return colors[genre] || `rgba(96, 125, 139, ${alpha})`; // Gris por defecto
  };

  // Asegurarse de que los datos existen antes de usarlos
  const remainingDays = userData.planExpiry
    ? calculateRemainingDays(userData.planExpiry)
    : 0;

  return (
    <div className="account-summary animate-fade-in">
      <div className="summary-section membership-info">
        <h2 className="section-title">{t("profile.accountInfo")}</h2>

        <div className="info-group">
          <div className="info-row">
            <span className="info-label">{t("profile.email")}:</span>
            <span className="info-value">{userData.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">{t("profile.memberSince")}:</span>
            <span className="info-value">
              {formatDate(userData.memberSince)}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">{t("profile.planType")}:</span>
            <span className="info-value">
              <span
                className={`plan-badge ${(userData.plan || "").toLowerCase()}`}
              >
                {userData.plan === "Premium" ? (
                  <>
                    <i className="fas fa-crown"></i> Premium
                  </>
                ) : userData.plan === "Standard" ? (
                  <>
                    <i className="fas fa-check"></i> {t("profile.standard")}
                  </>
                ) : (
                  <>
                    <i className="fas fa-star"></i> {t("profile.basic")}
                  </>
                )}
              </span>
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">{t("profile.expiresIn")}:</span>
            <span className="info-value">
              <span className="expiry-date">
                {formatDate(userData.planExpiry)}
              </span>
              <span className="days-remaining">
                ({remainingDays} {t("profile.days")})
              </span>
            </span>
          </div>
        </div>

        <div className="action-buttons">
          <Link to="/profile/update" className="btn-primary">
            <i className="fas fa-pencil-alt"></i> {t("profile.editProfile")}
          </Link>
        </div>
      </div>

      <div className="summary-section viewing-stats">
        <h2 className="section-title">{t("profile.viewingStats")}</h2>

        <div className="stats-highlight-row">
          <div className="stats-highlight-card">
            <div className="stats-highlight-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stats-highlight-content">
              <div className="stats-highlight">{userData.watchTime}</div>
              <div className="stats-highlight-label">
                {t("profile.totalHours")}
              </div>
            </div>
          </div>

          <div className="stats-highlight-card">
            <div className="stats-highlight-icon">
              <i className="fas fa-film"></i>
            </div>
            <div className="stats-highlight-content">
              <div className="stats-highlight">{userData.totalMovies}</div>
              <div className="stats-highlight-label">{t("profile.movies")}</div>
            </div>
          </div>

          <div className="stats-highlight-card">
            <div className="stats-highlight-icon">
              <i className="fas fa-tv"></i>
            </div>
            <div className="stats-highlight-content">
              <div className="stats-highlight">{userData.totalSeries}</div>
              <div className="stats-highlight-label">{t("profile.series")}</div>
            </div>
          </div>

          <div className="stats-highlight-card">
            <div className="stats-highlight-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stats-highlight-content">
              <div className="stats-highlight">{userData.totalEpisodes}</div>
              <div className="stats-highlight-label">
                {t("profile.episodes")}
              </div>
            </div>
          </div>
        </div>

        <div className="stats-dashboard">
          {/* Géneros más vistos */}
          <div className="stats-card">
            <div className="stats-card-header">
              <h3 className="stats-card-title">
                <i className="fas fa-chart-pie"></i>
                {t("profile.mostWatchedGenres")}
              </h3>
            </div>
            <div className="stats-card-body">
              <div className="genre-stats-list">
                {userData.genreStats.map((genre) => (
                  <div key={genre.name} className="genre-stats-item">
                    <div className="genre-stats-info">
                      <span className="genre-name">{genre.name}</span>
                      <span className="genre-percentage">
                        {genre.percentage}%
                      </span>
                    </div>
                    <div className="genre-progress-bar">
                      <div
                        className="genre-progress"
                        style={{
                          width: `${genre.percentage}%`,
                          backgroundColor: getGenreColor(genre.name),
                        }}
                      ></div>
                    </div>
                    <div className="genre-hours">
                      {genre.hours} {t("profile.hours")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visualización por dispositivo */}
          <div className="stats-card">
            <div className="stats-card-header">
              <h3 className="stats-card-title">
                <i className="fas fa-mobile-alt"></i>
                {t("profile.viewingByDevice")}
              </h3>
            </div>
            <div className="stats-card-body">
              <div className="device-stats-list">
                {userData.watchByDevice.map((device) => (
                  <div key={device.device} className="device-stats-item">
                    <div className="device-icon">
                      <i
                        className={`fas fa-${
                          device.device === "TV"
                            ? "tv"
                            : device.device === t("mobile")
                            ? "mobile-alt"
                            : device.device === t("tablet")
                            ? "tablet-alt"
                            : "laptop"
                        }`}
                      ></i>
                    </div>
                    <div className="device-info">
                      <div className="device-name">{device.device}</div>
                      <div className="device-progress-bar">
                        <div
                          className="device-progress"
                          style={{
                            width: `${device.percentage}%`,
                            backgroundColor:
                              device.device === "TV"
                                ? "rgba(229, 57, 53, 0.8)"
                                : device.device === t("mobile")
                                ? "rgba(25, 118, 210, 0.8)"
                                : device.device === t("tablet")
                                ? "rgba(124, 179, 66, 0.8)"
                                : "rgba(255, 179, 0, 0.8)",
                          }}
                        ></div>
                      </div>
                      <div className="device-stats">
                        <span className="device-hours">{device.hours}h</span>
                        <span className="device-percentage">
                          {device.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tendencias mensuales */}
          <div className="stats-card">
            <div className="stats-card-header">
              <h3 className="stats-card-title">
                <i className="fas fa-calendar-alt"></i>
                {t("profile.monthlyTrends")}
              </h3>
            </div>
            <div className="stats-card-body">
              <div className="monthly-stats">
                {userData.watchByMonth.map((month) => (
                  <div key={month.month} className="monthly-stat-item">
                    <div className="month-label">{month.month}</div>
                    <div className="month-bar-container">
                      <div
                        className="month-bar"
                        style={{
                          height: `${
                            (month.hours /
                              Math.max(
                                ...userData.watchByMonth.map((m) => m.hours)
                              )) *
                            100
                          }%`,
                          backgroundColor: "rgba(251, 197, 0, 0.8)",
                        }}
                      ></div>
                    </div>
                    <div className="month-hours">{month.hours}h</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Horas del día */}
          <div className="stats-card">
            <div className="stats-card-header">
              <h3 className="stats-card-title">
                <i className="fas fa-clock"></i>
                {t("profile.timeOfDay")}
              </h3>
            </div>
            <div className="stats-card-body">
              <div className="time-of-day-stats">
                {userData.watchByTimeOfDay.map((time) => (
                  <div key={time.time} className="time-stat-item">
                    <div className="time-icon">
                      <i
                        className={`fas fa-${
                          time.time === t("morning")
                            ? "sun"
                            : time.time === t("afternoon")
                            ? "cloud-sun"
                            : "moon"
                        }`}
                      ></i>
                    </div>
                    <div className="time-info">
                      <div className="time-name">{time.time}</div>
                      <div className="time-progress-bar">
                        <div
                          className="time-progress"
                          style={{
                            width: `${time.percentage}%`,
                            backgroundColor:
                              time.time === t("morning")
                                ? "rgba(255, 179, 0, 0.7)"
                                : time.time === t("afternoon")
                                ? "rgba(251, 140, 0, 0.7)"
                                : "rgba(106, 27, 154, 0.7)",
                          }}
                        ></div>
                      </div>
                      <div className="time-stats">
                        <span className="time-hours">{time.hours}h</span>
                        <span className="time-percentage">
                          {time.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="favorite-genres-container">
          <h3 className="chart-title">{t("profile.yourFavoriteGenres")}</h3>
          <div className="genres-container">
            {userData.favoriteGenres.map((genre) => (
              <div
                key={genre}
                className="genre-chip"
                style={{
                  borderColor: getGenreColor(genre),
                  background: getGenreColor(genre, 0.1),
                }}
              >
                {genre}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountSummary;
