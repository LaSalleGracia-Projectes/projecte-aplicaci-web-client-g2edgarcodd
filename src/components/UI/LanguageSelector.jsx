import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

const LanguageSelector = () => {
  const { language, changeLanguage, t } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selectorRef = useRef(null);

  // Configuración de banderas para cada idioma
  const flags = {
    es: {
      icon: "es",
      name: "España",
    },
    ca: {
      icon: "cat",
      name: "Cataluña",
    },
    en: {
      icon: "gb",
      name: "Reino Unido",
    },
  };

  // Cerrar menú desplegable al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Función para seleccionar un idioma y cerrar el desplegable
  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setDropdownOpen(false);
  };

  return (
    <div
      className="language-selector"
      ref={selectorRef}
      aria-expanded={dropdownOpen}
    >
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="language-button"
        aria-label={t("common.language")}
      >
        <span className={`flag-icon flag-icon-${flags[language].icon}`}></span>
        <span className="language-name">{t(`languages.${language}`)}</span>
        <i className={`fas fa-chevron-${dropdownOpen ? "up" : "down"}`}></i>
      </button>

      {dropdownOpen && (
        <div className="language-dropdown">
          {Object.keys(flags).map((lang) => (
            <button
              key={lang}
              className={`language-item ${language === lang ? "active" : ""}`}
              onClick={() => handleLanguageChange(lang)}
            >
              <span
                className={`flag-icon flag-icon-${flags[lang].icon}`}
              ></span>
              <span>{t(`languages.${lang}`)}</span>
              {language === lang && <i className="fas fa-check"></i>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
