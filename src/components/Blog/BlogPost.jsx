import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import BlogAuthor from "./BlogAuthor";
import BlogComments from "./BlogComments";
import BlogRelatedPosts from "./BlogRelatedPosts";
import BlogToc from "./BlogToc";
import { useLanguage } from "../../contexts/LanguageContext";

function BlogPost({ post }) {
  // Usar el hook de idioma directamente
  const { t, language } = useLanguage();

  const [isHeaderFixed, setIsHeaderFixed] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const articleRef = useRef(null);
  const headerRef = useRef(null);

  // Para detectar cuándo fijar el encabezado y qué sección está activa
  useEffect(() => {
    if (!articleRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeaderFixed(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-100px 0px 0px 0px" }
    );

    observer.observe(headerRef.current);

    // Observador para secciones activas (para la tabla de contenidos)
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.2, rootMargin: "-100px 0px -70% 0px" }
    );

    // Observar todas las secciones h2
    try {
      const sections = articleRef.current.querySelectorAll("h2[id]");
      sections.forEach((section) => {
        sectionObserver.observe(section);
      });

      // Calcular el progreso de lectura
      const handleScroll = () => {
        if (!articleRef.current) return;

        const totalHeight = articleRef.current.clientHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const currentPosition = scrollTop + windowHeight;
        const articleOffset = articleRef.current.offsetTop;

        // Calcular posición relativa al artículo
        const relativePosition = currentPosition - articleOffset;

        // Calcular porcentaje de lectura
        let progress = (relativePosition / totalHeight) * 100;
        progress = Math.min(100, Math.max(0, progress)); // Limitar entre 0 y 100

        setReadingProgress(progress);
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        observer.disconnect();
        sectionObserver.disconnect();
        window.removeEventListener("scroll", handleScroll);
      };
    } catch (error) {
      console.error("Error en los observadores:", error);
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  // Compartir en redes sociales
  const handleShare = (platform) => {
    try {
      const url = window.location.href;
      const title = post.title;

      switch (platform) {
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
              title
            )}&url=${encodeURIComponent(url)}`,
            "_blank"
          );
          break;
        case "facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              url
            )}`,
            "_blank"
          );
          break;
        case "linkedin":
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              url
            )}`,
            "_blank"
          );
          break;
        case "whatsapp":
          window.open(
            `https://api.whatsapp.com/send?text=${encodeURIComponent(
              title + " " + url
            )}`,
            "_blank"
          );
          break;
        case "copy":
          navigator.clipboard
            .writeText(url)
            .then(() => {
              alert(t("blog.linkCopied"));
            })
            .catch((err) => {
              console.error("Error al copiar: ", err);
              alert("Error al copiar el enlace");
            });
          break;
        default:
          break;
      }

      setShowShareMenu(false);
    } catch (error) {
      console.error("Error al compartir:", error);
      setShowShareMenu(false);
    }
  };

  // Extraer los encabezados para la tabla de contenidos
  const extractToc = (content) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
      const headings = doc.querySelectorAll("h2[id]");

      return Array.from(headings).map((heading) => ({
        id: heading.id,
        text: heading.textContent,
      }));
    } catch (error) {
      console.error("Error al extraer tabla de contenidos:", error);
      return [];
    }
  };

  const tableOfContents = extractToc(post.content);

  // Formatear fecha
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
    <div className="article-post">
      {/* Hero Section con imagen de portada */}
      <div className="article-header" ref={headerRef}>
        <div
          className="article-header-bg"
          style={{ backgroundImage: `url(${post.coverImage})` }}
        ></div>

        <div className="article-header-content">
          <div className="article-categories">
            {post.categories &&
              post.categories.map((category, index) => (
                <span key={index} className="article-category">
                  {category}
                </span>
              ))}
          </div>

          <h1 className="article-title">{post.title}</h1>

          <div className="article-meta">
            <div className="article-meta-item article-date">
              <i className="far fa-calendar-alt"></i>
              <span>{formatDate(post.publishDate)}</span>
            </div>
            <div className="article-meta-item article-read-time">
              <i className="far fa-clock"></i>
              <span>
                {post.readTime} {t("blog.readTimeUnit")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de progreso de lectura */}
      <div
        className="article-progress-bar"
        style={{ width: `${readingProgress}%` }}
      ></div>

      {/* Navbar fija cuando se hace scroll */}
      <div className={`article-navbar ${isHeaderFixed ? "fixed" : ""}`}>
        <div className="article-navbar-content">
          <div className="article-navbar-title">
            {isHeaderFixed && <h2>{post.title}</h2>}
          </div>

          <div className="article-navbar-actions">
            <div className="article-share-wrapper">
              <button
                className="article-share-btn"
                onClick={() => setShowShareMenu(!showShareMenu)}
                aria-label={t("blog.shareArticle")}
              >
                <i className="fas fa-share-alt"></i>
                <span>{t("blog.share")}</span>
              </button>

              {showShareMenu && (
                <div className="article-share-menu">
                  <button
                    onClick={() => handleShare("twitter")}
                    className="share-twitter"
                    aria-label={t("blog.shareOn", { platform: "Twitter" })}
                  >
                    <i className="fab fa-twitter"></i>
                  </button>
                  <button
                    onClick={() => handleShare("facebook")}
                    className="share-facebook"
                    aria-label={t("blog.shareOn", { platform: "Facebook" })}
                  >
                    <i className="fab fa-facebook-f"></i>
                  </button>
                  <button
                    onClick={() => handleShare("linkedin")}
                    className="share-linkedin"
                    aria-label={t("blog.shareOn", { platform: "LinkedIn" })}
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </button>
                  <button
                    onClick={() => handleShare("whatsapp")}
                    className="share-whatsapp"
                    aria-label={t("blog.shareOn", { platform: "WhatsApp" })}
                  >
                    <i className="fab fa-whatsapp"></i>
                  </button>
                  <button
                    onClick={() => handleShare("copy")}
                    className="share-copy"
                    aria-label={t("blog.copyLink")}
                  >
                    <i className="fas fa-link"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="article-container">
        <div className="article-main">
          <div className="article-content-wrapper">
            {/* Contenido principal del artículo */}
            <article className="article-content" ref={articleRef}>
              <div className="article-excerpt">
                <p>{post.excerpt}</p>
              </div>

              <div
                className="article-body"
                dangerouslySetInnerHTML={{ __html: post.content }}
              ></div>

              {/* Tags del artículo - Ahora sin hipervínculos */}
              {post.tags && post.tags.length > 0 && (
                <div className="article-tags">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="article-tag">
                      <i className="fas fa-tag"></i> {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>

            {/* Información del autor */}
            <BlogAuthor author={post.author} />

            {/* Comentarios */}
            <BlogComments comments={post.comments} postId={post.id} />
          </div>

          <aside className="article-sidebar">
            {/* Tabla de contenidos */}
            {tableOfContents.length > 0 && (
              <BlogToc
                tableOfContents={tableOfContents}
                activeSection={activeSection}
              />
            )}

            {/* Artículos relacionados */}
            <BlogRelatedPosts relatedPosts={post.relatedPosts} />

            {/* Botón para compartir fijo */}
            <div className="article-sidebar-share">
              <h3>{t("blog.shareArticle")}</h3>
              <div className="article-sidebar-share-buttons">
                <button
                  onClick={() => handleShare("twitter")}
                  className="share-twitter"
                  aria-label={t("blog.shareOn", { platform: "Twitter" })}
                >
                  <i className="fab fa-twitter"></i>
                </button>
                <button
                  onClick={() => handleShare("facebook")}
                  className="share-facebook"
                  aria-label={t("blog.shareOn", { platform: "Facebook" })}
                >
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  className="share-linkedin"
                  aria-label={t("blog.shareOn", { platform: "LinkedIn" })}
                >
                  <i className="fab fa-linkedin-in"></i>
                </button>
                <button
                  onClick={() => handleShare("whatsapp")}
                  className="share-whatsapp"
                  aria-label={t("blog.shareOn", { platform: "WhatsApp" })}
                >
                  <i className="fab fa-whatsapp"></i>
                </button>
                <button
                  onClick={() => handleShare("copy")}
                  className="share-copy"
                  aria-label={t("blog.copyLink")}
                >
                  <i className="fas fa-link"></i>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default BlogPost;
