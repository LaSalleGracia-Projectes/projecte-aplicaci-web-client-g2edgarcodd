import React from "react";
import MainLayout from "../layouts/MainLayout";
import { useLanguage } from "../contexts/LanguageContext";
import "../styles/components/legal.css";

function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="legal-container">
        <div className="legal-header">
          <h1>{t("legal.privacy.title")}</h1>
          <div className="legal-date">
            {t("legal.lastUpdated")}: {t("legal.privacy.updateDate")}
          </div>
        </div>

        <div className="legal-content">
          <section className="legal-section">
            <h2>{t("legal.privacy.section1.title")}</h2>
            <p>{t("legal.privacy.section1.content")}</p>
          </section>

          <section className="legal-section">
            <h2>{t("legal.privacy.section2.title")}</h2>
            <p>{t("legal.privacy.section2.content")}</p>
          </section>

          <section className="legal-section">
            <h2>{t("legal.privacy.section3.title")}</h2>
            <p>{t("legal.privacy.section3.content")}</p>
          </section>

          <section className="legal-section">
            <h2>{t("legal.privacy.section4.title")}</h2>
            <p>{t("legal.privacy.section4.content")}</p>
          </section>

          <section className="legal-section">
            <h2>{t("legal.privacy.section5.title")}</h2>
            <p>{t("legal.privacy.section5.content")}</p>
          </section>

          <section className="legal-section">
            <h2>{t("legal.privacy.section6.title")}</h2>
            <p>{t("legal.privacy.section6.content")}</p>
          </section>

          <section className="legal-section">
            <h2>{t("legal.privacy.section7.title")}</h2>
            <p>{t("legal.privacy.section7.content")}</p>
          </section>

          <section className="legal-section">
            <h2>{t("legal.privacy.section8.title")}</h2>
            <p>{t("legal.privacy.section8.content")}</p>
          </section>

          <section className="legal-section">
            <h2>{t("legal.privacy.section9.title")}</h2>
            <p>{t("legal.privacy.section9.content")}</p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}

export default PrivacyPage;
