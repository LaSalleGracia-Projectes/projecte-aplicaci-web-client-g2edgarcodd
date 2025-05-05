import React, { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

function CreateListButton({ onCreateList }) {
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [newListData, setNewListData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  const handleOpenModal = () => {
    setShowModal(true);
    setNewListData({
      name: "",
      description: "",
    });
    setErrors({});
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewListData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error cuando el usuario escribe
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación
    const newErrors = {};
    if (!newListData.name.trim()) {
      newErrors.name = t("lists.errors.emptyName");
    } else if (newListData.name.length > 50) {
      newErrors.name = t("lists.errors.nameTooLong");
    }

    if (newListData.description && newListData.description.length > 250) {
      newErrors.description = t("lists.errors.descriptionTooLong");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Crear lista
    onCreateList({
      name: newListData.name.trim(),
      description: newListData.description.trim(),
    });

    // Cerrar modal
    setShowModal(false);
  };

  return (
    <>
      <button
        className="create-list-btn"
        onClick={handleOpenModal}
        aria-label={t("lists.createNewList")}
      >
        <i className="fas fa-plus"></i> {t("lists.createList")}
      </button>

      {showModal && (
        <div className="create-list-modal-backdrop">
          <div className="create-list-modal">
            <div className="modal-header">
              <h2>{t("lists.createNewList")}</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="create-list-form">
              <div className={`form-group ${errors.name ? "has-error" : ""}`}>
                <label htmlFor="list-name">{t("lists.listName")}</label>
                <input
                  type="text"
                  id="list-name"
                  name="name"
                  value={newListData.name}
                  onChange={handleChange}
                  placeholder={t("lists.listNamePlaceholder")}
                  maxLength="50"
                />
                {errors.name && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i> {errors.name}
                  </div>
                )}
              </div>

              <div
                className={`form-group ${
                  errors.description ? "has-error" : ""
                }`}
              >
                <label htmlFor="list-description">
                  {t("lists.description")}{" "}
                  <span className="optional">({t("common.optional")})</span>
                </label>
                <textarea
                  id="list-description"
                  name="description"
                  value={newListData.description}
                  onChange={handleChange}
                  placeholder={t("lists.descriptionPlaceholder")}
                  rows="3"
                  maxLength="250"
                ></textarea>
                {errors.description && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>{" "}
                    {errors.description}
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCloseModal}
                >
                  {t("common.cancel")}
                </button>
                <button type="submit" className="btn-primary">
                  <i className="fas fa-plus"></i> {t("lists.createList")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default CreateListButton;
