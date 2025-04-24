import React from "react";
import MainLayout from "../layouts/MainLayout";
import { useLanguage } from "../contexts/LanguageContext";
import "../styles/components/legal.css";

function CookiesPage() {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="legal-container">
        <div className="legal-header">
          <h1>{t("legal.cookies.title")}</h1>
          <div className="legal-date">
            {t("legal.lastUpdated")}: {t("legal.cookies.updateDate")}
          </div>
        </div>

        <div className="legal-content">
          <section className="legal-section">
            <h2>{t("legal.cookies.section1.title")}</h2>
            <p>{t("legal.cookies.section1.content")}</p>
          </section>

          <section className="legal-section">
            <h2>{t("legal.cookies.section2.title")}</h2>
            <div className="legal-subsection">
              <h3>{t("legal.cookies.section2.essential.title")}</h3>
              <p>{t("legal.cookies.section2.essential.content")}</p>
            </div>

            <div className="legal-subsection">
              <h3>{t("legal.cookies.section2.analytics.title")}</h3>
              <p>{t("legal.cookies.section2.analytics.content")}</p>
            </div>

            <div className="legal-subsection">
              <h3>{t("legal.cookies.section2.functional.title")}</h3>
              <p>{t("legal.cookies.section2.functional.content")}</p>
            </div>

            <div className="legal-subsection">
              <h3>{t("legal.cookies.section2.advertising.title")}</h3>
              <p>{t("legal.cookies.section2.advertising.content")}</p>
            </div>
          </section>

          <section className="legal-section">
            <h2>{t("legal.cookies.section3.title")}</h2>
            <p>{t("legal.cookies.section3.content")}</p>

            <div className="cookie-preferences-panel">
              <h3>{t("legal.cookies.preferencesPanel.title")}</h3>
              <div className="cookie-preference-options">
                <div className="cookie-option">
                  <label className="switch">
                    <input type="checkbox" checked disabled />
                    <span className="slider round"></span>
                  </label>
                  <div className="cookie-option-text">
                    <span>{t("legal.cookies.preferencesPanel.essential")}</span>
                    <span className="cookie-option-required">
                      {t("legal.cookies.preferencesPanel.required")}
                    </span>
                  </div>
                </div>

                <div className="cookie-option">
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider round"></span>
                  </label>
                  <div className="cookie-option-text">
                    <span>{t("legal.cookies.preferencesPanel.analytics")}</span>
                  </div>
                </div>

                <div className="cookie-option">
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider round"></span>
                  </label>
                  <div className="cookie-option-text">
                    <span>
                      {t("legal.cookies.preferencesPanel.functional")}
                    </span>
                  </div>
                </div>

                <div className="cookie-option">
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider round"></span>
                  </label>
                  <div className="cookie-option-text">
                    <span>
                      {t("legal.cookies.preferencesPanel.advertising")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="cookie-buttons">
                <button className="btn-secondary">
                  {t("legal.cookies.preferencesPanel.rejectAll")}
                </button>
                <button className="btn-primary">
                  {t("legal.cookies.preferencesPanel.savePreferences")}
                </button>
              </div>
            </div>
          </section>

          <section className="legal-section">
            <h2>{t("legal.cookies.section4.title")}</h2>
            <p>{t("legal.cookies.section4.content")}</p>
          </section>

          <section className="legal-section">
            <h2>{t("legal.cookies.section5.title")}</h2>
            <p>
              {t("legal.cookies.section5.content", {
                email: "cookies@streamhub.com",
              })}
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}

export default CookiesPage;
