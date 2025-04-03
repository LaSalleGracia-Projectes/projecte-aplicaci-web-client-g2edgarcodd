import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";

function ActivityFeed({ userData }) {
  const { t, currentLanguage } = useLanguage();

  // Función para formatear la fecha
  const formatActivityDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    // Calcular diferencia en milisegundos
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${t("time.ago")} ${diffMins} ${
        diffMins === 1 ? t("time.minute") : t("time.minutes")
      }`;
    } else if (diffHours < 24) {
      return `${t("time.ago")} ${diffHours} ${
        diffHours === 1 ? t("time.hour") : t("time.hours")
      }`;
    } else if (diffDays < 7) {
      return `${t("time.ago")} ${diffDays} ${
        diffDays === 1 ? t("time.day") : t("time.days")
      }`;
    } else {
      return date.toLocaleDateString(
        currentLanguage === "es"
          ? "es-ES"
          : currentLanguage === "ca"
          ? "ca-ES"
          : "en-US",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      );
    }
  };

  // Renderizar icono según el tipo de actividad
  const renderActivityIcon = (type) => {
    switch (type) {
      case "watch":
        return <i className="fas fa-play-circle"></i>;
      case "rate":
        return <i className="fas fa-star"></i>;
      case "review":
        return <i className="fas fa-comment"></i>;
      case "favorite":
        return <i className="fas fa-heart"></i>;
      case "list":
        return <i className="fas fa-list"></i>;
      default:
        return <i className="fas fa-check-circle"></i>;
    }
  };

  return (
    <div className="activity-feed">
      <h3 className="section-title">{t("profile.recentActivity")}</h3>

      {userData.activities && userData.activities.length > 0 ? (
        <ul className="activity-list">
          {userData.activities.map((activity) => (
            <li key={activity.id} className="activity-item">
              <div className="activity-icon">
                {renderActivityIcon(activity.type)}
              </div>
              <div className="activity-content">
                <div className="activity-text">
                  <span className="activity-action">
                    {activity.type === "watch" && t("profile.activity.watched")}
                    {activity.type === "rate" && t("profile.activity.rated")}
                    {activity.type === "review" &&
                      t("profile.activity.reviewed")}
                    {activity.type === "favorite" &&
                      t("profile.activity.addedToFavorites")}
                    {activity.type === "list" &&
                      t("profile.activity.addedToList")}
                  </span>{" "}
                  <Link
                    to={`/${activity.contentType}/${activity.contentId}`}
                    className="content-title"
                  >
                    {activity.contentTitle}
                  </Link>
                  {activity.type === "rate" && (
                    <span className="rating-value"> {activity.rating}/10</span>
                  )}
                </div>
                <div className="activity-meta">
                  <span className="activity-time">
                    {formatActivityDate(activity.date)}
                  </span>
                </div>
                {activity.type === "review" && (
                  <p className="activity-review-excerpt">
                    {activity.review.substring(0, 100)}...
                  </p>
                )}
              </div>
              {activity.contentPoster && (
                <div className="activity-poster">
                  <img
                    src={activity.contentPoster}
                    alt={activity.contentTitle}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-activity">
          <p>{t("profile.noRecentActivity")}</p>
          <Link to="/explore" className="btn btn-secondary">
            <i className="fas fa-compass"></i> {t("profile.exploreContent")}
          </Link>
        </div>
      )}
    </div>
  );
}

export default ActivityFeed;
