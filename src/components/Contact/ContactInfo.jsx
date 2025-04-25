import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";

const ContactInfo = () => {
  const { t } = useLanguage();

  const contactCards = [
    {
      icon: "fas fa-phone-alt",
      title: t("contact.phone"),
      content: "(+34) 934 567 890",
      index: 1,
    },
    {
      icon: "fas fa-fax",
      title: t("contact.fax"),
      content: "(+34) 934 567 891",
      index: 2,
    },
    {
      icon: "fas fa-envelope",
      title: t("contact.email"),
      content: "contacto@streamhub.com",
      index: 3,
    },
    {
      icon: "fas fa-map-marker-alt",
      title: t("contact.address"),
      content: t("contact.addressContent"),
      index: 4,
    },
  ];

  return (
    <>
      {contactCards.map((card) => (
        <div
          key={card.title}
          className="info-card"
          style={{ "--item-index": card.index }}
        >
          <div className="info-card-icon">
            <i className={card.icon}></i>
          </div>
          <h3 className="info-card-title">{card.title}</h3>
          <p className="info-card-content">{card.content}</p>
        </div>
      ))}
    </>
  );
};

export default ContactInfo;
