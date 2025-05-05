import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import "../styles/components/languageSwitcher.css";

const LanguageSwitcher = ({ className = "", variant = "default" }) => {
  const { language, changeLanguage, t } = useLanguage();

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    changeLanguage(newLanguage);

    // Agregar animación de transición a los elementos del perfil
    const profileElements = document.querySelectorAll(".profile-content *");
    profileElements.forEach((el) => {
      el.classList.add("language-transition");
      setTimeout(() => el.classList.remove("language-transition"), 500);
    });
  };

  if (variant === "minimal") {
    return (
      <div className={`language-switcher-minimal ${className}`}>
        <select
          value={language}
          onChange={handleLanguageChange}
          aria-label={t("common.language")}
        >
          <option value="es">ES</option>
          <option value="ca">CA</option>
          <option value="en">EN</option>
        </select>
      </div>
    );
  }

  return (
    <div className={`language-switcher ${className}`}>
      <label htmlFor="language-select">{t("common.language")}:</label>
      <select
        id="language-select"
        value={language}
        onChange={handleLanguageChange}
      >
        <option value="es">{t("languages.es")}</option>
        <option value="ca">{t("languages.ca")}</option>
        <option value="en">{t("languages.en")}</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
