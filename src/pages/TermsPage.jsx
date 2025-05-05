import React from "react";
import MainLayout from "../layouts/MainLayout";
import { useLanguage } from "../contexts/LanguageContext";
import "../styles/components/legal.css";

function TermsPage() {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="legal-container">
        <div className="legal-header">
          <h1>{t("legal.terms.title")}</h1>
          <div className="legal-date">
            {t("legal.lastUpdated")}: {t("legal.terms.updateDate")}
          </div>
        </div>

        <div className="legal-content">
          <section className="legal-section">
            <h2>{t("legal.terms.acceptance.title")}</h2>
            <p>{t("legal.terms.acceptance.content")}</p>
          </section>

          <section className="legal-section">
            <h2>{t("legal.terms.changes.title")}</h2>
            <p>{t("legal.terms.changes.content")}</p>
          </section>

          <section className="legal-section">
            <h2>{t("legal.terms.accounts.title")}</h2>
            <p>{t("legal.terms.accounts.content")}</p>
          </section>

          <section className="legal-section">
            <h2>{t("legal.terms.userContent.title")}</h2>
            <p>{t("legal.terms.userContent.content")}</p>
          </section>

          <section className="legal-section">
            <h2>{t("legal.terms.intellectualProperty.title")}</h2>
            <p>{t("legal.terms.intellectualProperty.content")}</p>
          </section>

          <section className="legal-section">
            <h2>{t("legal.terms.links.title")}</h2>
            <p>{t("legal.terms.links.content")}</p>
          </section>

          <section className="legal-section">
            <h2>{t("legal.terms.termination.title")}</h2>
            <p>{t("legal.terms.termination.content")}</p>
          </section>

          <section className="legal-section">
            <h2>{t("legal.terms.liability.title")}</h2>
            <p>{t("legal.terms.liability.content")}</p>
          </section>

          <section className="legal-section">
            <h2>{t("legal.terms.applicableLaw.title")}</h2>
            <p>{t("legal.terms.applicableLaw.content")}</p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}

export default TermsPage;
