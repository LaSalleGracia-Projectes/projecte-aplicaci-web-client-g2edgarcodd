import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import AdminVerificationAnimation from "../components/Admin/AdminVerificationAnimation";
import "../styles/components/admin/adminChecking.css";

const AdminCheckingPage = () => {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [verificationStage, setVerificationStage] = useState(1);

  // Simulación del progreso de verificación
  useEffect(() => {
    const simulateProgress = () => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }

          // Cambiar etapa de verificación basada en el progreso
          if (prev >= 30 && prev < 31) setVerificationStage(2);
          if (prev >= 60 && prev < 61) setVerificationStage(3);
          if (prev >= 90 && prev < 91) setVerificationStage(4);

          return prev + 1;
        });
      }, 40);

      return () => clearInterval(interval);
    };

    simulateProgress();
  }, []);

  // Redirección basada en el estado de autenticación
  useEffect(() => {
    if (progress === 100) {
      const redirectTimer = setTimeout(() => {
        if (loading) return;

        if (!isAuthenticated) {
          navigate("/login");
        } else if (!isAdmin) {
          navigate("/access-denied");
        } else {
          navigate("/admin/users"); // Modificado: redirección a users en lugar de dashboard
        }
      }, 500);

      return () => clearTimeout(redirectTimer);
    }
  }, [progress, isAuthenticated, isAdmin, loading, navigate]);

  // Obtener mensaje correspondiente a la etapa de verificación actual
  const getVerificationMessage = () => {
    switch (verificationStage) {
      case 1:
        return t("admin.verifyingCredentials") || "Verificando credenciales...";
      case 2:
        return t("admin.checkingPermissions") || "Comprobando permisos...";
      case 3:
        return t("admin.loadingAdmin") || "Cargando panel de administrador...";
      case 4:
        return t("admin.preparingDashboard") || "Preparando el dashboard...";
      default:
        return t("admin.verifying") || "Verificando...";
    }
  };

  return (
    <div className="admin-checking-container">
      <div className="admin-checking-content">
        <AdminVerificationAnimation />

        <h1>
          {t("admin.checkingAccess") || "Verificando acceso administrativo"}
        </h1>

        <div className="verification-stage">
          <p>{getVerificationMessage()}</p>
        </div>

        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        <p className="admin-checking-info">
          {t("admin.securityCheck") ||
            "Realizando comprobación de seguridad..."}
        </p>
      </div>
    </div>
  );
};

export default AdminCheckingPage;
