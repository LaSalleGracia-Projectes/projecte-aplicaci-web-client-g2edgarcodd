import React from "react";
import MainLayout from "../layouts/MainLayout";
import { useLanguage } from "../contexts/LanguageContext";
import "../styles/components/legal.css";

function LegalPage() {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="legal-container">
        <div className="legal-header">
          <h1>{t("legal.info.title")}</h1>
          <div className="legal-date">
            {t("legal.lastUpdated")}: {t("legal.info.updateDate")}
          </div>
        </div>

        <div className="legal-content">
          <section className="legal-section">
            <h2>{t("legal.info.companyIdentification.title")}</h2>
            <p>Streamhub España S.L.</p>
            <ul className="legal-info-list">
              <li>
                <strong>{t("legal.info.companyIdentification.taxId")}:</strong>{" "}
                B12345678
              </li>
              <li>
                <strong>
                  {t("legal.info.companyIdentification.address")}:
                </strong>{" "}
                Plaça del Nord, 14, Gràcia, 08024 Barcelona
              </li>
              <li>
                <strong>{t("legal.info.companyIdentification.email")}:</strong>{" "}
                 info@streamhub.com
              </li>
              <li>
                <strong>{t("legal.info.companyIdentification.phone")}:</strong>{" "}
                +34 91 123 45 67
              </li>
              <li>
                <strong>
                  {t("legal.info.companyIdentification.registry")}:
                </strong>{" "}
                {t("legal.info.companyIdentification.registryDetails")}
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>{t("legal.info.intellectualProperty.title")}</h2>
            <p>{t("legal.info.intellectualProperty.content")}</p>
          </section>

          <section className="legal-section">
            <h2>{t("legal.info.termsOfUse.title")}</h2>
            <p>{t("legal.info.termsOfUse.content")}</p>
          </section>

          <section className="legal-section">
            <h2>{t("legal.info.liability.title")}</h2>
            <p>{t("legal.info.liability.content")}</p>
          </section>

          <section className="legal-section">
            <h2>{t("legal.info.thirdPartyLinks.title")}</h2>
            <p>{t("legal.info.thirdPartyLinks.content")}</p>
          </section>

          <section className="legal-section">
            <h2>{t("legal.info.applicableLaw.title")}</h2>
            <p>{t("legal.info.applicableLaw.content")}</p>
          </section>

          <section className="legal-section">
            <h2>{t("legal.info.changes.title")}</h2>
            <p>{t("legal.info.changes.content")}</p>
          </section>

          <section className="legal-section">
            <h2>{t("legal.info.communications.title")}</h2>
            <p>{t("legal.info.communications.content")}</p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}

export default LegalPage;
