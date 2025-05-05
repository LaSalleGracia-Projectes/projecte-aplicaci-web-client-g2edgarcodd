import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";

function TabNavigation({ activeTab, onTabChange }) {
  const { t } = useLanguage();

  return (
    <div className="lists-tabs">
      <button
        className={`lists-tab ${activeTab === "favorites" ? "active" : ""}`}
        onClick={() => onTabChange("favorites")}
      >
        <i className="fas fa-heart"></i> {t("lists.favorites")}
      </button>
      <button
        className={`lists-tab ${activeTab === "lists" ? "active" : ""}`}
        onClick={() => onTabChange("lists")}
      >
        <i className="fas fa-list-ul"></i> {t("lists.myLists")}
      </button>
    </div>
  );
}

export default TabNavigation;
