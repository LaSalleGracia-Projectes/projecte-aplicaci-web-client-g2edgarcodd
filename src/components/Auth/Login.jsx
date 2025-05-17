import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { AuthContext } from "../../contexts/AuthContext";
import LanguageSelector from "../UI/LanguageSelector";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "../../styles/components/auth.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLanguage();

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

    // Propiedades aleatorias
    const size = Math.random() * 15 + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Posición inicial aleatoria
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;

    // Opacidad y brillo aleatorios
    particle.style.opacity = Math.random() * 0.6 + 0.1;

    // Velocidad de animación aleatoria
    const duration = Math.random() * 20 + 10;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${Math.random() * 5}s`;

    container.appendChild(particle);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Limpiar error cuando el usuario escribe
    if (error) setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validación básica
    if (!formData.email || !formData.password) {
      setError(t("auth.pleaseCompleteAllFields"));
      setIsLoading(false);
      return;
    }

    try {
      // Codificar parámetros para la URL
      const params = new URLSearchParams({
        email: formData.email,
        password: formData.password,
      }).toString();

      // Realizar la petición GET a la API
      const response = await fetch(
        `http://25.17.74.119:8000/api/login?${params}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Error de autenticación - traducir mensajes comunes
        let errorMessage = "";

        // Mapear errores comunes a claves de traducción
        if (data.message === "The given data was invalid.") {
          errorMessage = t("auth.invalidData");
        } else if (data.message && data.message.includes("credentials")) {
          errorMessage = t("auth.incorrectCredentials");
        } else if (data.message && data.message.includes("password")) {
          errorMessage = t("auth.incorrectPassword");
        } else if (data.message && data.message.includes("email")) {
          errorMessage = t("auth.emailNotFound");
        } else {
          // Si no hay un mapeo específico, usar mensaje genérico
          errorMessage = t("auth.loginError");
        }

        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      // Si el inicio de sesión es exitoso
      if (data.success) {
        console.log("Login exitoso:", data);

        // Guardar datos de la sesión en localStorage
        localStorage.setItem("auth_token", data.access_token);
        localStorage.setItem("token_type", data.token_type);
        localStorage.setItem("user_id", data.user_id);

        // Si "recordarme" está marcado, guardar email para futura sesión
        if (formData.rememberMe) {
          localStorage.setItem("remembered_email", formData.email);
        } else {
          localStorage.removeItem("remembered_email");
        }

        // Llamar a la función de login del contexto para actualizar el estado global
        const loginSuccess = await login(formData.email, formData.password);

        if (loginSuccess) {
          // Redireccionar solo después de confirmar que el login fue exitoso
          setIsLoading(false);
          navigate("/");
        } else {
          setError(t("auth.loginError"));
          setIsLoading(false);
        }
      } else {
        // La API devolvió éxito:false por alguna razón
        setError(
          data.message || "Ha ocurrido un error durante el inicio de sesión."
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error en el login:", error);
      setError(t("auth.connectionError"));
      setIsLoading(false);
    }
  };

  // Cargar email recordado si existe
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("remembered_email");
    if (rememberedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true,
      }));
    }
  }, []);

  const handleSocialLogin = async (provider, response = null) => {
    if (provider !== "Google" || !response) return;

    setIsLoading(true);
    setError("");

    try {
      // Enviar el token ID al backend para verificación
      const apiResponse = await fetch(
        "http://25.17.74.119:8000/api/auth/google/callback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            token: response.credential,
          }),
        }
      );

      const data = await apiResponse.json();

      if (!apiResponse.ok) {
        setError(t("auth.googleLoginError"));
        setIsLoading(false);
        return;
      }

      // Si el inicio de sesión es exitoso
      if (data.success) {
        // Guardar datos de la sesión en localStorage
        localStorage.setItem("auth_token", data.access_token);
        localStorage.setItem("token_type", data.token_type);
        localStorage.setItem("user_id", data.user_id);

        // Actualizar el contexto de autenticación
        await login(null, null, data);

        // Redirigir al usuario
        navigate("/");
      } else {
        setError(data.message || t("auth.loginError"));
      }
    } catch (error) {
      console.error("Error en el login con Google:", error);
      setError(t("auth.connectionError"));
    } finally {
      setIsLoading(false);
    }
  };

  // Reemplazar los botones de redes sociales por componentes adecuados
  const renderSocialButtons = () => {
    // Obtener la URL actual para usarla como origen en la redirección
    const origin = window.location.origin;

    return (
      <div className="auth-social-buttons">
        <GoogleOAuthProvider clientId="85774792902-1mnr01atsj4fha0jc23nadsi8r5ohd9n.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleSocialLogin("Google", credentialResponse);
            }}
            onError={() => {
              console.error("Google Login Failed");
              setError(t("auth.googleLoginError"));
            }}
            useOneTap={false}
            theme="filled_blue"
            text="signin_with"
            shape="circle"
            size="large"
            width={210}
            context="signin"
            locale="es"
            ux_mode="popup"
          />
        </GoogleOAuthProvider>

        <button
          type="button"
          className="auth-social-button auth-facebook"
          onClick={() => handleSocialLogin("Facebook")}
          aria-label={t("auth.loginWithFacebook")}
        >
          <i className="fab fa-facebook-f"></i>
        </button>

        <button
          type="button"
          className="auth-social-button auth-twitter"
          onClick={() => handleSocialLogin("Twitter")}
          aria-label={t("auth.loginWithTwitter")}
        >
          <i className="fab fa-twitter"></i>
        </button>
      </div>
    );
  };

  return (
    <div className="auth-container">
      {/* Partículas de fondo */}
      <div className="auth-particles"></div>

      {/* Botón de idioma en la esquina superior derecha (invisible) */}
      <div className="auth-lang-container">
        <LanguageSelector />
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <h2>{t("auth.login")}</h2>
          <p>
            {t("auth.welcomeBack").replace("{{appName}}", t("common.appName"))}
          </p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
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
                placeholder={t("auth.enterEmail")}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label htmlFor="password">{t("auth.password")}</label>
            <div className="auth-input-with-icon">
              <i className="fas fa-lock"></i>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t("auth.enterPassword")}
                autoComplete="current-password"
              />
              <i
                className={`fas ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                } auth-password-toggle`}
                onClick={togglePasswordVisibility}
              ></i>
            </div>
          </div>
          <Link to="/forgot-password" className="auth-forgot-link">
            {t("auth.forgotPassword")}
          </Link>

          <div className="auth-remember-me">
            <label className="auth-checkbox-container">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span className="auth-checkmark"></span>
              {t("auth.rememberMe")}
            </label>
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <i className="fas fa-circle-notch fa-spin"></i>
                {t("common.processing")}
              </>
            ) : (
              <>
                {t("auth.login")}
                <i className="fas fa-arrow-right auth-button-icon-right"></i>
              </>
            )}
          </button>
        </form>

        <div className="auth-social-login">
          <p>{t("auth.orLoginWith")}</p>
          {renderSocialButtons()}
        </div>

        <div className="auth-footer">
          {t("auth.noAccount")}{" "}
          <Link to="/register">{t("auth.registerHere")}</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
