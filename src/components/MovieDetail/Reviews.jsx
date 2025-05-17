import React, { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import PropTypes from "prop-types";
import "../../styles/components/moviedetail-enhanced.css";
import { getContentReviews } from "../../utils/api";

function Reviews({ movieId, mediaType = "movie" }) {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, positive, negative, user
  const [showSpoilers, setShowSpoilers] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el formulario de reseñas
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    title: "",
    content: "",
    rating: 0,
    hasSpoilers: false,
    id: null, // null para nueva reseña, id para editar
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Cargar reseñas reales de TMDB y reseñas de usuario del localStorage
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);

      try {
        // Cargar reseñas de la API
        const reviewsData = await getContentReviews(movieId, mediaType, page);

        // Procesar las reseñas para adaptar al formato
        const processedReviews = reviewsData.map((review) => {
          // Extraer avatar y autor de la reseña
          const avatarPath = review.author_details?.avatar_path;
          let avatarUrl = "https://secure.gravatar.com/avatar?d=identicon";

          if (avatarPath) {
            if (avatarPath.includes("http")) {
              // A veces TMDB devuelve URLs completas que comienzan con /http
              avatarUrl = avatarPath.substring(1);
            } else {
              avatarUrl = `https://image.tmdb.org/t/p/w45${avatarPath}`;
            }
          }

          return {
            id: review.id,
            user: {
              id: review.author_details?.username || review.author,
              name: review.author,
              avatar: avatarUrl,
              isPremium: review.author_details?.rating >= 8,
            },
            title: review.author_details?.username || "",
            rating: review.author_details?.rating
              ? review.author_details.rating / 2
              : 0,
            date: review.created_at.split("T")[0],
            content: review.content,
            likes: Math.floor(Math.random() * 50), // TMDB no proporciona likes, simulamos
            dislikes: Math.floor(Math.random() * 10),
            hasSpoilers: review.content.toLowerCase().includes("spoiler"),
            isUserReview: false, // Marcar como reseña de la API
          };
        });

        if (page === 1) {
          setReviews(processedReviews);
        } else {
          setReviews((prev) => [...prev, ...processedReviews]);
        }

        setHasMore(reviewsData.length > 0);

        // Cargar reseñas de usuario del localStorage
        loadUserReviews();
      } catch (err) {
        console.error("Error al cargar reseñas:", err);
        setError(err.message);

        // Si hay error, cargar solo las reseñas del usuario
        loadUserReviews();
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [movieId, page, mediaType]);

  // Cargar reseñas del usuario desde localStorage
  const loadUserReviews = () => {
    try {
      const storedReviews = localStorage.getItem(`user_reviews_${movieId}`);
      if (storedReviews) {
        const parsedReviews = JSON.parse(storedReviews);
        setUserReviews(parsedReviews);
      } else {
        setUserReviews([]);
      }
    } catch (error) {
      console.error("Error al cargar reseñas de usuario:", error);
      setUserReviews([]);
    }
  };

  // Guardar reseñas en localStorage
  const saveUserReviews = (reviewsData) => {
    try {
      localStorage.setItem(
        `user_reviews_${movieId}`,
        JSON.stringify(reviewsData)
      );
    } catch (error) {
      console.error("Error al guardar reseñas:", error);
    }
  };

  // Manejar envío del formulario de reseña
  const handleReviewSubmit = (e) => {
    e.preventDefault();

    // Validar el formulario
    const errors = {};
    if (!reviewFormData.title.trim()) {
      errors.title = t("reviews.errorTitle") || "El título es obligatorio";
    }
    if (!reviewFormData.content.trim() || reviewFormData.content.length < 10) {
      errors.content =
        t("reviews.errorContent") ||
        "El contenido debe tener al menos 10 caracteres";
    }
    if (reviewFormData.rating === 0) {
      errors.rating =
        t("reviews.errorRating") || "Debe seleccionar una calificación";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Limpiar errores
    setFormErrors({});

    // Crear o actualizar reseña
    if (isEditMode && reviewFormData.id) {
      // Editar reseña existente
      const updatedReviews = userReviews.map((review) =>
        review.id === reviewFormData.id
          ? {
              ...review,
              title: reviewFormData.title,
              content: reviewFormData.content,
              rating: reviewFormData.rating,
              hasSpoilers: reviewFormData.hasSpoilers,
              editedAt: new Date().toISOString(),
            }
          : review
      );

      setUserReviews(updatedReviews);
      saveUserReviews(updatedReviews);
    } else {
      // Crear nueva reseña
      const newReview = {
        id: `user_review_${Date.now()}`,
        title: reviewFormData.title,
        content: reviewFormData.content,
        rating: reviewFormData.rating,
        hasSpoilers: reviewFormData.hasSpoilers,
        date: new Date().toISOString(),
        user: {
          id: "current_user",
          name: t("reviews.you") || "Tú",
          avatar: "https://secure.gravatar.com/avatar?d=identicon&s=150",
          isPremium: false,
        },
        likes: 0,
        dislikes: 0,
        isUserReview: true, // Marcar como reseña de usuario
      };

      const updatedReviews = [...userReviews, newReview];
      setUserReviews(updatedReviews);
      saveUserReviews(updatedReviews);
    }

    // Resetear el formulario
    resetReviewForm();
    setShowReviewForm(false);
  };

  // Iniciar edición de una reseña
  const handleEditReview = (reviewId) => {
    const reviewToEdit = userReviews.find((review) => review.id === reviewId);
    if (reviewToEdit) {
      setReviewFormData({
        id: reviewToEdit.id,
        title: reviewToEdit.title || "",
        content: reviewToEdit.content,
        rating: reviewToEdit.rating,
        hasSpoilers: reviewToEdit.hasSpoilers || false,
      });
      setIsEditMode(true);
      setShowReviewForm(true);
      // Desplazarse al formulario
      setTimeout(() => {
        const formElement = document.getElementById("review-form");
        if (formElement) {
          formElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  // Eliminar una reseña
  const handleDeleteReview = (reviewId) => {
    if (
      window.confirm(
        t("reviews.confirmDelete") ||
          "¿Estás seguro de que quieres eliminar esta reseña?"
      )
    ) {
      const updatedReviews = userReviews.filter(
        (review) => review.id !== reviewId
      );
      setUserReviews(updatedReviews);
      saveUserReviews(updatedReviews);
    }
  };

  // Resetear el formulario
  const resetReviewForm = () => {
    setReviewFormData({
      title: "",
      content: "",
      rating: 0,
      hasSpoilers: false,
      id: null,
    });
    setIsEditMode(false);
    setFormErrors({});
  };

  // Cancelar edición o creación
  const handleCancelReview = () => {
    resetReviewForm();
    setShowReviewForm(false);
  };

  // Abrir formulario para nueva reseña
  const handleNewReview = () => {
    resetReviewForm();
    setShowReviewForm(true);
  };

  // Manejar cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReviewFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Limpiar error específico cuando el usuario escribe
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Manejar cambio en la calificación
  const handleRatingChange = (newRating) => {
    setReviewFormData((prev) => ({
      ...prev,
      rating: newRating,
    }));

    // Limpiar error de rating
    if (formErrors.rating) {
      setFormErrors((prev) => ({
        ...prev,
        rating: null,
      }));
    }
  };

  // Filtrar las reseñas según el filtro activo
  const filteredReviews = [...reviews, ...userReviews]
    .filter((review) => {
      if (filter === "user") return review.isUserReview;
      if (filter === "all") return true;
      if (filter === "positive") return review.rating >= 4;
      if (filter === "negative") return review.rating < 3;
      return true;
    })
    .sort((a, b) => {
      // Ordenar por fecha, más recientes primero
      return new Date(b.date) - new Date(a.date);
    });

  // Manejar la expansión de una reseña
  const toggleExpandReview = (reviewId) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  // Verificar si una reseña está truncada (para mostrar "Leer más")
  const isReviewTruncated = (content) => {
    return content.length > 300;
  };

  // Cargar más reseñas
  const loadMoreReviews = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Manejar la interacción con las reseñas
  const handleReviewAction = (reviewId, action) => {
    // Para demo, actualizamos localmente
    const isUserReview = userReviews.some((review) => review.id === reviewId);

    if (isUserReview) {
      // Actualizar reseñas del usuario
      const updatedReviews = userReviews.map((review) => {
        if (review.id === reviewId) {
          if (action === "like") {
            return { ...review, likes: review.likes + 1 };
          } else if (action === "dislike") {
            return { ...review, dislikes: review.dislikes + 1 };
          }
        }
        return review;
      });

      setUserReviews(updatedReviews);
      saveUserReviews(updatedReviews);
    } else {
      // Actualizar reseñas de la API (solo en memoria)
      setReviews((prevReviews) =>
        prevReviews.map((review) => {
          if (review.id === reviewId) {
            if (action === "like") {
              return { ...review, likes: review.likes + 1 };
            } else if (action === "dislike") {
              return { ...review, dislikes: review.dislikes + 1 };
            }
          }
          return review;
        })
      );
    }
  };

  return (
    <div className="movie-detail-reviews">
      <div className="movie-detail-review-header">
        <h3>
          <i className="fas fa-comment-alt"></i>
          {t("movieDetail.reviews")}
        </h3>

        {/* Botón para añadir nueva reseña */}
        <button
          className="movie-detail-add-review-button"
          onClick={handleNewReview}
        >
          <i className="fas fa-plus"></i>{" "}
          {t("reviews.addReview") || "Añadir reseña"}
        </button>
      </div>

      {/* Formulario de reseña */}
      {showReviewForm && (
        <div className="movie-detail-review-form-container" id="review-form">
          <h4 className="movie-detail-review-form-title">
            {isEditMode
              ? t("reviews.editReview") || "Editar reseña"
              : t("reviews.addReview") || "Añadir reseña"}
          </h4>

          <form
            onSubmit={handleReviewSubmit}
            className="movie-detail-review-form"
          >
            <div className="movie-detail-form-group">
              <label htmlFor="review-title">
                {t("reviews.title") || "Título"}
              </label>
              <input
                type="text"
                id="review-title"
                name="title"
                value={reviewFormData.title}
                onChange={handleFormChange}
                placeholder={
                  t("reviews.titlePlaceholder") ||
                  "Un título breve para tu reseña"
                }
                className={formErrors.title ? "movie-detail-form-error" : ""}
              />
              {formErrors.title && (
                <div className="movie-detail-form-error-message">
                  {formErrors.title}
                </div>
              )}
            </div>

            <div className="movie-detail-form-group">
              <label>{t("reviews.rating") || "Calificación"}</label>
              <div className="movie-detail-rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`movie-detail-rating-star ${
                      reviewFormData.rating >= star ? "active" : ""
                    }`}
                    onClick={() => handleRatingChange(star)}
                  >
                    <i className={`fas fa-star`}></i>
                  </span>
                ))}
              </div>
              {formErrors.rating && (
                <div className="movie-detail-form-error-message">
                  {formErrors.rating}
                </div>
              )}
            </div>

            <div className="movie-detail-form-group">
              <label htmlFor="review-content">
                {t("reviews.content") || "Reseña"}
              </label>
              <textarea
                id="review-content"
                name="content"
                value={reviewFormData.content}
                onChange={handleFormChange}
                rows="5"
                placeholder={
                  t("reviews.contentPlaceholder") || "Escribe tu reseña aquí..."
                }
                className={formErrors.content ? "movie-detail-form-error" : ""}
              ></textarea>
              {formErrors.content && (
                <div className="movie-detail-form-error-message">
                  {formErrors.content}
                </div>
              )}
            </div>

            <div className="movie-detail-form-group movie-detail-form-checkbox">
              <input
                type="checkbox"
                id="review-spoilers"
                name="hasSpoilers"
                checked={reviewFormData.hasSpoilers}
                onChange={handleFormChange}
              />
              <label htmlFor="review-spoilers">
                {t("reviews.containsSpoilers") ||
                  "Esta reseña contiene spoilers"}
              </label>
            </div>

            <div className="movie-detail-form-buttons">
              <button
                type="button"
                className="movie-detail-cancel-button"
                onClick={handleCancelReview}
              >
                {t("common.cancel") || "Cancelar"}
              </button>
              <button type="submit" className="movie-detail-submit-button">
                {isEditMode
                  ? t("reviews.updateReview") || "Actualizar reseña"
                  : t("reviews.submitReview") || "Publicar reseña"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="movie-detail-review-filter-bar">
        <div className="movie-detail-filter-group">
          <div className="movie-detail-filter-label">
            {t("movieDetail.filter")}:
          </div>
          <div className="movie-detail-filter-buttons">
            <button
              className={`movie-detail-filter-button ${
                filter === "all" ? "active" : ""
              }`}
              onClick={() => setFilter("all")}
            >
              {t("movieDetail.allReviews")}
            </button>
            <button
              className={`movie-detail-filter-button ${
                filter === "positive" ? "active" : ""
              }`}
              onClick={() => setFilter("positive")}
            >
              {t("movieDetail.positive")}
            </button>
            <button
              className={`movie-detail-filter-button ${
                filter === "negative" ? "active" : ""
              }`}
              onClick={() => setFilter("negative")}
            >
              {t("movieDetail.negative")}
            </button>
            {userReviews.length > 0 && (
              <button
                className={`movie-detail-filter-button ${
                  filter === "user" ? "active" : ""
                }`}
                onClick={() => setFilter("user")}
              >
                {t("reviews.myReviews") || "Mis reseñas"}
              </button>
            )}
          </div>
        </div>

        <div className="movie-detail-spoilers-toggle">
          <span>{t("movieDetail.showSpoilers")}:</span>
          <div
            className={`movie-detail-toggle-switch ${
              showSpoilers ? "active" : ""
            }`}
            onClick={() => setShowSpoilers(!showSpoilers)}
          ></div>
        </div>
      </div>

      {filteredReviews.length > 0 ? (
        <div className="movie-detail-reviews-list">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className={`movie-detail-review-card ${
                review.isUserReview ? "movie-detail-user-review" : ""
              }`}
            >
              <div className="movie-detail-review-header-card">
                <img
                  src={review.user.avatar}
                  alt={review.user.name}
                  className="movie-detail-review-avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://secure.gravatar.com/avatar?d=identicon";
                  }}
                />
                <div className="movie-detail-review-user-info">
                  <div className="movie-detail-review-user-name">
                    <h4>{review.user.name}</h4>
                    {review.user.isPremium && (
                      <div className="movie-detail-review-badge movie-detail-review-premium">
                        <i className="fas fa-crown"></i> Premium
                      </div>
                    )}
                    {review.isUserReview && (
                      <div className="movie-detail-review-badge movie-detail-review-user">
                        <i className="fas fa-user"></i>{" "}
                        {t("reviews.yourReview") || "Tu reseña"}
                      </div>
                    )}
                  </div>
                  <div className="movie-detail-review-date">
                    {new Date(review.date).toLocaleDateString()}
                    {review.editedAt && (
                      <span className="movie-detail-review-edited">
                        {" "}
                        ({t("reviews.edited") || "editada"})
                      </span>
                    )}
                  </div>
                </div>

                {/* Acciones para las reseñas del usuario */}
                {review.isUserReview && (
                  <div className="movie-detail-user-review-actions">
                    <button
                      onClick={() => handleEditReview(review.id)}
                      className="movie-detail-user-review-edit"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="movie-detail-user-review-delete"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                )}
              </div>

              {review.title && (
                <h5 className="movie-detail-review-title">{review.title}</h5>
              )}

              <div className="movie-detail-review-rating">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`${
                      i < Math.floor(review.rating)
                        ? "fas fa-star"
                        : i < review.rating
                        ? "fas fa-star-half-alt"
                        : "far fa-star"
                    }`}
                  ></i>
                ))}
              </div>

              {review.hasSpoilers && !showSpoilers ? (
                <div
                  className="movie-detail-review-content spoiler"
                  onClick={() => setShowSpoilers(true)}
                >
                  <div className="movie-detail-spoiler-warning">
                    <div className="movie-detail-spoiler-warning-icon">
                      <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <h5 className="movie-detail-spoiler-warning-title">
                      {t("movieDetail.spoilerWarning")}
                    </h5>
                    <button className="movie-detail-spoiler-reveal-btn">
                      <span>{t("movieDetail.clickToReveal")}</span>
                      <i className="fas fa-eye"></i>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className={`movie-detail-review-content ${
                      isReviewTruncated(review.content) &&
                      !expandedReviews[review.id]
                        ? "truncated"
                        : ""
                    }`}
                  >
                    {review.content}
                  </div>

                  {isReviewTruncated(review.content) && (
                    <button
                      className="movie-detail-review-expand"
                      onClick={() => toggleExpandReview(review.id)}
                    >
                      {expandedReviews[review.id] ? (
                        <>
                          <i className="fas fa-chevron-up"></i>{" "}
                          {t("movieDetail.showLess")}
                        </>
                      ) : (
                        <>
                          <i className="fas fa-chevron-down"></i>{" "}
                          {t("movieDetail.readMore")}
                        </>
                      )}
                    </button>
                  )}
                </>
              )}

              <div className="movie-detail-review-actions">
                <button
                  className="movie-detail-review-action-button"
                  onClick={() => handleReviewAction(review.id, "like")}
                >
                  <i className="fas fa-thumbs-up"></i> {review.likes}
                </button>
                <button
                  className="movie-detail-review-action-button"
                  onClick={() => handleReviewAction(review.id, "dislike")}
                >
                  <i className="fas fa-thumbs-down"></i> {review.dislikes}
                </button>
                {!review.isUserReview && (
                  <button
                    className="movie-detail-review-action-button"
                    onClick={() => handleReviewAction(review.id, "report")}
                  >
                    <i className="fas fa-flag"></i> {t("movieDetail.report")}
                  </button>
                )}
              </div>
            </div>
          ))}

          {hasMore && filter !== "user" && (
            <div className="movie-detail-load-more">
              <button
                className={`movie-detail-load-more-button ${
                  loading ? "loading" : ""
                }`}
                onClick={loadMoreReviews}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>{" "}
                    {t("common.loading")}
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus"></i>{" "}
                    {t("movieDetail.loadMoreReviews")}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="movie-detail-no-reviews">
          <i className="fas fa-comment-slash fa-3x"></i>
          <p>
            {filter === "user"
              ? t("reviews.noUserReviews") ||
                "No has escrito reseñas para esta película aún."
              : t("movieDetail.noReviewsAvailable")}
          </p>
          {filter === "user" && (
            <button
              className="movie-detail-add-first-review"
              onClick={handleNewReview}
            >
              <i className="fas fa-plus-circle"></i>{" "}
              {t("reviews.writeFirstReview") || "Escribe la primera reseña"}
            </button>
          )}
        </div>
      )}

      {/* Estilos adicionales para el sistema de reseñas */}
      <style jsx>{`
        /* Estilos para el formulario de reseñas */
        .movie-detail-review-form-container {
          background-color: rgba(30, 30, 40, 0.6);
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .movie-detail-review-form-title {
          margin-top: 0;
          margin-bottom: 16px;
          color: #fff;
          font-size: 1.2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 8px;
        }

        .movie-detail-form-group {
          margin-bottom: 16px;
        }

        .movie-detail-form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
        }

        .movie-detail-form-group input,
        .movie-detail-form-group textarea {
          width: 100%;
          padding: 10px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(20, 20, 30, 0.5);
          color: white;
          font-size: 0.95rem;
        }

        .movie-detail-form-group input:focus,
        .movie-detail-form-group textarea:focus {
          outline: none;
          border-color: #4f74e3;
          box-shadow: 0 0 0 2px rgba(79, 116, 227, 0.3);
        }

        .movie-detail-form-error {
          border-color: #e63946 !important;
        }

        .movie-detail-form-error-message {
          color: #e63946;
          font-size: 0.85rem;
          margin-top: 4px;
        }

        .movie-detail-rating-input {
          display: flex;
          gap: 8px;
        }

        .movie-detail-rating-star {
          font-size: 1.5rem;
          color: #999;
          cursor: pointer;
        }

        .movie-detail-rating-star.active {
          color: #ffc107;
        }

        .movie-detail-rating-star:hover {
          transform: scale(1.2);
        }

        .movie-detail-form-checkbox {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .movie-detail-form-checkbox input {
          width: auto;
        }

        .movie-detail-form-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 20px;
        }

        .movie-detail-cancel-button,
        .movie-detail-submit-button {
          padding: 8px 16px;
          border-radius: 4px;
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .movie-detail-cancel-button {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .movie-detail-cancel-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .movie-detail-submit-button {
          background: #4f74e3;
          color: white;
        }

        .movie-detail-submit-button:hover {
          background: #3a5bbf;
        }

        /* Estilos para botón de agregar reseña */
        .movie-detail-add-review-button {
          background-color: #4f74e3;
          color: white;
          border: none;
          padding: 8px 14px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .movie-detail-add-review-button:hover {
          background-color: #3a5bbf;
        }

        .movie-detail-review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Estilos para las reseñas del usuario */
        .movie-detail-user-review {
          border-left: 3px solid #4f74e3;
          background-color: rgba(79, 116, 227, 0.05);
        }

        .movie-detail-review-badge.movie-detail-review-user {
          background-color: #4f74e3;
          color: white;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.7rem;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .movie-detail-user-review-actions {
          display: flex;
          gap: 8px;
          margin-left: auto;
        }

        .movie-detail-user-review-edit,
        .movie-detail-user-review-delete {
          background: none;
          border: none;
          color: #888;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .movie-detail-user-review-edit:hover {
          color: #4f74e3;
          background-color: rgba(79, 116, 227, 0.1);
        }

        .movie-detail-user-review-delete:hover {
          color: #e63946;
          background-color: rgba(230, 57, 70, 0.1);
        }

        .movie-detail-add-first-review {
          background-color: #4f74e3;
          color: white;
          border: none;
          padding: 10px 18px;
          border-radius: 4px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          margin-top: 16px;
          transition: background-color 0.2s;
        }

        .movie-detail-add-first-review:hover {
          background-color: #3a5bbf;
        }

        .movie-detail-review-edited {
          font-style: italic;
          color: #888;
          font-size: 0.8rem;
        }

        .movie-detail-review-title {
          font-size: 1.05rem;
          margin: 10px 0;
        }

        /* Estilos mejorados para la advertencia de spoilers */
        .movie-detail-spoiler-warning {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background-color: rgba(30, 30, 40, 0.7);
          border-radius: 8px;
          border: 2px dashed rgba(255, 0, 0, 0.5);
          transition: all 0.3s ease;
          cursor: pointer;
          text-align: center;
        }

        .movie-detail-spoiler-warning:hover {
          background-color: rgba(40, 40, 50, 0.8);
          border-color: rgba(255, 0, 0, 0.8);
          transform: scale(1.02);
        }

        .movie-detail-spoiler-warning-icon {
          background-color: rgba(255, 0, 0, 0.1);
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
          border: 2px solid rgba(255, 0, 0, 0.2);
        }

        .movie-detail-spoiler-warning-icon i {
          color: #e63946;
          font-size: 24px;
          animation: pulse 2s infinite;
        }

        .movie-detail-spoiler-warning-title {
          font-size: 1.2rem;
          color: #ffffff;
          margin: 0 0 16px;
          font-weight: 600;
        }

        .movie-detail-spoiler-reveal-btn {
          background-color: rgba(230, 57, 70, 0.8);
          color: white;
          border: none;
          border-radius: 20px;
          padding: 10px 20px;
          font-weight: 500;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .movie-detail-spoiler-reveal-btn:hover {
          background-color: rgba(230, 57, 70, 1);
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        }

        .movie-detail-spoiler-reveal-btn i {
          font-size: 14px;
        }

        @keyframes pulse {
          0% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 0.6;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

Reviews.propTypes = {
  movieId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  mediaType: PropTypes.string,
};

export default Reviews;
