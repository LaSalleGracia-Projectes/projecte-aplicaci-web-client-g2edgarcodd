import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";

// Textos por defecto para fallback
const defaultTexts = {
  relatedPosts: "Publicaciones relacionadas",
  locale: "es-ES",
};

function BlogRelatedPosts({ relatedPosts }) {
  // Usar el hook de idioma directamente
  const { t, language } = useLanguage();

  // Validamos que relatedPosts sea un array
  const safeRelatedPosts = Array.isArray(relatedPosts) ? relatedPosts : [];

  if (safeRelatedPosts.length === 0) return null;

  // Formatear fecha con manejo de errores
  const formatDate = (dateString) => {
    try {
      const options = { year: "numeric", month: "short", day: "numeric" };
      const locale = language || "es-ES";
      return new Date(dateString).toLocaleDateString(locale, options);
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return dateString; // Devolver la fecha sin formato en caso de error
    }
  };

  return (
    <div className="article-sidebar-section">
      <div className="article-sidebar-header">
        <i className="fas fa-newspaper article-sidebar-icon"></i>
        <h3 className="article-sidebar-title">{t("blog.relatedPosts")}</h3>
      </div>

      <div className="article-sidebar-related">
        {safeRelatedPosts.map((post) => {
          // Garantizamos que cada post tenga las propiedades necesarias
          if (!post || !post.id) return null;

          return (
            <div className="article-related-post" key={post.id}>
              <Link
                to={`/blog/${post.id}`}
                className="article-related-post-link"
              >
                <div className="article-related-post-image-container">
                  <img
                    src={
                      post.coverImage ||
                      "/assets/images/placeholders/blog-placeholder.jpg"
                    }
                    alt={post.title || ""}
                    className="article-related-post-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "/assets/images/placeholders/blog-placeholder.jpg";
                    }}
                  />
                </div>
                <div className="article-related-post-content">
                  <h4 className="article-related-post-title">
                    {post.title || "Sin título"}
                  </h4>
                  <p className="article-related-post-excerpt">
                    {post.excerpt || ""}
                  </p>
                  <div className="article-related-post-meta">
                    {post.publishDate && (
                      <span className="article-related-post-date">
                        <i className="far fa-calendar-alt"></i>{" "}
                        {formatDate(post.publishDate)}
                      </span>
                    )}
                    {post.readTime && (
                      <span className="article-related-post-reading-time">
                        <i className="far fa-clock"></i> {post.readTime}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BlogRelatedPosts;
