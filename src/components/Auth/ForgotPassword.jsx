import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import LanguageSelector from "../UI/LanguageSelector";
import "../../styles/components/auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validación básica
    if (!email.trim()) {
      setError("Por favor, introduce tu correo electrónico");
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Correo electrónico inválido");
      setIsLoading(false);
      return;
    }

    // Simulación de envío
    setTimeout(() => {
      console.log("Enviando correo de recuperación a:", email);
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
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
        {!isSubmitted ? (
          <>
            <div className="auth-header">
              <h2>Recuperar contraseña</h2>
              <p>Te enviaremos un correo para restablecer tu contraseña</p>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-form-group">
                <label htmlFor="email">Correo electrónico</label>
                <div className="auth-input-with-icon">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Escribe tu correo electrónico"
                    autoComplete="email"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-circle-notch"></i>
                    Procesando...
                  </>
                ) : (
                  <>
                    Enviar correo de recuperación
                    <i className="fas fa-paper-plane auth-button-icon-right"></i>
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="auth-success-container">
            <div className="auth-success-icon">
              <i className="fas fa-envelope"></i>
            </div>
            <h2>¡Correo enviado!</h2>
            <p>
              Hemos enviado un correo a <strong>{email}</strong> con
              instrucciones para restablecer tu contraseña.
            </p>
            <div className="auth-success-info">
              <p className="auth-check-spam">
                <i className="fas fa-info-circle"></i>
                Si no lo encuentras, revisa tu carpeta de spam o correo no
                deseado.
              </p>
              <p className="auth-expiry-note">
                El enlace expirará en 24 horas.
              </p>
            </div>
          </div>
        )}

        <div className="auth-footer">
          <Link to="/login">
            <i className="fas fa-arrow-left auth-footer-icon"></i>
            Volver a iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
