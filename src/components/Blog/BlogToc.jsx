import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";

function BlogToc({ tableOfContents, activeSection }) {
  // Usar el hook de idioma directamente
  const { t } = useLanguage();

  // Si no hay tabla de contenidos, no mostrar nada
  if (!tableOfContents || tableOfContents.length === 0) {
    return null;
  }

  // Manejar clic en un encabezado
  const handleHeadingClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  // Calcular el porcentaje de progreso de lectura
  const calculateProgress = () => {
    if (!activeSection || tableOfContents.length === 0) return 0;

    const activeIndex = tableOfContents.findIndex(
      (item) => item.id === activeSection
    );
    if (activeIndex === -1) return 0;

    return Math.round(((activeIndex + 1) / tableOfContents.length) * 100);
  };

  return (
    <div className="article-sidebar-section article-toc-container">
      <div className="article-sidebar-header">
        <i className="fas fa-list article-sidebar-icon"></i>
        <h3 className="article-sidebar-title">
          {t("blog.tableOfContents", "Tabla de contenidos")}
        </h3>
      </div>

      <nav className="article-toc">
        <ul className="article-toc-list">
          {tableOfContents.map((item) => (
            <li
              key={item.id}
              className={`article-toc-item ${
                activeSection === item.id ? "active" : ""
              }`}
            >
              <a
                href={`#${item.id}`}
                className="article-toc-link"
                onClick={(e) => handleHeadingClick(e, item.id)}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="article-reading-progress">
        <div className="article-reading-progress-header">
          <h4 className="article-reading-progress-title">
            {t("blog.readingProgress", "Progreso de lectura")}
          </h4>
          <span className="article-reading-progress-percentage">
            {calculateProgress()}%
          </span>
        </div>
        <div className="article-reading-progress-bar">
          <div
            className="article-reading-progress-value"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default BlogToc;
