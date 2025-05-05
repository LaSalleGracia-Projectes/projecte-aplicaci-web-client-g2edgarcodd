import React, { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

const ContactForm = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [formState, setFormState] = useState({
    isSubmitting: false,
    status: null, // 'success', 'error', null
    errors: {},
  });

  const [inputStates, setInputStates] = useState({
    name: false,
    email: false,
    phone: false,
    subject: false,
    message: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setInputStates((prev) => ({
      ...prev,
      [name]: value.trim() !== "",
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = t("contact.nameRequired");
    }

    if (!formData.email.trim()) {
      errors.email = t("contact.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t("contact.emailInvalid");
    }

    if (!formData.subject.trim()) {
      errors.subject = t("contact.subjectRequired");
    }

    if (!formData.message.trim()) {
      errors.message = t("contact.messageRequired");
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormState((prev) => ({
        ...prev,
        errors,
      }));
      return;
    }

    setFormState((prev) => ({
      ...prev,
      isSubmitting: true,
      errors: {},
    }));

    setTimeout(() => {
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        status: "success",
      }));

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setInputStates({
        name: false,
        email: false,
        phone: false,
        subject: false,
        message: false,
      });

      setTimeout(() => {
        setFormState((prev) => ({
          ...prev,
          status: null,
        }));
      }, 5000);
    }, 1800);
  };

  return (
    <div className="form-container">
      <div className="form-heading">
        <h2>{t("contact.subtitle")}</h2>
      </div>

      {formState.status === "success" && (
        <div className="form-success-message">
          <i className="fas fa-check-circle"></i>
          <p>{t("contact.messageSent")}</p>
        </div>
      )}

      {formState.status === "error" && (
        <div className="form-error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>{t("contact.errorSending")}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div
            className={`form-group ${inputStates.name ? "has-value" : ""} ${
              formState.errors.name ? "has-error" : ""
            }`}
          >
            <label className="form-label">
              <span className="label-icon">
                <i className="fas fa-user"></i>
              </span>
              {t("contact.name")}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              placeholder={t("contact.namePlaceholder")}
              required
            />
            {formState.errors.name && (
              <div className="error-message">{formState.errors.name}</div>
            )}
          </div>

          <div
            className={`form-group ${inputStates.email ? "has-value" : ""} ${
              formState.errors.email ? "has-error" : ""
            }`}
          >
            <label className="form-label">
              <span className="label-icon">
                <i className="fas fa-envelope"></i>
              </span>
              {t("contact.email")}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder={t("contact.emailPlaceholder")}
              required
            />
            {formState.errors.email && (
              <div className="error-message">{formState.errors.email}</div>
            )}
          </div>
        </div>

        <div className={`form-group ${inputStates.phone ? "has-value" : ""}`}>
          <label className="form-label">
            <span className="label-icon">
              <i className="fas fa-phone"></i>
            </span>
            {t("contact.phone")}
            <span className="optional-badge">{t("common.optional")}</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-control"
            placeholder={t("contact.phonePlaceholder")}
          />
        </div>

        <div
          className={`form-group ${inputStates.subject ? "has-value" : ""} ${
            formState.errors.subject ? "has-error" : ""
          }`}
        >
          <label className="form-label">
            <span className="label-icon">
              <i className="fas fa-tag"></i>
            </span>
            {t("contact.subject")}
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="form-control"
            placeholder={t("contact.subjectPlaceholder")}
            required
          />
          {formState.errors.subject && (
            <div className="error-message">{formState.errors.subject}</div>
          )}
        </div>

        <div
          className={`form-group ${inputStates.message ? "has-value" : ""} ${
            formState.errors.message ? "has-error" : ""
          }`}
        >
          <label className="form-label">
            <span className="label-icon">
              <i className="fas fa-comment-alt"></i>
            </span>
            {t("contact.message")}
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="form-control"
            placeholder={t("contact.messagePlaceholder")}
            rows="5"
            required
          ></textarea>
          {formState.errors.message && (
            <div className="error-message">{formState.errors.message}</div>
          )}
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? (
            <>
              <span className="spinner"></span>
              <span>{t("common.sending")}</span>
            </>
          ) : (
            <>
              <i className="fas fa-paper-plane"></i>
              <span>{t("contact.send")}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
