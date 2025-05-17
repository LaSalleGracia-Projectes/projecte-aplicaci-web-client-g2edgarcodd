import React, { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

function ProfileSettings({ userData }) {
  const { t } = useLanguage();
  const [settings, setSettings] = useState({
    fullName: userData.fullName || "",
    email: userData.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    language: userData.language || "es",
    notifications: {
      newsletter: userData.notifications?.newsletter !== false,
      newContent: userData.notifications?.newContent !== false,
      recommendations: userData.notifications?.recommendations !== false,
    },
    privacy: {
      publicProfile: userData.privacy?.publicProfile !== false,
      showActivity: userData.privacy?.showActivity !== false,
      shareWatchlist: userData.privacy?.shareWatchlist === true,
    },
  });

  const [activeSection, setActiveSection] = useState("profile");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "newPassword") {
      evaluatePasswordStrength(value);
    }

    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const evaluatePasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength("");
      return;
    }

    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const isLongEnough = password.length >= 8;

    if (isLongEnough && hasNumber && hasSpecial && hasUpperCase) {
      setPasswordStrength("fuerte");
    } else if (
      (isLongEnough && hasNumber) ||
      (isLongEnough && hasSpecial) ||
      (hasNumber && hasSpecial)
    ) {
      setPasswordStrength("media");
    } else {
      setPasswordStrength("débil");
    }
  };

  const handleCheckboxChange = (section, name) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: !prev[section][name],
      },
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      setSuccessMessage(t("profile.profileUpdatedSuccess"));
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      setErrorMessage(
        error.response?.data?.message || t("profile.errorUpdatingProfile")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (settings.newPassword !== settings.confirmPassword) {
      setErrorMessage(t("profile.passwordsDontMatch"));
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      setSettings((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      setPasswordStrength("");
      setSuccessMessage(t("profile.passwordChangedSuccess"));
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      setErrorMessage(
        error.response?.data?.message || t("profile.errorChangingPassword")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      setSuccessMessage(t("profile.preferencesUpdatedSuccess"));
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error al actualizar preferencias:", error);
      setErrorMessage(
        error.response?.data?.message || t("profile.errorUpdatingPreferences")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm(t("profile.confirmCancelSubscription"))) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      setSuccessMessage(t("profile.subscriptionCanceledSuccess"));
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error al cancelar suscripción:", error);
      setErrorMessage(
        error.response?.data?.message || t("profile.errorCancelingSubscription")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-settings animate-fade-in">
      <div className="settings-sidebar">
        <h3 className="settings-title">{t("profile.configTitle")}</h3>
        <ul className="settings-menu">
          <li className={activeSection === "profile" ? "active" : ""}>
            <button onClick={() => setActiveSection("profile")}>
              <i className="fas fa-user"></i> {t("profile.personalInfo")}
            </button>
          </li>
          <li className={activeSection === "security" ? "active" : ""}>
            <button onClick={() => setActiveSection("security")}>
              <i className="fas fa-lock"></i> {t("profile.security")}
            </button>
          </li>
          <li className={activeSection === "preferences" ? "active" : ""}>
            <button onClick={() => setActiveSection("preferences")}>
              <i className="fas fa-sliders-h"></i> {t("profile.preferences")}
            </button>
          </li>
          <li className={activeSection === "subscription" ? "active" : ""}>
            <button onClick={() => setActiveSection("subscription")}>
              <i className="fas fa-credit-card"></i> {t("profile.subscription")}
            </button>
          </li>
        </ul>
      </div>

      <div className="settings-content">
        {successMessage && (
          <div className="success-message">
            <i className="fas fa-check-circle"></i>
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <span>{errorMessage}</span>
          </div>
        )}

        {activeSection === "profile" && (
          <div className="settings-section">
            <h2 className="section-title">{t("profile.editProfile")}</h2>
            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">{t("profile.fullName")}</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={settings.fullName}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">{t("profile.email")}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={settings.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="language">{t("profile.language")}</label>
                <select
                  id="language"
                  name="language"
                  value={settings.language}
                  onChange={handleInputChange}
                  className="form-select"
                  disabled={isSubmitting}
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="ca">Català</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>{" "}
                    {t("profile.saving")}
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i> {t("profile.saveChanges")}
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {activeSection === "security" && (
          <div className="settings-section">
            <h2 className="section-title">{t("profile.changePassword")}</h2>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label htmlFor="currentPassword">
                  {t("profile.currentPassword")}
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={settings.currentPassword}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">{t("profile.newPassword")}</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={settings.newPassword}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  disabled={isSubmitting}
                />
                {passwordStrength && (
                  <div className={`password-strength ${passwordStrength}`}>
                    <span>
                      {t(`profile.passwordStrength.${passwordStrength}`)}
                    </span>
                    <div className="strength-bar">
                      <div
                        className={`strength-indicator ${passwordStrength}`}
                      ></div>
                    </div>
                  </div>
                )}
                <p className="input-hint">
                  {t("profile.passwordRequirements")}
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  {t("profile.confirmNewPassword")}
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={settings.confirmPassword}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>{" "}
                    {t("profile.updating")}
                  </>
                ) : (
                  <>
                    <i className="fas fa-lock"></i>{" "}
                    {t("profile.updatePassword")}
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {activeSection === "preferences" && (
          <div className="settings-section">
            <h2 className="section-title">{t("profile.preferences")}</h2>
            <form onSubmit={handlePreferencesSubmit}>
              <div className="preferences-group">
                <h3 className="subsection-title">
                  {t("profile.notifications")}
                </h3>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.notifications.newsletter}
                      onChange={() =>
                        handleCheckboxChange("notifications", "newsletter")
                      }
                      disabled={isSubmitting}
                    />
                    <span className="checkbox-text">
                      {t("profile.receiveNewsletter")}
                    </span>
                  </label>
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.notifications.newContent}
                      onChange={() =>
                        handleCheckboxChange("notifications", "newContent")
                      }
                      disabled={isSubmitting}
                    />
                    <span className="checkbox-text">
                      {t("profile.notifyNewContent")}
                    </span>
                  </label>
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.notifications.recommendations}
                      onChange={() =>
                        handleCheckboxChange("notifications", "recommendations")
                      }
                      disabled={isSubmitting}
                    />
                    <span className="checkbox-text">
                      {t("profile.receiveRecommendations")}
                    </span>
                  </label>
                </div>
              </div>

              <div className="preferences-group">
                <h3 className="subsection-title">{t("profile.privacy")}</h3>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.privacy.publicProfile}
                      onChange={() =>
                        handleCheckboxChange("privacy", "publicProfile")
                      }
                      disabled={isSubmitting}
                    />
                    <span className="checkbox-text">
                      {t("profile.publicProfile")}
                    </span>
                  </label>
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.privacy.showActivity}
                      onChange={() =>
                        handleCheckboxChange("privacy", "showActivity")
                      }
                      disabled={isSubmitting}
                    />
                    <span className="checkbox-text">
                      {t("profile.showActivity")}
                    </span>
                  </label>
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.privacy.shareWatchlist}
                      onChange={() =>
                        handleCheckboxChange("privacy", "shareWatchlist")
                      }
                      disabled={isSubmitting}
                    />
                    <span className="checkbox-text">
                      {t("profile.shareWatchlist")}
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>{" "}
                    {t("profile.saving")}
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>{" "}
                    {t("profile.savePreferences")}
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {activeSection === "subscription" && (
          <div className="settings-section">
            <h2 className="section-title">{t("profile.manageSubscription")}</h2>

            <div className="subscription-info">
              <div className="plan-details">
                <h3 className="current-plan">
                  <i className="fas fa-crown"></i> {t("profile.plan")}{" "}
                  {userData.plan}
                </h3>
                <p className="plan-expiry">
                  {t("profile.autoRenewal")}{" "}
                  {new Date(userData.planExpiry).toLocaleDateString()}
                </p>

                <div className="plan-features">
                  <h4>{t("profile.planIncludes")}:</h4>
                  <ul>
                    <li>
                      <i className="fas fa-check"></i>
                      <span>{t("profile.accessToFullCatalog")}</span>
                    </li>
                    <li>
                      <i className="fas fa-check"></i>
                      <span>{t("profile.hdAnd4k")}</span>
                    </li>
                    <li>
                      <i className="fas fa-check"></i>
                      <span>{t("profile.unlimitedDownloads")}</span>
                    </li>
                    <li>
                      <i className="fas fa-check"></i>
                      <span>{t("profile.noAds")}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="subscription-actions">
                <button className="btn-secondary" disabled={isSubmitting}>
                  <i className="fas fa-sync-alt"></i> {t("profile.changePlan")}
                </button>
                <button className="btn-secondary" disabled={isSubmitting}>
                  <i className="fas fa-credit-card"></i>{" "}
                  {t("profile.updatePaymentMethod")}
                </button>
                <button
                  className="btn-secondary cancel-subscription"
                  onClick={handleCancelSubscription}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fas fa-times-circle"></i>
                  )}{" "}
                  {t("profile.cancelSubscription")}
                </button>
              </div>
            </div>

            <div className="billing-history">
              <h3 className="subsection-title">
                {t("profile.billingHistory")}
              </h3>
              <table className="billing-table">
                <thead>
                  <tr>
                    <th>{t("profile.date")}</th>
                    <th>{t("profile.description")}</th>
                    <th>{t("profile.amount")}</th>
                    <th>{t("profile.status")}</th>
                    <th>{t("profile.invoice")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>01/03/2025</td>
                    <td>
                      {t("profile.premiumSubscription")} -{" "}
                      {t("profile.monthly")}
                    </td>
                    <td>€14.99</td>
                    <td>{t("profile.paid")}</td>
                    <td>
                      <button className="btn-icon">
                        <i className="fas fa-file-pdf"></i>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>01/02/2025</td>
                    <td>
                      {t("profile.premiumSubscription")} -{" "}
                      {t("profile.monthly")}
                    </td>
                    <td>€14.99</td>
                    <td>{t("profile.paid")}</td>
                    <td>
                      <button className="btn-icon">
                        <i className="fas fa-file-pdf"></i>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>01/01/2025</td>
                    <td>
                      {t("profile.premiumSubscription")} -{" "}
                      {t("profile.monthly")}
                    </td>
                    <td>€14.99</td>
                    <td>{t("profile.paid")}</td>
                    <td>
                      <button className="btn-icon">
                        <i className="fas fa-file-pdf"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileSettings;
