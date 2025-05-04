import React, { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import PropTypes from "prop-types";
import "../../styles/components/moviedetail-enhanced.css";

function Reviews({ movieId }) {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, positive, negative
  const [showSpoilers, setShowSpoilers] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Generar reseñas de ejemplo para demostración
  useEffect(() => {
    // Simulamos una carga de datos de API
    setLoading(true);

    setTimeout(() => {
      const demoReviews = generateDemoReviews(movieId, page);

      if (page === 1) {
        setReviews(demoReviews);
      } else {
        setReviews((prev) => [...prev, ...demoReviews]);
      }

      setHasMore(page < 3); // Solo simulamos hasta 3 páginas
      setLoading(false);
    }, 800);
  }, [movieId, page]);

  // Función para generar reviews de demostración
  const generateDemoReviews = (movieId, page) => {
    const baseReviews = [
      {
        id: `${movieId}-review-${page}-1`,
        user: {
          id: "user1",
          name: "María García",
          avatar: "https://randomuser.me/api/portraits/women/44.jpg",
          isPremium: true,
        },
        rating: 4.5,
        date: "2023-11-15",
        content:
          "Me encantó esta película. La narrativa es impresionante y los efectos visuales son espectaculares. El director ha conseguido capturar perfectamente la esencia de la historia original. Los personajes están bien desarrollados y la actuación de todo el elenco es excelente. Definitivamente una de las mejores películas que he visto este año.",
        likes: 45,
        dislikes: 3,
        hasSpoilers: false,
      },
      {
        id: `${movieId}-review-${page}-2`,
        user: {
          id: "user2",
          name: "Carlos Rodríguez",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          isPremium: false,
        },
        rating: 3.0,
        date: "2023-11-10",
        content:
          "Una película aceptable, pero esperaba más. Algunos elementos de la trama son predecibles y el ritmo es inconsistente. Sin embargo, hay momentos brillantes y algunas actuaciones notables. Los efectos visuales son impresionantes, pero no compensan las deficiencias en la historia.",
        likes: 12,
        dislikes: 5,
        hasSpoilers: false,
      },
      {
        id: `${movieId}-review-${page}-3`,
        user: {
          id: "user3",
          name: "Laura Martínez",
          avatar: "https://randomuser.me/api/portraits/women/63.jpg",
          isPremium: false,
        },
        rating: 5.0,
        date: "2023-11-05",
        content:
          "¡ALERTA DE SPOILER! Al final descubrimos que el protagonista era en realidad el villano todo el tiempo. Este giro fue increíblemente bien ejecutado. La escena final donde se revela su verdadera identidad es cinematográfica pura. No podía creer que el director pudiera mantener este secreto hasta el climax de la película.",
        likes: 67,
        dislikes: 8,
        hasSpoilers: true,
      },
      {
        id: `${movieId}-review-${page}-4`,
        user: {
          id: "user4",
          name: "Alberto Sánchez",
          avatar: "https://randomuser.me/api/portraits/men/67.jpg",
          isPremium: true,
        },
        rating: 2.0,
        date: "2023-10-28",
        content:
          "Decepcionante. La película no cumplió con las expectativas generadas por los trailers. La trama tiene agujeros importantes y algunos personajes parecen innecesarios para la historia. El final fue abrupto y dejó muchas preguntas sin responder. No la recomendaría.",
        likes: 34,
        dislikes: 15,
        hasSpoilers: false,
      },
    ];

    // Modificar ligeramente las reviews para simular paginación
    return baseReviews.map((review) => ({
      ...review,
      id: `${review.id}-page-${page}`,
      date: new Date(
        new Date(review.date).setDate(
          new Date(review.date).getDate() - page * 5
        )
      )
        .toISOString()
        .split("T")[0],
      likes: review.likes - page * 3,
      content:
        page > 1
          ? `Reseña de la página ${page}: ${review.content}`
          : review.content,
    }));
  };

  // Filtrar las reseñas según el filtro activo
  const filteredReviews = reviews.filter((review) => {
    if (filter === "all") return true;
    if (filter === "positive") return review.rating >= 4;
    if (filter === "negative") return review.rating < 3;
    return true;
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
    // Aquí se implementaría la lógica real para like/dislike/report
    console.log(`Action ${action} on review ${reviewId}`);

    // Para demo, actualizamos localmente
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
  };

  return (
    <div className="movie-detail-reviews">
      <div className="movie-detail-review-header">
        <h3>
          <i className="fas fa-comment-alt"></i>
          {t("movieDetail.reviews")}
        </h3>
      </div>

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
            <div key={review.id} className="movie-detail-review-card">
              <div className="movie-detail-review-header-card">
                <img
                  src={review.user.avatar}
                  alt={review.user.name}
                  className="movie-detail-review-avatar"
                />
                <div className="movie-detail-review-user-info">
                  <div className="movie-detail-review-user-name">
                    <h4>{review.user.name}</h4>
                    {review.user.isPremium && (
                      <div className="movie-detail-review-badge movie-detail-review-premium">
                        <i className="fas fa-crown"></i> Premium
                      </div>
                    )}
                  </div>
                  <div className="movie-detail-review-date">
                    {new Date(review.date).toLocaleDateString()}
                  </div>
                </div>
              </div>

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
                    <i className="fas fa-exclamation-triangle"></i>
                    <p>{t("movieDetail.spoilerWarning")}</p>
                    <p>{t("movieDetail.clickToReveal")}</p>
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
                <button
                  className="movie-detail-review-action-button"
                  onClick={() => handleReviewAction(review.id, "report")}
                >
                  <i className="fas fa-flag"></i> {t("movieDetail.report")}
                </button>
              </div>
            </div>
          ))}

          {hasMore && (
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
                    <i className="fas fa-spinner"></i> {t("common.loading")}
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
          <p>{t("movieDetail.noReviewsAvailable")}</p>
        </div>
      )}
    </div>
  );
}

Reviews.propTypes = {
  movieId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Reviews;
