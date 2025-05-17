import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { getAvatarUrl } from "../../utils/avatar";

// Textos por defecto para fallback
const defaultTexts = {
  photoOf: "Foto de",
};

function BlogAuthor({ author }) {
  // Usar el hook de idioma directamente
  const { t } = useLanguage();

  // Garantizar que author existe y tiene las propiedades esperadas
  const safeAuthor = author || {};
  const safeSocialLinks = safeAuthor.socialLinks || {};

  return (
    <div className="article-author-container">
      <div className="article-author-card">
        <div className="article-author-header">
          <div className="article-author-avatar-container">
            <img
              src={getAvatarUrl(
                safeAuthor.avatar,
                safeAuthor.name || "autor",
                "micah"
              )}
              alt={`${t("blog.photoOf")} ${safeAuthor.name || "autor"}`}
              className="article-author-avatar"
            />
            <div className="article-author-avatar-glow"></div>
          </div>

          <div className="article-author-info">
            <div className="article-author-name-wrapper">
              <h3 className="article-author-name">
                {safeAuthor.name || "Autor"}
              </h3>
              <span className="article-author-role">
                {safeAuthor.role || ""}
              </span>
            </div>
          </div>
        </div>

        <p className="article-author-bio">
          {safeAuthor.bio || "Información sobre el autor no disponible."}
        </p>

        <div className="article-author-social">
          {safeSocialLinks.twitter && (
            <a
              href={safeSocialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="article-author-social-link twitter"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter"></i>
            </a>
          )}
          {safeSocialLinks.instagram && (
            <a
              href={safeSocialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="article-author-social-link instagram"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogAuthor;
