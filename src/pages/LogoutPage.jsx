import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const LogoutPage = () => {
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    // Ejecutar la función de logout del contexto
    logout();
  }, [logout]);

  // Redirigir automáticamente al inicio
  return <Navigate to="/" replace />;
};

export default LogoutPage;
