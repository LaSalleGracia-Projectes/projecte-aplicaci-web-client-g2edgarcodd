import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";

function ListItem({ list, onRemoveList }) {
  const { t, currentLanguage } = useLanguage();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const confirmDelete = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onRemoveList(list.id);
    setShowDeleteModal(false);
  };

  const cancelDelete = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowDeleteModal(false);
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      currentLanguage === "es"
        ? "es-ES"
        : currentLanguage === "ca"
        ? "ca-ES"
        : "en-US",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  };

  // Mostrar pósters de ejemplo si no hay items
  const defaultPosters = [
    "https://via.placeholder.com/500x750/182236/FBC500?text=Lista",
    "https://via.placeholder.com/500x750/142236/FBC500?text=StreamHub",
    "https://via.placeholder.com/500x750/102236/FBC500?text=Películas",
  ];

  return (
    <>
      <Link to={`/list/${list.id}`} className="list-item">
        <div className="list-content">
          <div className="list-info">
            <h3 className="list-name">{list.name}</h3>
            <div className="list-meta">
              <span className="list-count">
                <i className="fas fa-film"></i> {list.itemCount}{" "}
                {t("lists.items")}
              </span>
              <span className="list-date">
                <i className="fas fa-calendar-alt"></i>{" "}
                {formatDate(list.updatedAt)}
              </span>
            </div>
            <p className="list-description">{list.description}</p>
          </div>

          <button
            className="list-delete-btn"
            onClick={handleDeleteClick}
            aria-label={t("lists.deleteList")}
          >
            <i className="fas fa-trash-alt"></i>
          </button>

          <div className="list-posters">
            {(list.items && list.items.length > 0
              ? list.items.slice(0, 3)
              : defaultPosters.slice(0, 3)
            ).map((item, index) => (
              <div
                key={typeof item === "string" ? `default-${index}` : item.id}
                className="list-poster-preview"
              >
                <img
                  src={typeof item === "string" ? item : item.posterPath}
                  alt={
                    typeof item === "string"
                      ? `${t("lists.poster")} ${index + 1}`
                      : item.title
                  }
                  className="list-poster-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/300x450?text=No+Image";
                  }}
                />
              </div>
            ))}
            {list.itemCount > 3 && (
              <div className="list-poster-more">
                <span>+{list.itemCount - 3}</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      {showDeleteModal && (
        <div className="confirm-delete-modal active">
          <div className="confirm-delete-content">
            <i className="fas fa-exclamation-triangle confirm-delete-icon"></i>
            <h3 className="confirm-delete-title">
              {t("lists.deleteListConfirmation")}
            </h3>
            <p className="confirm-delete-message">
              {t("lists.deleteListWarning", { name: list.name })}
            </p>
            <div className="confirm-delete-actions">
              <button className="btn-cancel" onClick={cancelDelete}>
                <i className="fas fa-times"></i> {t("common.cancel")}
              </button>
              <button className="btn-confirm" onClick={confirmDelete}>
                <i className="fas fa-trash-alt"></i> {t("common.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ListItem;
