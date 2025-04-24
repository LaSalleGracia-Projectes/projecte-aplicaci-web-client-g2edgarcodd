import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useLanguage } from "../contexts/LanguageContext";
import "../styles/components/legal.css";

function FAQPage() {
  const [openItems, setOpenItems] = useState({});
  const { t } = useLanguage();

  const toggleItem = (id) => {
    setOpenItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const faqCategories = [
    {
      id: "cuenta",
      title: t("legal.faq.categories.account"),
      items: [
        {
          id: "cuenta-1",
          question: t("legal.faq.account.q1"),
          answer: t("legal.faq.account.a1"),
        },
        {
          id: "cuenta-2",
          question: t("legal.faq.account.q2"),
          answer: t("legal.faq.account.a2"),
        },
        {
          id: "cuenta-3",
          question: t("legal.faq.account.q3"),
          answer: t("legal.faq.account.a3"),
        },
        {
          id: "cuenta-4",
          question: t("legal.faq.account.q4"),
          answer: t("legal.faq.account.a4"),
        },
      ],
    },
    {
      id: "contenido",
      title: t("legal.faq.categories.content"),
      items: [
        {
          id: "contenido-1",
          question: t("legal.faq.content.q1"),
          answer: t("legal.faq.content.a1"),
        },
        {
          id: "contenido-2",
          question: t("legal.faq.content.q2"),
          answer: t("legal.faq.content.a2"),
        },
        {
          id: "contenido-3",
          question: t("legal.faq.content.q3"),
          answer: t("legal.faq.content.a3"),
        },
        {
          id: "contenido-4",
          question: t("legal.faq.content.q4"),
          answer: t("legal.faq.content.a4"),
        },
      ],
    },
    {
      id: "tecnico",
      title: t("legal.faq.categories.technical"),
      items: [
        {
          id: "tecnico-1",
          question: t("legal.faq.technical.q1"),
          answer: t("legal.faq.technical.a1"),
        },
        {
          id: "tecnico-2",
          question: t("legal.faq.technical.q2"),
          answer: t("legal.faq.technical.a2"),
        },
        {
          id: "tecnico-3",
          question: t("legal.faq.technical.q3"),
          answer: t("legal.faq.technical.a3"),
        },
        {
          id: "tecnico-4",
          question: t("legal.faq.technical.q4"),
          answer: t("legal.faq.technical.a4"),
        },
      ],
    },
    {
      id: "privacidad",
      title: t("legal.faq.categories.privacy"),
      items: [
        {
          id: "privacidad-1",
          question: t("legal.faq.privacy.q1"),
          answer: t("legal.faq.privacy.a1"),
        },
        {
          id: "privacidad-2",
          question: t("legal.faq.privacy.q2"),
          answer: t("legal.faq.privacy.a2"),
        },
        {
          id: "privacidad-3",
          question: t("legal.faq.privacy.q3"),
          answer: t("legal.faq.privacy.a3"),
        },
      ],
    },
  ];

  return (
    <MainLayout>
      <div className="legal-container faq-container">
        <div className="legal-header">
          <h1>{t("legal.faq.title")}</h1>
          <div className="legal-date">
            {t("legal.lastUpdated")}: {t("legal.faq.updateDate")}
          </div>
        </div>

        <div className="faq-search">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input type="text" placeholder={t("legal.faq.searchPlaceholder")} />
            <button className="btn-primary">{t("common.search")}</button>
          </div>
        </div>

        <div className="faq-content">
          <div className="faq-sidebar">
            <h3>{t("legal.faq.categories.title")}</h3>
            <ul>
              {faqCategories.map((category) => (
                <li key={category.id}>
                  <a href={`#${category.id}`}>{category.title}</a>
                </li>
              ))}
            </ul>

            <div className="faq-contact-info">
              <h3>{t("legal.faq.noAnswer")}</h3>
              <p>{t("legal.faq.supportAvailable")}</p>
              <a href="/contact" className="btn-secondary">
                {t("legal.faq.contactSupport")}
              </a>
            </div>
          </div>

          <div className="faq-main">
            {faqCategories.map((category) => (
              <section
                key={category.id}
                id={category.id}
                className="faq-category"
              >
                <h2>{category.title}</h2>
                <div className="faq-items">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className={`faq-item ${openItems[item.id] ? "open" : ""}`}
                    >
                      <div
                        className="faq-question"
                        onClick={() => toggleItem(item.id)}
                      >
                        <h3>{item.question}</h3>
                        <div className="faq-toggle">
                          <i
                            className={`fas fa-chevron-${
                              openItems[item.id] ? "up" : "down"
                            }`}
                          ></i>
                        </div>
                      </div>
                      <div className="faq-answer">
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <div className="faq-feedback">
          <h3>{t("legal.faq.feedbackQuestion")}</h3>
          <div className="feedback-buttons">
            <button className="btn-outline">
              <i className="far fa-thumbs-up"></i> {t("legal.faq.yes")}
            </button>
            <button className="btn-outline">
              <i className="far fa-thumbs-down"></i> {t("legal.faq.no")}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default FAQPage;
