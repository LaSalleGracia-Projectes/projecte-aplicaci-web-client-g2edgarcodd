import React, { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useLocation } from "react-router-dom";

function ExploreFilters({
  sortOptions,
  currentSort,
  onSortChange,
  viewMode,
  onViewModeChange,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { t } = useLanguage();
  const location = useLocation();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Función para construir la URL con el nuevo parámetro de ordenación
  const getSortUrl = (sortId) => {
    const path = location.pathname;
    // Recuperar el valor del género actual de los parámetros de URL
    const urlParams = new URLSearchParams(window.location.search);
    const genreParam = urlParams.get("genre") || "all";

    return `${path}?genre=${genreParam}&sort=${sortId}`;
  };

  return (
    <div className="explore-filters">
      <div className="filters-left">
        <div className="sort-dropdown">
          <button
            className="sort-button"
            onClick={toggleDropdown}
            aria-expanded={dropdownOpen}
          >
            <i className="fas fa-sort"></i>
            <span>{t("explore.sortBy")}: </span>
            <strong>
              {sortOptions.find((opt) => opt.id === currentSort)?.name}
            </strong>
            <i
              className={`fas fa-chevron-down ${dropdownOpen ? "open" : ""}`}
            ></i>
          </button>

          {dropdownOpen && (
            <div className="dropdown-menu">
              {sortOptions.map((option) => (
                <a
                  key={option.id}
                  href={getSortUrl(option.id)}
                  className={`dropdown-item ${
                    currentSort === option.id ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setDropdownOpen(false);
                    onSortChange(option.id);
                  }}
                >
                  <span>{option.name}</span>
                  {currentSort === option.id && (
                    <i className="fas fa-check"></i>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="filters-right">
        <button
          className={`view-mode-button ${viewMode === "grid" ? "active" : ""}`}
          onClick={() => viewMode !== "grid" && onViewModeChange("grid")}
          title={t("explore.gridView")}
          aria-label={t("explore.gridView")}
        >
          <i className="fas fa-th-large"></i>
        </button>
        <button
          className={`view-mode-button ${viewMode === "list" ? "active" : ""}`}
          onClick={() => viewMode !== "list" && onViewModeChange("list")}
          title={t("explore.listView")}
          aria-label={t("explore.listView")}
        >
          <i className="fas fa-list"></i>
        </button>
      </div>
    </div>
  );
}

export default ExploreFilters;
