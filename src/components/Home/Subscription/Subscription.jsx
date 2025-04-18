import React, { useState } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";
import "../../../styles/components/subscription.css";

function Subscription() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { t } = useLanguage();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset states
    setError("");

    // Validate email
    if (!email) {
      setError(t("subscription.errorEmptyEmail"));
      return;
    }

    if (!validateEmail(email)) {
      setError(t("subscription.errorInvalidEmail"));
      return;
    }

    // Simulation of successful subscription
    setSubmitted(true);

    // Here you would typically make an API call to handle the subscription
    console.log("Subscribed with email:", email);
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        <h2 className="newsletter-title">{t("subscription.title")}</h2>
        <p className="newsletter-description">
          {t("subscription.description")}
        </p>

        {submitted ? (
          <div className="newsletter-success-message">
            <i className="fas fa-check-circle"></i>
            <p>
              {t("subscription.successTitle")}{" "}
              {t("subscription.successMessage")}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="newsletter-form">
            <div className="newsletter-input-group">
              <input
                type="email"
                placeholder={t("subscription.placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={
                  error
                    ? "newsletter-input newsletter-input-error"
                    : "newsletter-input"
                }
              />
              <button type="submit" className="newsletter-submit-btn">
                {t("subscription.subscribe")}{" "}
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            {error && <p className="newsletter-error-message">{error}</p>}
          </form>
        )}

        <div className="newsletter-benefits">
          <div className="newsletter-benefit">
            <i className="fas fa-bell"></i>
            <span>{t("subscription.benefits.notifications")}</span>
          </div>
          <div className="newsletter-benefit">
            <i className="fas fa-gift"></i>
            <span>{t("subscription.benefits.exclusiveContent")}</span>
          </div>
          <div className="newsletter-benefit">
            <i className="fas fa-tag"></i>
            <span>{t("subscription.benefits.specialOffers")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Subscription;
