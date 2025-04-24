import React from "react";
import MainLayout from "../layouts/MainLayout";
import { useLanguage } from "../contexts/LanguageContext";
import "../styles/components/legal.css";

function AdvertisingPage() {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="legal-container advertising-container">
        <div className="legal-header">
          <h1>{t("advertising.title")}</h1>
          <div className="legal-date">
            {t("legal.lastUpdated")}: 1 {t("advertising.updateMonth")}, 2025
          </div>
        </div>

        <div className="legal-content">
          <section className="legal-section">
            <h2>{t("advertising.opportunities.title")}</h2>
            <p>{t("advertising.opportunities.description")}</p>

            <div className="advertising-grid">
              <div className="advertising-card">
                <div className="advertising-card-icon">
                  <i className="fas fa-desktop fa-2x"></i>
                </div>
                <h3>{t("advertising.opportunities.displayAds.title")}</h3>
                <p>{t("advertising.opportunities.displayAds.description")}</p>
              </div>

              <div className="advertising-card">
                <div className="advertising-card-icon">
                  <i className="fas fa-handshake fa-2x"></i>
                </div>
                <h3>
                  {t("advertising.opportunities.brandCollaborations.title")}
                </h3>
                <p>
                  {t(
                    "advertising.opportunities.brandCollaborations.description"
                  )}
                </p>
              </div>

              <div className="advertising-card">
                <div className="advertising-card-icon">
                  <i className="fas fa-medal fa-2x"></i>
                </div>
                <h3>{t("advertising.opportunities.sponsorships.title")}</h3>
                <p>{t("advertising.opportunities.sponsorships.description")}</p>
              </div>

              <div className="advertising-card">
                <div className="advertising-card-icon">
                  <i className="fas fa-bullhorn fa-2x"></i>
                </div>
                <h3>
                  {t("advertising.opportunities.promotionalContent.title")}
                </h3>
                <p>
                  {t(
                    "advertising.opportunities.promotionalContent.description"
                  )}
                </p>
              </div>
            </div>
          </section>

          <section className="legal-section">
            <h2>{t("advertising.audience.title")}</h2>
            <p>{t("advertising.audience.description")}</p>

            <div className="audience-stats">
              <div className="audience-stat-card">
                <div className="stat-number">5M+</div>
                <div className="stat-label">
                  {t("advertising.audience.monthlyUsers")}
                </div>
              </div>

              <div className="audience-stat-card">
                <div className="stat-number">65%</div>
                <div className="stat-label">
                  {t("advertising.audience.ageRange")}
                </div>
              </div>

              <div className="audience-stat-card">
                <div className="stat-number">12M+</div>
                <div className="stat-label">
                  {t("advertising.audience.pageViews")}
                </div>
              </div>

              <div className="audience-stat-card">
                <div className="stat-number">8.5min</div>
                <div className="stat-label">
                  {t("advertising.audience.avgTimeOnPage")}
                </div>
              </div>
            </div>
          </section>

          <section className="legal-section">
            <h2>{t("advertising.formats.title")}</h2>
            <div className="ad-formats">
              <div className="ad-format-item">
                <h3>{t("advertising.formats.premium.title")}</h3>
                <div className="ad-format-specs">
                  <span>{t("advertising.formats.format")}: 970x250px</span>
                  <span>
                    {t("advertising.formats.location")}:{" "}
                    {t("advertising.formats.premium.location")}
                  </span>
                  <span>{t("advertising.formats.ctr")}: 0.8%</span>
                </div>
                <div className="ad-format-preview banner-preview"></div>
              </div>

              <div className="ad-format-item">
                <h3>{t("advertising.formats.sidebar.title")}</h3>
                <div className="ad-format-specs">
                  <span>{t("advertising.formats.format")}: 300x250px</span>
                  <span>
                    {t("advertising.formats.location")}:{" "}
                    {t("advertising.formats.sidebar.location")}
                  </span>
                  <span>{t("advertising.formats.ctr")}: 0.5%</span>
                </div>
                <div className="ad-format-preview sidebar-preview"></div>
              </div>

              <div className="ad-format-item">
                <h3>{t("advertising.formats.native.title")}</h3>
                <div className="ad-format-specs">
                  <span>
                    {t("advertising.formats.format")}:{" "}
                    {t("advertising.formats.native.format")}
                  </span>
                  <span>
                    {t("advertising.formats.location")}:{" "}
                    {t("advertising.formats.native.location")}
                  </span>
                  <span>{t("advertising.formats.ctr")}: 1.2%</span>
                </div>
                <div className="ad-format-preview native-preview"></div>
              </div>
            </div>
          </section>

          <section className="legal-section">
            <h2>{t("advertising.successStories.title")}</h2>
            <div className="success-stories">
              <div className="success-story">
                <div className="success-story-logo"></div>
                <blockquote>
                  "{t("advertising.successStories.netflix")}"
                </blockquote>
                <div className="success-story-author">- Netflix España</div>
              </div>

              <div className="success-story">
                <div className="success-story-logo"></div>
                <blockquote>"{t("advertising.successStories.hbo")}"</blockquote>
                <div className="success-story-author">- HBO Max</div>
              </div>
            </div>
          </section>

          <section className="legal-section contact-section">
            <h2>{t("advertising.contact.title")}</h2>
            <p>{t("advertising.contact.description")}</p>

            <div className="contact-cta">
              <a href="mailto:ads@streamhub.com" className="btn-primary">
                {t("advertising.contact.requestInfo")}
              </a>
              <div className="contact-info">
                <div>
                  <i className="fas fa-envelope"></i> ads@streamhub.com
                </div>
                <div>
                  <i className="fas fa-phone"></i> +34 91 123 45 68
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}

export default AdvertisingPage;
