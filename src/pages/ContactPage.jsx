import React from "react";
import MainLayout from "../layouts/MainLayout";
import { ContactForm, ContactInfo, ContactMap } from "../components/Contact";
import { useLanguage } from "../contexts/LanguageContext";
import "../styles/components/contact.css";

const ContactPage = () => {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <section className="contact-page">
        <div className="contact-background">
          <div className="bg-gradient-1"></div>
          <div className="bg-gradient-2"></div>
        </div>

        <div className="contact-container">
          <div className="contact-header">
            <h1 className="contact-title">{t("contact.title")}</h1>
            <p className="contact-subtitle">{t("contact.subtitle")}</p>
          </div>

          <div className="contact-cards-grid">
            <ContactInfo />
          </div>

          <div className="contact-main-area">
            <div className="contact-form-wrapper">
              <ContactForm />
            </div>
            <div className="contact-map-wrapper">
              <ContactMap />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ContactPage;
