import React, { useState, useEffect, useContext } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { AuthContext } from "../../contexts/AuthContext";
import LanguageSelector from "../UI/LanguageSelector";
import "../../styles/components/auth.css";

function UpdateProfile() {
  const { t } = useLanguage();
  const { user, fetchUserInfo } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    date_of_birth: "",
    avatar: null,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [previewAvatar, setPreviewAvatar] = useState(
    "/api/placeholder/150/150"
  );
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' o 'password'
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Cargar datos del usuario cuando el componente se monte
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        surname: user.surname || "",
        username: user.username || "",
        email: user.email || "",
        date_of_birth: user.date_of_birth || "",
      }));

      // Si el usuario tiene un avatar, mostrarlo
      if (user.avatar) {
        setPreviewAvatar(user.avatar);
      }
    }
  }, [user]);

  // Efecto para crear partículas decorativas
  useEffect(() => {
    const particles = document.querySelector(".auth-particles");
    if (!particles) return;

    for (let i = 0; i < 15; i++) {
      createParticle(particles);
    }

    return () => {
      const existingParticles = document.querySelectorAll(".auth-particle");
      existingParticles.forEach((particle) => particle.remove());
    };
  }, []);

  const createParticle = (container) => {
    const particle = document.createElement("div");
    particle.classList.add("auth-particle");

    const size = Math.random() * 15 + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.opacity = Math.random() * 0.6 + 0.1;

    const duration = Math.random() * 20 + 10;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${Math.random() * 5}s`;

    container.appendChild(particle);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      if (files[0]) {
        setFormData({
          ...formData,
          [name]: files[0],
        });
        setPreviewAvatar(URL.createObjectURL(files[0]));
      }
      return;
    }

    if (name === "newPassword") {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    // Limpiar error específico cuando el usuario corrige
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  const calculatePasswordStrength = (password) => {
    if (!password) return 0;

    // Definir los criterios
    const criteria = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[^a-zA-Z0-9]/.test(password),
    };

    // Contar cuántos criterios se cumplen
    const metCriteria = Object.values(criteria).filter(Boolean).length;

    // Determinar la fortaleza según criterios cumplidos
    if (metCriteria === 5) {
      return 100; // Fuerte - 100% (todos los 5 criterios)
    } else if (metCriteria >= 3) {
      return 50; // Medio - 50% (3-4 criterios)
    } else {
      return 25; // Bajo - 25% (1-2 criterios)
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (activeTab === "profile") {
      if (!formData.name.trim()) {
        newErrors.name = t("auth.nameRequired");
      }
    } else {
      if (!formData.currentPassword) {
        newErrors.currentPassword = t("auth.currentPasswordRequired");
      }

      if (formData.newPassword) {
        if (formData.newPassword.length < 8) {
          newErrors.newPassword = t("auth.passwordMinLength");
        }

        if (formData.newPassword !== formData.confirmPassword) {
          newErrors.confirmPassword = t("auth.passwordsDontMatch");
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const userId = localStorage.getItem("user_id");
      const token = localStorage.getItem("auth_token");

      if (!userId || !token) {
        setErrors({ general: t("auth.notAuthenticated") });
        setIsLoading(false);
        return;
      }

      // Preparar los datos para la actualización según la pestaña activa
      const updateData = { user_id: userId };

      // Si es la pestaña de perfil, añadir datos personales
      if (activeTab === "profile") {
        updateData.name = formData.name;
        updateData.surname = formData.surname;
        updateData.username = formData.username;
        updateData.date_of_birth = formData.date_of_birth;

        // Como password es obligatorio, usamos una contraseña vacía
        // para indicar que no queremos cambiarla
        updateData.password = "";
        updateData.password_confirmation = "";
      } else {
        // Si es la pestaña de contraseña
        updateData.password = formData.newPassword;
        updateData.password_confirmation = formData.confirmPassword;

        // Incluimos también los datos del perfil para que no se pierdan
        updateData.name = formData.name;
        updateData.surname = formData.surname;
        updateData.username = formData.username;
        updateData.date_of_birth = formData.date_of_birth;
      }

      // Realizar la petición PUT a la API
      const response = await fetch("http://25.17.74.119:8000/api/updateUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Manejar errores de la API
        if (data.errors) {
          const apiErrors = {};
          Object.keys(data.errors).forEach((key) => {
            apiErrors[key] = data.errors[key][0];
          });
          setErrors(apiErrors);
        } else {
          setErrors({
            general: data.message || t("auth.errorUpdatingProfile"),
          });
        }
        setIsLoading(false);
        return;
      }

      // Si la actualización es exitosa
      setSuccessMessage(
        activeTab === "profile"
          ? t("profile.profileUpdatedSuccess")
          : t("profile.passwordChangedSuccess")
      );

      // Limpiar campos de contraseña después de actualizar
      if (activeTab === "password") {
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordStrength(0);
      }

      // Actualizar la información del usuario en el contexto
      if (userId && token) {
        await fetchUserInfo(userId, token);
      }

      // Mostrar animación de éxito
      const successMsg = document.querySelector(".auth-success-message");
      if (successMsg) {
        successMsg.classList.add("animate-success");
        setTimeout(() => {
          if (successMsg) {
            successMsg.classList.remove("animate-success");
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      setErrors({ general: t("auth.connectionError") });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 25) return t("profile.passwordStrength.débil");
    if (passwordStrength < 100) return t("profile.passwordStrength.media");
    return t("profile.passwordStrength.fuerte");
  };

  const getPasswordStrengthClass = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 25) return "weak";
    if (passwordStrength <= 75) return "medium";
    return "strong";
  };

  return (
    <div className="auth-profile-container">
      {/* Partículas de fondo */}
      <div className="auth-particles"></div>

      {/* Botón de idioma en la esquina superior derecha */}
      <div className="auth-lang-container">
        <LanguageSelector />
      </div>

      <div className="auth-profile-card">
        <div className="auth-profile-header">
          <h2>{t("profile.editProfile")}</h2>
          <p>{t("profile.personalInfo")}</p>
        </div>

        {successMessage && (
          <div className="auth-success-message">
            <i className="fas fa-check-circle"></i>
            {successMessage}
          </div>
        )}

        {errors.general && <div className="auth-error">{errors.general}</div>}

        <div className="auth-profile-tabs">
          <button
            className={`auth-tab-button ${
              activeTab === "profile" ? "active" : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <i className="fas fa-user"></i>
            {t("profile.personalInfo")}
          </button>
          <button
            className={`auth-tab-button ${
              activeTab === "password" ? "active" : ""
            }`}
            onClick={() => setActiveTab("password")}
          >
            <i className="fas fa-lock"></i>
            {t("profile.changePassword")}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-profile-form">
          {activeTab === "profile" && (
            <>
              <div className="auth-avatar-section">
                <div className="auth-avatar-preview-large">
                  <img
                    src={previewAvatar}
                    alt="Avatar preview"
                    className="auth-avatar-image"
                  />
                  <label htmlFor="avatar" className="auth-avatar-edit-button">
                    <i className="fas fa-camera"></i>
                  </label>
                  <input
                    type="file"
                    id="avatar"
                    name="avatar"
                    accept="image/*"
                    onChange={handleChange}
                    className="auth-file-input"
                  />
                </div>
              </div>

              <div className="auth-form-group">
                <label htmlFor="name">{t("auth.name")}</label>
                <div className="auth-input-with-icon">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t("auth.name")}
                  />
                </div>
                {errors.name && (
                  <span className="auth-form-error">{errors.name}</span>
                )}
              </div>

              <div className="auth-form-group">
                <label htmlFor="surname">{t("auth.lastName")}</label>
                <div className="auth-input-with-icon">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    id="surname"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    placeholder={t("auth.lastName")}
                  />
                </div>
                {errors.surname && (
                  <span className="auth-form-error">{errors.surname}</span>
                )}
              </div>

              <div className="auth-form-group">
                <label htmlFor="username">{t("auth.username")}</label>
                <div className="auth-input-with-icon">
                  <i className="fas fa-user-tag"></i>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder={t("auth.username")}
                  />
                </div>
                {errors.username && (
                  <span className="auth-form-error">{errors.username}</span>
                )}
              </div>

              <div className="auth-form-group">
                <label htmlFor="date_of_birth">{t("auth.dateOfBirth")}</label>
                <div className="auth-input-with-icon">
                  <i className="fas fa-calendar"></i>
                  <input
                    type="date"
                    id="date_of_birth"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>
                {errors.date_of_birth && (
                  <span className="auth-form-error">
                    {errors.date_of_birth}
                  </span>
                )}
              </div>

              <div className="auth-form-group">
                <label htmlFor="email">{t("auth.email")}</label>
                <div className="auth-input-with-icon">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t("auth.email")}
                    disabled
                  />
                </div>
                <span className="auth-input-note">
                  {t("profile.cannotChangeEmail")}
                </span>
              </div>
            </>
          )}

          {activeTab === "password" && (
            <>
              <div className="auth-form-group">
                <label htmlFor="currentPassword">
                  {t("profile.currentPassword")}
                </label>
                <div className="auth-input-with-icon">
                  <i className="fas fa-lock"></i>
                  <input
                    type={showPassword.current ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder={t("profile.currentPassword")}
                  />
                  <i
                    className={`fas ${
                      showPassword.current ? "fa-eye-slash" : "fa-eye"
                    } auth-password-toggle`}
                    onClick={() => togglePasswordVisibility("current")}
                  ></i>
                </div>
                {errors.currentPassword && (
                  <span className="auth-form-error">
                    {errors.currentPassword}
                  </span>
                )}
              </div>

              <div className="auth-form-group">
                <label htmlFor="newPassword">{t("profile.newPassword")}</label>
                <div className="auth-input-with-icon">
                  <i className="fas fa-lock"></i>
                  <input
                    type={showPassword.new ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder={t("profile.newPassword")}
                  />
                  <i
                    className={`fas ${
                      showPassword.new ? "fa-eye-slash" : "fa-eye"
                    } auth-password-toggle`}
                    onClick={() => togglePasswordVisibility("new")}
                  ></i>
                </div>
                {passwordStrength > 0 && (
                  <div className="auth-password-strength">
                    <div className="auth-strength-bar">
                      <div
                        className={`auth-strength-progress ${getPasswordStrengthClass()}`}
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                    <span className="auth-strength-text">
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                )}
                {errors.newPassword && (
                  <span className="auth-form-error">{errors.newPassword}</span>
                )}
                {errors.password && (
                  <span className="auth-form-error">{errors.password}</span>
                )}
              </div>

              <div className="auth-form-group">
                <label htmlFor="confirmPassword">
                  {t("profile.confirmNewPassword")}
                </label>
                <div className="auth-input-with-icon">
                  <i className="fas fa-lock"></i>
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={t("profile.confirmNewPassword")}
                  />
                  <i
                    className={`fas ${
                      showPassword.confirm ? "fa-eye-slash" : "fa-eye"
                    } auth-password-toggle`}
                    onClick={() => togglePasswordVisibility("confirm")}
                  ></i>
                </div>
                {errors.confirmPassword && (
                  <span className="auth-form-error">
                    {errors.confirmPassword}
                  </span>
                )}
                {errors.password_confirmation && (
                  <span className="auth-form-error">
                    {errors.password_confirmation}
                  </span>
                )}
              </div>

              <div className="auth-password-tips">
                <h4>{t("auth.passwordRequirements")}</h4>
                <ul>
                  <li
                    className={formData.newPassword.length >= 8 ? "valid" : ""}
                  >
                    <i
                      className={
                        formData.newPassword.length >= 8
                          ? "fas fa-check"
                          : "fas fa-times"
                      }
                    ></i>
                    {t("auth.passwordMinChars")}
                  </li>
                  <li
                    className={
                      /[A-Z]/.test(formData.newPassword) ? "valid" : ""
                    }
                  >
                    <i
                      className={
                        /[A-Z]/.test(formData.newPassword)
                          ? "fas fa-check"
                          : "fas fa-times"
                      }
                    ></i>
                    {t("auth.passwordUppercase")}
                  </li>
                  <li
                    className={
                      /[a-z]/.test(formData.newPassword) ? "valid" : ""
                    }
                  >
                    <i
                      className={
                        /[a-z]/.test(formData.newPassword)
                          ? "fas fa-check"
                          : "fas fa-times"
                      }
                    ></i>
                    {t("auth.passwordLowercase")}
                  </li>
                  <li
                    className={
                      /[0-9]/.test(formData.newPassword) ? "valid" : ""
                    }
                  >
                    <i
                      className={
                        /[0-9]/.test(formData.newPassword)
                          ? "fas fa-check"
                          : "fas fa-times"
                      }
                    ></i>
                    {t("auth.passwordNumber")}
                  </li>
                  <li
                    className={
                      /[^a-zA-Z0-9]/.test(formData.newPassword) ? "valid" : ""
                    }
                  >
                    <i
                      className={
                        /[^a-zA-Z0-9]/.test(formData.newPassword)
                          ? "fas fa-check"
                          : "fas fa-times"
                      }
                    ></i>
                    {t("auth.passwordSpecialChar")}
                  </li>
                </ul>
              </div>
            </>
          )}

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? (
              <>
                {t("profile.saving")}
                <i className="fas fa-spinner fa-spin auth-button-icon-right"></i>
              </>
            ) : (
              <>
                {activeTab === "profile"
                  ? t("profile.saveChanges")
                  : t("profile.updatePassword")}
                <i
                  className={`fas ${
                    activeTab === "profile" ? "fa-save" : "fa-key"
                  } auth-button-icon-right`}
                ></i>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfile;
