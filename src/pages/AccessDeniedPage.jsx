import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import "../styles/components/admin/accessDenied.css";

function AccessDeniedPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    if (countdown === 0) {
      navigate("/");
    }

    return () => clearInterval(timer);
  }, [countdown, navigate]);

  // Traducciones de respaldo en caso de que no estén definidas en el contexto
  const unauthorized = t("errors.unauthorized") || "Acceso Denegado";
  const adminOnlyMessage =
    t("errors.adminOnlyMessage") ||
    "Esta sección requiere privilegios de administrador.";
  const accessDeniedMessage =
    t("errors.accessDeniedMessage") ||
    "No tienes permisos para acceder a esta sección del administrador.";
  const redirectMessage =
    t("errors.redirectCountdown") ||
    "Serás redirigido a la página principal en {{seconds}} segundos.";
  const goHome = t("errors.goHome") || "Ir a la página principal";
  const goLogin = t("errors.goLogin") || "Iniciar sesión";

  return (
    <div className="access-denied-container">
      <div className="access-denied-content">
        <i className="fas fa-exclamation-triangle access-denied-icon"></i>
        <h1>{unauthorized}</h1>

        <div className="message">
          <p>
            <strong>{adminOnlyMessage}</strong>
          </p>
          <p>{accessDeniedMessage}</p>
        </div>

        {/* Corregido para que no muestre [object Object] */}
        <p>
          {redirectMessage.replace("{{seconds}}", countdown)}
          <span className="countdown"> {countdown}</span>
        </p>

        <div className="access-denied-buttons">
          <button
            className="access-denied-button"
            onClick={() => navigate("/")}
          >
            <i className="fas fa-home"></i> {goHome}
          </button>

          <button
            className="access-denied-button access-denied-button-secondary"
            onClick={() => navigate("/login")}
          >
            <i className="fas fa-sign-in-alt"></i> {goLogin}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccessDeniedPage;
