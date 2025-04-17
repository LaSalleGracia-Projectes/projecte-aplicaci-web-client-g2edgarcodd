import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import LanguageSelector from "../UI/LanguageSelector";
import "../../styles/components/auth.css";

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    date_of_birth: "",
    password: "",
    confirmPassword: "",
    preferredGenres: [],
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Géneros disponibles
  const availableGenres = [
    "Acción",
    "Aventura",
    "Comedia",
    "Drama",
    "Fantasía",
    "Terror",
    "Misterio",
    "Romance",
    "Ciencia Ficción",
    "Thriller",
  ];

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
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "termsAccepted") {
      setFormData({
        ...formData,
        [name]: checked,
      });
      return;
    }

    if (name === "password") {
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

    // Limpiar error de API cuando el usuario cambia algún campo
    if (apiError) {
      setApiError(null);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGenreToggle = (genre) => {
    const currentGenres = [...formData.preferredGenres];
    if (currentGenres.includes(genre)) {
      const updatedGenres = currentGenres.filter((g) => g !== genre);
      setFormData({
        ...formData,
        preferredGenres: updatedGenres,
      });
    } else if (currentGenres.length < 3) {
      setFormData({
        ...formData,
        preferredGenres: [...currentGenres, genre],
      });
    }
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

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 25) return "Débil";
    if (passwordStrength < 100) return "Media";
    return "Fuerte";
  };

  const getPasswordStrengthClass = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 25) return "weak";
    if (passwordStrength < 100) return "medium";
    return "strong";
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }

    if (!formData.surname.trim()) {
      newErrors.surname = "El apellido es obligatorio";
    }

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es obligatorio";
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = "La fecha de nacimiento es obligatoria";
    } else {
      // Validar que la persona tenga al menos 13 años
      const birthDate = new Date(formData.date_of_birth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 13) {
        newErrors.date_of_birth =
          "Debes tener al menos 13 años para registrarte";
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Correo electrónico inválido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "Debes aceptar los términos y condiciones";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      // Desplazarse al inicio del formulario
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const prevStep = () => {
    setStep(1);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 2 && validateStep2()) {
      setIsLoading(true);
      setApiError(null);

      try {
        // Crear el objeto de datos para enviar a la API
        const registerData = {
          username: formData.username,
          name: formData.name,
          surname: formData.surname,
          date_of_birth: formData.date_of_birth,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
        };

        // Realizar la petición POST a la API
        const response = await fetch("http://25.17.74.119:8000/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(registerData),
        });

        const data = await response.json();

        if (!response.ok) {
          // Si hay errores de validación del servidor
          if (data.errors) {
            // Formatear errores de la API para mostrarlos en la interfaz y traducirlos
            const apiErrors = {};
            Object.keys(data.errors).forEach((key) => {
              // Traducir mensajes de error comunes
              const errorMsg = data.errors[key][0];
              if (errorMsg.includes("has already been taken")) {
                apiErrors[key] = t(`auth.${key}Taken`);
              } else if (errorMsg.includes("required")) {
                apiErrors[key] = t(`auth.${key}Required`);
              } else if (errorMsg.includes("valid")) {
                apiErrors[key] = t(`auth.${key}Invalid`);
              } else if (errorMsg === "The given data was invalid.") {
                apiErrors[key] = t("auth.invalidData");
              } else {
                // Mantener el error original como fallback
                apiErrors[key] = data.errors[key][0];
              }
            });
            setErrors(apiErrors);
          } else {
            // Error general
            setApiError(
              data.message === "The given data was invalid."
                ? t("auth.invalidData")
                : t("auth.registerError")
            );
          }
          setIsLoading(false);
          return;
        }

        // Si el registro es exitoso
        console.log("Registro exitoso:", data);

        if (data.sucess === true) {
          // Nota: "sucess" tal como viene del servidor
          setRegistrationSuccess(true);
          setSuccessMessage(
            data.message ||
              "Usuario registrado correctamente. Verifica tu dirección de correo."
          );

          // Después de 3 segundos, redirigir al login
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          // En caso de que el servidor responda con éxito pero sin el formato esperado
          navigate("/login");
        }
      } catch (error) {
        console.error("Error en el registro:", error);
        setApiError(t("auth.connectionError"));
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="auth-container">
      {/* Partículas de fondo */}
      <div className="auth-particles"></div>

      {/* Botón de idioma en la esquina superior derecha (invisible) */}
      <div className="auth-lang-container">
        <LanguageSelector />
      </div>

      <div className="auth-card auth-register-card">
        {registrationSuccess ? (
          <div className="auth-success-container">
            <div className="auth-success-icon auth-green">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2>¡Registro completado!</h2>
            <p>{successMessage}</p>
            <p className="auth-success-info">
              Serás redirigido a la página de inicio de sesión en unos
              segundos...
            </p>
          </div>
        ) : (
          <>
            <div className="auth-header">
              <h2>Crear cuenta</h2>
              <p>Únete a Streamhub y descubre un mundo de entretenimiento</p>
            </div>

            {apiError && <div className="auth-error">{apiError}</div>}

            <div className="auth-steps-indicator">
              <div className={`auth-step ${step >= 1 ? "active" : ""}`}>1</div>
              <div className="auth-step-line">
                <span
                  className="auth-step-progress"
                  style={{ width: step >= 2 ? "100%" : "0%" }}
                ></span>
              </div>
              <div className={`auth-step ${step >= 2 ? "active" : ""}`}>2</div>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {step === 1 && (
                <>
                  <div className="auth-form-group">
                    <label htmlFor="username">Nombre de usuario</label>
                    <div className="auth-input-with-icon">
                      <i className="fas fa-user-tag"></i>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Elige un nombre de usuario único"
                      />
                    </div>
                    {errors.username && (
                      <span className="auth-form-error">{errors.username}</span>
                    )}
                  </div>

                  <div className="auth-form-group">
                    <label htmlFor="name">Nombre</label>
                    <div className="auth-input-with-icon">
                      <i className="fas fa-user"></i>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Escribe tu nombre"
                      />
                    </div>
                    {errors.name && (
                      <span className="auth-form-error">{errors.name}</span>
                    )}
                  </div>

                  <div className="auth-form-group">
                    <label htmlFor="surname">Apellido</label>
                    <div className="auth-input-with-icon">
                      <i className="fas fa-user"></i>
                      <input
                        type="text"
                        id="surname"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        placeholder="Escribe tu apellido"
                      />
                    </div>
                    {errors.surname && (
                      <span className="auth-form-error">{errors.surname}</span>
                    )}
                  </div>

                  <div className="auth-form-group">
                    <label htmlFor="date_of_birth">Fecha de nacimiento</label>
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
                    <label htmlFor="email">Correo electrónico</label>
                    <div className="auth-input-with-icon">
                      <i className="fas fa-envelope"></i>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Escribe tu correo electrónico"
                      />
                    </div>
                    {errors.email && (
                      <span className="auth-form-error">{errors.email}</span>
                    )}
                  </div>

                  <div className="auth-form-group">
                    <label htmlFor="password">Contraseña</label>
                    <div className="auth-input-with-icon">
                      <i className="fas fa-lock"></i>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Crea una contraseña segura"
                      />
                      <i
                        className={`fas ${
                          showPassword ? "fa-eye-slash" : "fa-eye"
                        } auth-password-toggle`}
                        onClick={togglePasswordVisibility}
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
                    {errors.password && (
                      <span className="auth-form-error">{errors.password}</span>
                    )}
                  </div>

                  <div className="auth-form-group">
                    <label htmlFor="confirmPassword">
                      Confirmar contraseña
                    </label>
                    <div className="auth-input-with-icon">
                      <i className="fas fa-lock"></i>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirma tu contraseña"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <span className="auth-form-error">
                        {errors.confirmPassword}
                      </span>
                    )}
                  </div>

                  <div className="auth-password-tips">
                    <h4>Recomendaciones para una contraseña segura:</h4>
                    <ul>
                      <li
                        className={formData.password.length >= 8 ? "valid" : ""}
                      >
                        <i
                          className={
                            formData.password.length >= 8
                              ? "fas fa-check"
                              : "fas fa-times"
                          }
                        ></i>
                        Al menos 8 caracteres
                      </li>
                      <li
                        className={
                          /[A-Z]/.test(formData.password) ? "valid" : ""
                        }
                      >
                        <i
                          className={
                            /[A-Z]/.test(formData.password)
                              ? "fas fa-check"
                              : "fas fa-times"
                          }
                        ></i>
                        Al menos una letra mayúscula
                      </li>
                      <li
                        className={
                          /[a-z]/.test(formData.password) ? "valid" : ""
                        }
                      >
                        <i
                          className={
                            /[a-z]/.test(formData.password)
                              ? "fas fa-check"
                              : "fas fa-times"
                          }
                        ></i>
                        Al menos una letra minúscula
                      </li>
                      <li
                        className={
                          /[0-9]/.test(formData.password) ? "valid" : ""
                        }
                      >
                        <i
                          className={
                            /[0-9]/.test(formData.password)
                              ? "fas fa-check"
                              : "fas fa-times"
                          }
                        ></i>
                        Al menos un número
                      </li>
                      <li
                        className={
                          /[^a-zA-Z0-9]/.test(formData.password) ? "valid" : ""
                        }
                      >
                        <i
                          className={
                            /[^a-zA-Z0-9]/.test(formData.password)
                              ? "fas fa-check"
                              : "fas fa-times"
                          }
                        ></i>
                        Al menos un carácter especial
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    className="auth-button"
                    onClick={nextStep}
                  >
                    Continuar
                    <i className="fas fa-arrow-right auth-button-icon-right"></i>
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="auth-form-group">
                    <label>
                      Selecciona tus géneros favoritos{" "}
                      <span className="auth-label-note">(máximo 3)</span>
                    </label>
                    <div className="auth-genres-grid">
                      {availableGenres.map((genre) => (
                        <div
                          key={genre}
                          className={`auth-genre-item ${
                            formData.preferredGenres.includes(genre)
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => handleGenreToggle(genre)}
                        >
                          {formData.preferredGenres.includes(genre) && (
                            <span className="auth-genre-checkmark">
                              <i className="fas fa-check"></i>
                            </span>
                          )}
                          {genre}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="auth-form-group">
                    <label className="auth-checkbox-container terms-checkbox">
                      <input
                        type="checkbox"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                      />
                      <span className="auth-checkmark"></span>
                      <span className="auth-terms-text">
                        Acepto los{" "}
                        <a href="#" target="_blank" rel="noopener noreferrer">
                          Términos y Condiciones
                        </a>{" "}
                        y la{" "}
                        <a href="#" target="_blank" rel="noopener noreferrer">
                          Política de Privacidad
                        </a>
                      </span>
                    </label>
                    {errors.termsAccepted && (
                      <span className="auth-form-error">
                        {errors.termsAccepted}
                      </span>
                    )}
                  </div>

                  <div className="auth-buttons-group">
                    <button
                      type="button"
                      className="auth-secondary-button"
                      onClick={prevStep}
                    >
                      <i className="fas fa-arrow-left auth-button-icon-left"></i>
                      Atrás
                    </button>
                    <button
                      type="submit"
                      className="auth-button"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <i className="fas fa-circle-notch fa-spin"></i>
                          Procesando...
                        </>
                      ) : (
                        <>
                          Crear cuenta
                          <i className="fas fa-user-plus auth-button-icon-right"></i>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>

            <div className="auth-footer">
              ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Register;
