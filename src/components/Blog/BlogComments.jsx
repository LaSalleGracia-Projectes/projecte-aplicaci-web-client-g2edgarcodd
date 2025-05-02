import React, { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

// Textos por defecto para fallback
const defaultTexts = {
  comments: "Comentarios",
  photoOf: "Foto de",
  locale: "es-ES",
  reply: "Responder",
  beFirstToComment: "Sé el primero en comentar",
  leaveComment: "Dejar un comentario",
  name: "Nombre",
  email: "Correo electrónico",
  comment: "Comentario",
  namePlaceholder: "Tu nombre",
  emailPlaceholder: "Tu correo electrónico",
  commentPlaceholder: "Escribe tu comentario aquí...",
  fillAllFields: "Por favor, completa todos los campos",
  sending: "Enviando...",
  publishComment: "Publicar comentario",
};

function BlogComments({ comments, postId }) {
  // Usar el hook de idioma directamente
  const { t, language } = useLanguage();

  // Inicializar el estado con valores seguros
  const safeComments = Array.isArray(comments) ? comments : [];

  const [commentText, setCommentText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [localComments, setLocalComments] = useState(safeComments);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleCommentSubmit = (e) => {
    try {
      e.preventDefault();

      // Validaciones básicas
      if (!commentText.trim() || !authorName.trim() || !authorEmail.trim()) {
        setFormError(t("blog.fillAllFields"));
        return;
      }

      // Simular envío de comentario
      setIsSubmitting(true);
      setFormError("");

      setTimeout(() => {
        try {
          // Simular respuesta exitosa
          const newComment = {
            id: `comment${Date.now()}`,
            authorName: authorName.trim(),
            authorAvatar: "https://source.unsplash.com/random/60x60/?avatar",
            date: new Date().toISOString().split("T")[0],
            content: commentText.trim(),
            likes: 0,
          };

          setLocalComments([...localComments, newComment]);
          setCommentText("");
          setAuthorName("");
          setAuthorEmail("");
        } catch (error) {
          console.error("Error al añadir comentario:", error);
          setFormError("Error al enviar el comentario. Inténtalo de nuevo.");
        } finally {
          setIsSubmitting(false);
        }
      }, 1000);
    } catch (error) {
      console.error("Error en handleCommentSubmit:", error);
      setFormError("Error al procesar el formulario");
      setIsSubmitting(false);
    }
  };

  const handleLike = (commentId) => {
    try {
      setLocalComments(
        localComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, likes: (comment.likes || 0) + 1 }
            : comment
        )
      );
    } catch (error) {
      console.error("Error al dar like al comentario:", error);
    }
  };

  // Formatear fecha con manejo de errores
  const formatDate = (dateString) => {
    try {
      const options = { year: "numeric", month: "long", day: "numeric" };
      const locale = language || "es-ES";
      return new Date(dateString).toLocaleDateString(locale, options);
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return dateString; // Devolver la fecha sin formato en caso de error
    }
  };

  return (
    <div className="article-comments">
      <div className="article-comments-header">
        <h2 className="article-comments-title">
          <i className="far fa-comments"></i>
          {t("blog.comments")}{" "}
          <span className="article-comments-count">
            ({localComments.length})
          </span>
        </h2>
      </div>

      {/* Lista de comentarios */}
      {localComments.length > 0 ? (
        <div className="article-comments-list">
          {localComments.map((comment) => {
            // Verificamos que el comentario sea válido
            if (!comment || !comment.id) return null;

            return (
              <div key={comment.id} className="article-comment">
                <div className="article-comment-avatar">
                  <img
                    src={
                      comment.authorAvatar ||
                      "https://source.unsplash.com/random/60x60/?avatar"
                    }
                    alt={`${t("blog.photoOf")} ${
                      comment.authorName || "anónimo"
                    }`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://source.unsplash.com/random/60x60/?avatar";
                    }}
                  />
                </div>

                <div className="article-comment-content">
                  <div className="article-comment-header">
                    <h4 className="article-comment-author">
                      {comment.authorName || "Anónimo"}
                    </h4>
                    {comment.date && (
                      <span className="article-comment-date">
                        <i className="far fa-calendar-alt"></i>{" "}
                        {formatDate(comment.date)}
                      </span>
                    )}
                  </div>

                  <p className="article-comment-body">
                    {comment.content || ""}
                  </p>

                  <div className="article-comment-actions">
                    <button
                      className="article-comment-action article-comment-like"
                      onClick={() => handleLike(comment.id)}
                    >
                      <i className="far fa-heart"></i>
                      {comment.likes > 0 && (
                        <span className="article-comment-like-count">
                          {comment.likes}
                        </span>
                      )}
                    </button>

                    <button className="article-comment-action article-comment-reply">
                      <i className="fas fa-reply"></i>{" "}
                      <span>{t("blog.reply")}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="article-comments-empty">
          <i className="far fa-comment-dots"></i>
          <p>{t("blog.beFirstToComment")}</p>
        </div>
      )}

      {/* Formulario para nuevos comentarios */}
      <div className="article-comment-form-container">
        <h3 className="article-comment-form-title">{t("blog.leaveComment")}</h3>

        <form className="article-comment-form" onSubmit={handleCommentSubmit}>
          <div className="article-comment-form-grid">
            <div className="article-comment-form-group">
              <label htmlFor="author-name">
                {t("blog.name")} <span className="required">*</span>
              </label>
              <input
                type="text"
                id="author-name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                required
                placeholder={t("blog.namePlaceholder")}
              />
            </div>

            <div className="article-comment-form-group">
              <label htmlFor="author-email">
                {t("blog.email")} <span className="required">*</span>
              </label>
              <input
                type="email"
                id="author-email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                required
                placeholder={t("blog.emailPlaceholder")}
              />
            </div>
          </div>

          <div className="article-comment-form-group">
            <label htmlFor="comment-text">
              {t("blog.comment")} <span className="required">*</span>
            </label>
            <textarea
              id="comment-text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
              rows="5"
              placeholder={t("blog.commentPlaceholder")}
            ></textarea>
          </div>

          {formError && (
            <div className="article-comment-form-error">
              <i className="fas fa-exclamation-circle"></i> {formError}
            </div>
          )}

          <div className="article-comment-form-actions">
            <button
              type="submit"
              className="article-comment-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="submit-spinner"></div>
                  <span>{t("blog.sending")}</span>
                </>
              ) : (
                <>
                  <i className="far fa-paper-plane"></i>
                  <span>{t("blog.publishComment")}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BlogComments;
