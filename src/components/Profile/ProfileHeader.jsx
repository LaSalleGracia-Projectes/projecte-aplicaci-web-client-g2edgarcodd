import React, { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import LanguageSwitcher from "../LanguageSwitcher";
import { getAvatarUrl } from "../../utils/avatar";

function ProfileHeader({ userData }) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    userData?.statusMessage || t("profile.defaultStatus")
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleStatusSave = async () => {
    try {
      setIsSubmitting(true);

      // Aquí iría la llamada real a la API
      // const response = await fetch('/api/user/update-status', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ statusMessage })
      // });

      // Simulamos la respuesta
      await new Promise((resolve) => setTimeout(resolve, 600));

      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-header">
      <div
        className="profile-cover-image"
        style={
          userData?.coverImage
            ? {
                backgroundImage: `linear-gradient(to right, rgba(13, 71, 161, 0.7), rgba(25, 118, 210, 0.7)), url(${userData.coverImage})`,
              }
            : {}
        }
      >
        {/* Añadimos el selector de idioma */}
        <div style={{ position: "absolute", top: "15px", right: "15px" }}>
          <LanguageSwitcher variant="minimal" />
        </div>
      </div>

      <div className="profile-header-content">
        <div className="profile-avatar-container">
          {userData?.avatar ? (
            <img
              src={userData.avatar}
              alt={userData?.username || t("profile.user")}
              className="profile-avatar"
            />
          ) : (
            <div className="profile-avatar-placeholder">
              <img
                src={getAvatarUrl(
                  null,
                  userData?.username || t("profile.user"),
                  "big-ears"
                )}
                alt={userData?.username || t("profile.user")}
                className="profile-avatar"
              />
            </div>
          )}
        </div>

        <div className="profile-header-info">
          <div className="profile-name-container">
            <h1 className="profile-name">
              {userData?.fullName || t("profile.noName")}
            </h1>
            <span className="profile-username">
              @{userData?.username || "usuario"}
            </span>

            {userData?.plan === "Premium" && (
              <span className="premium-badge">
                <i className="fas fa-crown"></i> Premium
              </span>
            )}
          </div>

          <div className="profile-status">
            {!isEditing ? (
              <>
                <p className="status-message">{statusMessage}</p>
                <button
                  className="edit-status-btn"
                  onClick={handleEditToggle}
                  disabled={isSubmitting}
                >
                  <i className="fas fa-edit"></i>
                </button>
              </>
            ) : (
              <div className="status-edit-container">
                <input
                  type="text"
                  value={statusMessage}
                  onChange={(e) => setStatusMessage(e.target.value)}
                  className="status-input"
                  maxLength="100"
                  placeholder={t("profile.whatAreYouWatching")}
                  disabled={isSubmitting}
                  autoFocus
                />
                <button
                  className="save-status-btn"
                  onClick={handleStatusSave}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fas fa-check"></i>
                  )}
                </button>
                <button
                  className="cancel-edit-btn"
                  onClick={handleEditToggle}
                  disabled={isSubmitting}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{userData?.watchTime || 0}</span>
              <span className="stat-label">{t("profile.hoursWatched")}</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {userData?.favorites ? userData.favorites.length : 0}
              </span>
              <span className="stat-label">{t("profile.favorites")}</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {userData?.customLists ? userData.customLists.length : 0}
              </span>
              <span className="stat-label">{t("profile.lists")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
